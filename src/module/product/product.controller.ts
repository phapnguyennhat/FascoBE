import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
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
import {
  CreateAttrProduct,
  CreateAttrProductDtos,
} from './dto/createAttrProduct.dto';
import { IdParam } from 'src/common/validate';
import {
  CreateAbulkValueAttrDto,
  CreateValueAttr,
  CreateValueAttrDto,
} from './dto/createValueAttr.dto';
import { CreateVarientDto } from './dto/createVarient.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { DataSource } from 'typeorm';
import { ImageService } from '../image/image.service';
import { ValueAttr } from 'src/database/entity/valueAttr.entity';
import { AttrProduct } from 'src/database/entity/attrProduct.entity';
import { QueryProductDto } from './dto/queryProduct';
import { hasDuplicateAttrName } from 'src/util/hasDuplicateAttrName';
import { SearchParams } from 'src/common/searchParams';
import { Product } from 'src/database/entity/product.entity';
import RoleGuard from '../auth/guard/role.guard';
import { ERole } from 'src/database/entity/user.entity';
import { stringValueIdsDto } from './dto/stringValueIds.dto';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly dataSource: DataSource,
    private readonly imageService: ImageService,
  ) {}

  @Post('')
  @UseGuards(RoleGuard(ERole.ADMIN))
  @UseGuards(JwtAuthGuard)
  create(@Req() req, @Body() createProductDto: CreateProductDto) {
    return this.productService.create(req.user.id, createProductDto);
  }

  @Post(':id/image')
  @UseGuards(RoleGuard(ERole.ADMIN))
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images'))
  async createImagesProduct(
    @UploadedFiles() files: Express.Multer.File[],
    @Param() { id }: IdParam,
  ) {
    if (files.length === 0) {
      throw new BadRequestException('Images is required');
    }

    await this.productService.findById(id)

    const productImages = await this.imageService.findByProductId(id) || []

    const queryRunner =this.dataSource.createQueryRunner()

    try {
      await queryRunner.connect()
      await queryRunner.startTransaction()

      await Promise.all([productImages.map(item => this.imageService.delete(item.id), queryRunner)])
      await Promise.all(files.map((file) => this.imageService.create(file, id, queryRunner)));


      await queryRunner.commitTransaction()
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally{
      await queryRunner.release()
    }

    return { message: 'upload images successfully' };
  }

  @Post(':id/attrProduct')
  @UseGuards(RoleGuard(ERole.ADMIN))
  @UseGuards(JwtAuthGuard)
  createAttrProduct(
    @Param() { id }: IdParam,
    @Body() createAttrProductDtos: CreateAttrProductDtos,
  ) {
    const createAttrProducts: CreateAttrProduct[] =
      createAttrProductDtos.createAttrProducts.map((item) => ({
        ...item,
        productId: id,
      }));
    return this.productService.createAttr(createAttrProducts);
  }

  // @Post(':id/valueAttr')
  // @UseGuards(JwtAuthGuard)
  // @UseInterceptors(FileInterceptor('image'))
  // async createValueAttr(
  //   @Param() { id }: IdParam,
  //   @Body() createValueAttrDto: CreateValueAttrDto,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   if (!file) {
  //     throw new BadRequestException('Images is required');
  //   }
  //   const attrProduct = await this.productService.findAttrByNameAndProductId(
  //     createValueAttrDto.attrName,
  //     id,
  //   );
  //   if (!attrProduct.hasImage) {
  //     throw new BadRequestException('This Attr is not required images');
  //   }
  //   try {
  //     await queryRunner.connect();
  //     await queryRunner.startTransaction();

  //     const new_image = await this.imageService.create(
  //       file,
  //       undefined,
  //       queryRunner,
  //     );
  //     const new_valueAttr = await this.productService.createValueAttr(
  //       {
  //         ...createValueAttrDto,
  //         productId: id,
  //         imageId: new_image.id,
  //       },
  //       queryRunner,
  //     );

  //     await queryRunner.commitTransaction();
  //     return { message: 'create successfully' };
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     throw error;
  //   } finally {
  //     queryRunner.release();
  //   }
  // }

  @Post(':id/valueAttr/image')
  @UseGuards(RoleGuard(ERole.ADMIN))
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images'))
  async createValueImages (
    @UploadedFiles() files: Express.Multer.File[],
    @Param() {id}: IdParam,
    @Body() {stringvalueIds}: stringValueIdsDto
  ) {

    if (files.length === 0) {
      throw new BadRequestException('Images is required');
    }

    console.log({stringvalueIds})
    
    const valueIds : string[] = stringvalueIds.split(',')
    const valueAttrs= await this.productService.findValueHasImageByIdsJoinAttr(id, valueIds)
    if(valueAttrs.length !== files.length){
      throw new BadRequestException('value missing image')
    }

    const queryRunner = this.dataSource.createQueryRunner()

    try {
      await queryRunner.connect()
      await queryRunner.startTransaction()

      await Promise.all(
        files.map( async(file, index) => {
         const newFile = await this.imageService.create(file, undefined, queryRunner);
         const attrValue = valueAttrs[index]
         if (attrValue.imageId){
          await this.imageService.delete(attrValue.imageId, queryRunner)
         }
         await this.productService.updateAttrValue(attrValue.id,{imageId: newFile.id}, queryRunner)
        }),
      );

      await queryRunner.commitTransaction()
      return {message: 'Upload Value Image successfully'}
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
      
    }finally{
      await queryRunner.release()
    }

  }


  @Post(':id/valueAttr')
  @UseGuards(RoleGuard(ERole.ADMIN))
  @UseGuards(JwtAuthGuard)
  async createAbulkValueAttr(
    @Param() { id }: IdParam,
    @Body() createAbulkValueAttrDto: CreateAbulkValueAttrDto,
  ) {

    const {createValueAttrDtos} = createAbulkValueAttrDto

    const setAttrName = new Set(createValueAttrDtos.map(item => item.attrName));
    const productAttrs = await this.productService.findAttrByProductId(id)
    
    if( productAttrs.length !== setAttrName.size ){
      throw new BadRequestException('These are attributes missing values')
    }

    const createValueAttrs: CreateValueAttr[] =
      createValueAttrDtos.map((item) => ({
        ...item,
        productId: id,
      }));
    return this.productService.createAbulkValueAttr(createValueAttrs);
  }

  @Post(':id/varient')
  @UseGuards(JwtAuthGuard)
  async createVarient(
    @Param() { id }: IdParam,
    @Body() createVarientDto: CreateVarientDto,
  ) {
    const attrProducts: AttrProduct[] =
      await this.productService.findAttrByProductId(id);
    const { valueAttrIds } = createVarientDto;
    if (attrProducts.length !== valueAttrIds.length) {
      throw new BadRequestException('Missing attribute');
    }

    const valueAttrs: ValueAttr[] =
      await this.productService.findValueByIdsAndProductId(valueAttrIds, id);

    if (valueAttrIds.length !== valueAttrs.length) {
      throw new NotFoundException('value not found');
    }

    if (hasDuplicateAttrName(valueAttrs)) {
      throw new BadRequestException('Duplicate attrName found in valueAttrs');
    }

    const varient =
      await this.productService.findVarientByValueIds(valueAttrIds);
    if (varient) {
      throw new BadRequestException('This varient already have created ');
    }
    return this.productService.createVarient({
      ...createVarientDto,
      productId: id,
      valueAttrs,
    });
  }

  @Get(':id/varient')
  async findVarient(
    @Query() searchParams: SearchParams,
    @Param() { id }: IdParam,
  ) {
    const product: Product = await this.productService.findProductById(id);
    const valueAttrIds: string[] = await this.productService.getValueAttrIds(
      searchParams,
      id,
    );
    if(product.attrProducts.length !== valueAttrIds.length){
      throw new BadRequestException('Can not find varient')
    }
    return this.productService.findVarientByValueIds(valueAttrIds)
    
  }

  @Get()
  async findProduct(@Query() queryProduct: QueryProductDto) {
    return this.productService.findProduct(queryProduct);
  }

  @Get(':id')
  async findProductById(@Param() { id }: IdParam, @Query() {userId}: {userId: string}) {
    return this.productService.findProductById(id, userId);
  }

  
}


