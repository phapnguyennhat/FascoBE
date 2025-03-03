import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import JwtAuthGuard from '../auth/guard/jwt-auth.guard';
import { CreateProductDto } from './dto/createProduct.dto';

import { IdParam } from 'src/common/validate';

import { CreateVarientDto } from './dto/createVarient.dto';
import { AnyFilesInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { DataSource, In } from 'typeorm';
import { ImageService } from '../image/image.service';
import { QueryProductDto } from './dto/queryProduct';
import { SearchParams } from 'src/common/searchParams';
import { Product } from 'src/database/entity/product.entity';
import RoleGuard from '../auth/guard/role.guard';
import { ERole } from 'src/database/entity/user.entity';
import { Varient } from 'src/database/entity/varient.entity';
import { hasDuplicateVariants } from 'src/util/hasDuplicateVarient';
import { StringValueNamesDto } from './dto/stringValueNames.dto';
import { calcVarient, hasDuplicate } from 'src/util/utils';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { AttrProduct } from 'src/database/entity/attrProduct.entity';
import { ValueAttr } from 'src/database/entity/valueAttr.entity';
import { Image } from 'src/database/entity/image.entity';
import { UpdateImageDto } from './dto/updateImage.dto';
import { Tag } from 'src/database/entity/tag.entity';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly dataSource: DataSource,
    private readonly imageService: ImageService,
  ) {}

  @Post()
  @UseGuards(RoleGuard(ERole.ADMIN))
  @UseGuards(JwtAuthGuard)
  async create(@Req() req, @Body() createProductDto: CreateProductDto) {
    const { createVarientDtos, attrProducts } = createProductDto;

    const totalVarients = attrProducts.reduce(
      (res, item) => res * item.valueAttrs.length,
      1,
    );
    if (createVarientDtos.length !== totalVarients) {
      throw new BadRequestException('Missing varient');
    }
    if (hasDuplicateVariants(createVarientDtos)) {
      throw new BadRequestException('Variants cannot have the same value');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const { minPrice, totalPieceAvail } = calcVarient(createVarientDtos);
      
      const tags = await queryRunner.manager.find(Tag, {
        where: {id: In(createProductDto.tagIds)}
      })

      const newProduct = await this.productService.create(
        {
          ...createProductDto,
          userId: req.user.id,
          tags,
          price: minPrice,
          pieceAvail: totalPieceAvail,
        },
        queryRunner,
      );

      await Promise.all(
        createVarientDtos.map(async (createVarientDto) => {
          const attrValueNames = createVarientDto.attrValueNames;
          const attrValues =
            await this.productService.findValueByNamesAndProductId(
              attrValueNames,
              newProduct.id,
              queryRunner,
            );

          if (attrValues.length !== attrProducts.length) {
            throw new BadRequestException('missing attribute');
          }

          await queryRunner.manager.save(Varient, {
            ...createVarientDto,
            productId: newProduct.id,
            valueAttrs: attrValues,
          });
        }),
      );

      await queryRunner.commitTransaction();
      return newProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  @Put(':id')
  @UseGuards(RoleGuard(ERole.ADMIN))
  @UseGuards(JwtAuthGuard)
  async updateProduct(
    @Param() { id }: IdParam,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    const { updateAttrProductDtos, updateVarientDtos } = updateProductDto;

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const product = await queryRunner.manager.findOneBy(Product, { id });
      if (!product) {
        throw new NotFoundException('Not found product');
      }
      Object.assign(product, updateProductDto);
      const tags =await queryRunner.manager.find(Tag, {where: {id: In(updateProductDto.tagIds)}})
      product.tags=tags
      await queryRunner.manager.save(Product, product);

      if (updateAttrProductDtos) {
        await Promise.all(
          updateAttrProductDtos.map(async (updateAttrProductDto) => {
            const attrProduct: AttrProduct =
              await queryRunner.manager.findOneBy(AttrProduct, {
                productId: id,
                id: updateAttrProductDto.id,
              });
            if (!attrProduct) {
              throw new NotFoundException('Not found product attribute');
            }
            Object.assign(attrProduct, updateAttrProductDto);
            await queryRunner.manager.save(AttrProduct, attrProduct);

            const { updateValueAttrDtos } = updateAttrProductDto;
            if (updateValueAttrDtos) {
              await Promise.all(
                updateValueAttrDtos.map(async (updateValueAttrDto) => {
                  const valueAttr: ValueAttr =
                    await queryRunner.manager.findOneBy(ValueAttr, {
                      id: updateValueAttrDto.id,
                      attrProductId: attrProduct.id,
                    });
                  if (!valueAttr) {
                    throw new NotFoundException('Not found attribute value');
                  }
                  Object.assign(valueAttr, updateValueAttrDto);

                  await queryRunner.manager.save(ValueAttr, valueAttr);
                }),
              );
            }
          }),
        );
      }

      if (updateVarientDtos) {
        await Promise.all(
          updateVarientDtos.map(async (updateVarientDto) => {
            const varient = await queryRunner.manager.findOneBy(Varient, {
              id: updateVarientDto.id,
              productId: id,
            });
            if (!varient) {
              throw new NotFoundException('Not found variant');
            }
            Object.assign(varient, updateVarientDto);
            await queryRunner.manager.save(Varient, varient);
          }),
        );
      }

      await queryRunner.commitTransaction();
      return { message: 'update thanh cong' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  @Post(':id/image')
  @UseGuards(RoleGuard(ERole.ADMIN))
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async uploadProductImages(
    @Body() { stringValueNames }: StringValueNamesDto,
    @Param() { id }: IdParam,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp|gif)$/,
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024, // 🎯 Giới hạn file tối đa 5MB
        })
        

        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Express.Multer.File[],
  ) {
    const valueNames = stringValueNames.split(',');

    if (hasDuplicate(valueNames)) {
      throw new BadRequestException('Has duplicate value name');
    }

    let productImages = [];
    let valueImages = [];
    files.forEach((file) => {
      if (file.fieldname === 'valueImages') {
        valueImages.push(file);
      } else {
        productImages.push(file);
      }
    });

    if (productImages.length === 0) {
      throw new BadRequestException('Image product is required');
    }

    if (valueImages.length !== valueNames.length) {
      throw new BadRequestException('Missing image value');
    }

    if (productImages.length > 10) {
      throw new BadRequestException('Product Images must be less than 10');
    }

    const valueAttrs =
      await this.productService.findValueHasImageByProductId(id);
    if (valueAttrs.length !== valueNames.length) {
      throw new BadRequestException(
        `this product has ${valueAttrs.length} value which has image`,
      );
    }

    const updateValues = await Promise.all(
      valueNames.map(async (value) => {
        return await this.productService.findValueByNameAndProductId(value, id);
      }),
    );

    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await Promise.all(
        productImages.map(async (file) => {
          await this.imageService.create(file, id, queryRunner);
        }),
      );

      await Promise.all(
        valueImages.map(async (file, index) => {
          const newImage = await this.imageService.create(
            file,
            undefined,
            queryRunner,
          );
          const valueAttr = updateValues[index];
          await this.productService.updateAttrValue(
            valueAttr.id,
            { imageId: newImage.id },
            queryRunner,
          );
        }),
      );

      await queryRunner.commitTransaction();
      return { message: 'Upload image successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  @Put(':id/image')
  @UseGuards(RoleGuard(ERole.ADMIN))
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async updateImages(
    @Param() { id }: IdParam,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp|gif)$/,
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024, // 🎯 Giới hạn file tối đa 5MB
        })

        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false
        }),
    )
    files: Express.Multer.File[],

    @Body() { stringValueIds, stringUpdateImageIds, stringDeleteImageIds}: UpdateImageDto
  ) {

    const productImages = [];
    const valueImages = [];
    files.forEach((file) => {
    
      if (file.fieldname === 'valueImages') {
        valueImages.push(file);
      } else {
        productImages.push(file);
      }
    });

    const updateImageIds = stringUpdateImageIds?.split(',') ||[]
    const deleteImageIds = stringDeleteImageIds?.split(',') ||[]
    const valueIds = stringValueIds?.split(',') || []
    const setDeleteImageIds = new Set(deleteImageIds)
    const isDeleteIdInUpdateId = updateImageIds.some(item => setDeleteImageIds.has(item));
    if(isDeleteIdInUpdateId){
      throw new BadRequestException('Ảnh xóa rồi thì không cập nhật nữa ')
    }
    if(valueIds.length !== valueImages.length){
      throw new BadRequestException('số phần tử valueIds phải bằng với valueImages ')
    }
    if(productImages.length < updateImageIds.length){
      throw new BadRequestException('Số phần tử productImages phải lớn hơn hoặc bằng với updateImageIds')
    }
    

    const queryRunner = this.dataSource.createQueryRunner()
    try {
      await queryRunner.connect()
      await queryRunner.startTransaction()

      const product= await queryRunner.manager.findOneBy(Product, {id})
      if(!product){
        throw new NotFoundException('Not found product')
      }

      // update value image
      await Promise.all(valueIds.map(async (valueId, index)=>{
        const valueAttr = await queryRunner.manager.findOneBy(ValueAttr, {
          id: valueId,
        });
        if(!valueAttr){
          throw new NotFoundException('Not found value')
        }

        const image = valueImages[index]
        await this.imageService.delete(valueAttr.imageId,queryRunner)
        const newImage = await this.imageService.create(image, undefined, queryRunner)
        await this.productService.updateAttrValue(valueAttr.id, {imageId:newImage.id}, queryRunner)
      }))

      // delete product image
      await Promise.all(deleteImageIds.map( async (imageId)=>{
        await this.imageService.delete(imageId, queryRunner)
      }))

      // update product image
      await Promise.all(
        productImages.map(async (productImage, index) => {
          const updateImageId = updateImageIds[index];
          if (updateImageId) {
            await this.imageService.delete(updateImageId, queryRunner);
          }
          await this.imageService.create(productImage, product.id, queryRunner);
        }),
      );
      
      await queryRunner.commitTransaction()
      return {message: 'update image successfully'}
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally{
      queryRunner.release()
    }


    
  }

  @Get()
  async findProduct(@Query() queryProduct: QueryProductDto) {
    return this.productService.findProduct(queryProduct);
  }

  @Get(':id')
  async findProductById(
    @Param() { id }: IdParam,
    @Query() { userId }: { userId: string },
  ) {
    return this.productService.findProductById(id, userId);
  }

  @Get(':id/detail')
  @UseGuards(RoleGuard(ERole.ADMIN))
  @UseGuards(JwtAuthGuard)
  async findProductDetailById(@Param() { id }: IdParam) {
    return this.productService.findProductDetailById(id);
  }

  @Get(':id/varient')
  async findVarient(@Param() { id }: IdParam, @Query() query: SearchParams) {
    const productAttrs = await this.productService.findAttrByProductId(id);
    const valueIds = await Promise.all(
      productAttrs.map(async (productAttr) => {
        const value = query[productAttr.name] as string;
        const attrValue = await this.productService.findValueByNameAndProductId(
          value,
          id,
        );
        return attrValue.id;
      }),
    );

    return this.productService.findVarientByValueIds(valueIds);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(ERole.ADMIN))
  @UseGuards(JwtAuthGuard)
  async deleteProduct(@Param() { id }: IdParam) {
    const product = await this.productService.findProductById(id);
    const { images, attrProducts } = product;

    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Delete image, value, attribute
      await Promise.all(
        attrProducts.map(async (attrProduct) => {
          await Promise.all(
            attrProduct.valueAttrs.map(async (valueAttr) => {
              await this.imageService.delete(valueAttr.image?.id, queryRunner);
              await this.productService.deleteValueAttr(
                valueAttr.id,
                queryRunner,
              );
            }),
          );
          await this.productService.deleteAttrProduct(
            attrProduct.id,
            queryRunner,
          );
        }),
      );

      //delete varient
      await this.productService.deleteVarientByProductId(
        product.id,
        queryRunner,
      );

      // delete product Images, product

      await Promise.all(
        images.map(async (image) => {
          await this.imageService.delete(image?.id, queryRunner);
        }),
      );
      await this.productService.deleteProduct(product.id, queryRunner);

      await queryRunner.commitTransaction();
      return { message: 'Delete product successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // @Delete(':id/image/:imageId')
  // @UseGuards(RoleGuard(ERole.ADMIN))
  // @UseGuards(JwtAuthGuard)
  // async deleteProductImage(
  //   @Param() { id, imageId }: { id: string; imageId: string },
  // ) {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   try {
  //     await queryRunner.connect();
  //     await queryRunner.startTransaction();

  //     const product = await queryRunner.manager.findOne(Product, {
  //       where: { id },
  //       relations: { images: true },
  //     });
  //     const images = product.images;
  //     if (images.length <= 1) {
  //       throw new BadRequestException(
  //         'Product has only one image, you can not delete this image',
  //       );
  //     }
  //     const foundImage = images.find((image) => image.id === imageId);
  //     if (!foundImage) {
  //       throw new NotFoundException('Not found product image');
  //     }
  //     await this.imageService.delete(foundImage.id, queryRunner);

  //     await queryRunner.commitTransaction();
  //     return { message: 'Delete product image successfully' };
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     throw error;
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  // @Put('/value/:id/image')
  // @UseGuards(RoleGuard(ERole.ADMIN))
  // @UseGuards(JwtAuthGuard)
  // @UseInterceptors(FileInterceptor('image'))
  // async updateValueImage(
  //   @Param()
  //   { id }: { id: string;  },
  //   @UploadedFile() image: Express.Multer.File
  // ) {

  //   if(!image){
  //     throw new BadRequestException('Image is required')
  //   }
  //   const queryRunner = this.dataSource.createQueryRunner()

  //   try {
  //     await queryRunner.connect()
  //     await queryRunner.startTransaction()

  //     const valueAttr = await queryRunner.manager.findOne(ValueAttr, {
  //       where: {
  //         id
  //       },
  //       relations: {
  //         attrProduct: true
  //       }
  //     })
  //     if(!valueAttr.attrProduct.hasImage){
  //       throw new BadRequestException('Can not upload image for this value')
  //     }
  //     await this.imageService.delete(valueAttr.imageId, queryRunner)
  //     const newImage = await this.imageService.create(image, undefined, queryRunner)
  //     await this.productService.updateAttrValue(
  //       valueAttr.id,
  //       { imageId: newImage.id },
  //       queryRunner,
  //     );

  //     await queryRunner.commitTransaction()
  //     return {message: 'Update image successfully'}
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction()
  //     throw error
  //   } finally{
  //     await queryRunner.release()
  //   }
  // }
}


