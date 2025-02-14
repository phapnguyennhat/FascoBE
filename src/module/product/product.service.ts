import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/database/entity/product.entity';
import { Any, In, QueryRunner, Repository } from 'typeorm';
import { CreateProduct, CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { AttrProduct } from 'src/database/entity/attrProduct.entity';
import {
  CreateAttrProduct,
  CreateAttrProductDtos,
} from './dto/createAttrProduct.dto';
import { ValueAttr } from 'src/database/entity/valueAttr.entity';
import { Varient } from 'src/database/entity/varient.entity';
import { CreateVarient, CreateVarientDto } from './dto/createVarient.dto';
import { CreateValueAttr } from './dto/createValueAttr.dto';
import { Tag } from 'src/database/entity/tag.entity';
import { ECollection, QueryProductDto } from './dto/queryProduct';
import { VarientValue } from 'src/database/entity/varient_value.entity';
import { SearchParams } from 'src/common/searchParams';
import { string } from 'joi';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(AttrProduct)
    private readonly attrProductRepo: Repository<AttrProduct>,
    @InjectRepository(ValueAttr)
    private readonly valueAttrRepo: Repository<ValueAttr>,
    @InjectRepository(Varient)
    private readonly varientRepo: Repository<Varient>,
    @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,
    @InjectRepository(VarientValue)
    private readonly varientValueRepo: Repository<VarientValue>,
  ) {}

  async create(userId: string, createProductDto: CreateProductDto) {
    // return this.productRepo.save(createProduct)
    const tags: Tag[] = await this.tagRepo.find({
      where: { name: In(createProductDto.tagNames) },
    });
    const createProduct: CreateProduct = { ...createProductDto, userId, tags };
    return this.productRepo.save(createProduct);
  }

  async createAttr(createAttrProducts: CreateAttrProduct[]) {
    return this.attrProductRepo.insert(createAttrProducts);
  }

  async createValueAttr(
    createValueAttr: CreateValueAttr,
    queryRunner?: QueryRunner,
  ) {
    if (queryRunner) {
      return queryRunner.manager.save(ValueAttr, createValueAttr);
    }
    return this.valueAttrRepo.save(createValueAttr);
  }

  async createAbulkValueAttr(createValueAttrs: CreateValueAttr[]) {
    return this.valueAttrRepo.insert(createValueAttrs);
  }

  async createVarient(createVarient: CreateVarient) {
    return this.varientRepo.save(createVarient);
  }

  async update(
    productId: string,
    updateProductDto: UpdateProductDto,
    queryRunner?: QueryRunner,
  ) {
    if (queryRunner) {
      return queryRunner.manager.update(Product, productId, updateProductDto);
    }
    return this.productRepo.update(productId, updateProductDto);
  }

  async findById(productId: string) {
    const product: Product = await this.productRepo.findOneBy({
      id: productId,
    });
    if (!product) {
      throw new NotFoundException('Product doesnt exist');
    }
    return product;
  }

  async findProduct(queryProduct: QueryProductDto) {
    const {
      page,
      limit,
      brandName,
      categoryName,
      collection,
      maxPrice,
      minPrice,
      tag,
      size,
    } = queryProduct;
    const queryBuilder = this.productRepo
      .createQueryBuilder('product')
      .innerJoin('product.user', 'user')
      .innerJoin('product.images', 'images')
      .select([
        'product.id',
        'product.name',
        'product.price',
        'product.pieceAvail',
        'product.reviewNumber',
        'user.name',
        'images.url',
      ])
      .skip((page - 1) * limit)
      .take(limit);

    if (size) {
      queryBuilder
        .innerJoin('product.attrProducts', 'attrProducts')
        .innerJoin('attrProducts.valueAttrs', 'valueAttrs')
        .andWhere("valueAttrs.attrName='Size' ")
        .andWhere('valueAttrs.value = :size', { size });
    }

    // Thêm điều kiện cho tagNames (nếu có)
    if (tag) {
      queryBuilder
        .leftJoin('product.tags', 'tag')
        .andWhere('tag.name = :tag', { tag });
    }

    // Thêm điều kiện cho categoryName (nếu có)
    if (categoryName) {
      queryBuilder.andWhere('product.categoryName = :categoryName', {
        categoryName,
      });
    }

    // Thêm điều kiện cho brandName (nếu có)
    if (brandName) {
      queryBuilder.andWhere('product.brandName = :brandName', {
        brandName,
      });
    }

    // Thêm điều kiện cho minPrice (nếu có)
    if (minPrice) {
      queryBuilder.andWhere('product.price >= :minPrice', {
        minPrice,
      });
    }

    // Thêm điều kiện cho maxPrice (nếu có)
    if (queryProduct.maxPrice) {
      queryBuilder.andWhere('product.price <= :maxPrice', {
        maxPrice,
      });
    }

    // Thêm điều kiện cho collection (nếu có)
    if (collection) {
      switch (collection) {
        case ECollection.ALLPRODUCT:
          break; // Không cần thêm điều kiện
        case ECollection.BESTSELLER:
          queryBuilder.orderBy('product.sold', 'DESC');
          break;
        case ECollection.NEWARRIVAL:
          queryBuilder.orderBy('product.createdAt', 'DESC');
          break;
        case ECollection.LOWTOHIGH:
          queryBuilder.orderBy('product.price', 'ASC');
          break;
        case ECollection.HIGHTOLOW:
          queryBuilder.orderBy('product.price', 'DESC');
          break;
      }
    }
    // Execute the query
    const [data, count] = await queryBuilder.getManyAndCount();
    return { products: data, count };
  }

  async findAttrByNameAndProductId(name: string, productId: string) {
    const attrProduct: AttrProduct = await this.attrProductRepo.findOneBy({
      name,
      productId,
    });
    if (!attrProduct) {
      throw new NotFoundException('Attr Product not found');
    }
    return attrProduct;
  }

  async findAttrByProductId(productId: string) {
    return this.attrProductRepo.findBy({ productId });
  }

  async findValueById(valueAttrId) {
    return this.valueAttrRepo.findOneBy({ id: valueAttrId });
  }



  async findProductById(productId: string, userId?:string) {
    const queryBuilder = this.productRepo
      .createQueryBuilder('product')
      .innerJoin('product.images', 'images')
      .innerJoin('product.attrProducts', 'attrProducts')
      .innerJoin('attrProducts.valueAttrs', 'valueAttrs')
      .leftJoin('valueAttrs.image', 'image')
      .orderBy('attrProducts.hasImage', 'DESC')
      .andWhere('product.id=:productId', {productId})
    
      .select([
        'product.id',
        'product.name',
        'product.starRating',
        'product.reviewNumber',
        'product.sold',
        'product.pieceAvail',
        'product.price',
        'attrProducts.name',
        'valueAttrs.value',
        'valueAttrs.id',
        'images.id',
        'images.url',
        'image.url',
   

      ])
      
       queryBuilder .leftJoin('product.favoriteDetails', 'favoriteDetails','favoriteDetails.userId=:userId',{userId})
        // .andWhere('favoriteDetails.userId=:userId', {userId})
        .addSelect('favoriteDetails')

    const product =  await queryBuilder.getOne()

    if (!product) {
      throw new NotFoundException('Product not exist');
    }
    return product;
  }

  async findValueByIdsAndProductId(valueAttrIds: string[], productId: string) {
    return this.valueAttrRepo.find({
      where: {
        id: In(valueAttrIds),
        productId,
      },
    });
  }

  async findValueAttrByProductId(productId: string) {
    return this.valueAttrRepo.findBy({ productId });
  }

  async findVarientById(varientId: string) {
    const varient: Varient = await this.varientRepo.findOneBy({
      id: varientId,
    });
    if (!varient) {
      throw new NotFoundException('Not found varient');
    }
    return varient;
  }

  async getValueAttrIds(searchParams: SearchParams, productId: string) {
    const valueAttrIds = await Promise.all(  
      Object.entries(searchParams).map(async ([key, value]) => {
        const valueAttr = await this.valueAttrRepo.findOneBy({
          attrName: key,
          value: value as string,
          productId,
        });
        
        return valueAttr?.id
      })
    );
  
    return valueAttrIds.filter((id): id is string => id !== undefined);
  }

  async findVarientByValueIds(valueAttrIds: string[]) {
    const varientIds: { varientId: string }[] = await this.varientValueRepo
      .createQueryBuilder('vv')
      .select('vv.varientId', 'varientId')
      .where('vv.valueAttrId = ANY(:valueAttrIds)', { valueAttrIds })
      .groupBy('vv.varientId')
      .having(
        `ARRAY_AGG(vv.valueAttrId ORDER BY vv.valueAttrId) @> ARRAY[:valueAttrIds]::uuid[]`,
        { valueAttrIds },
      )
      .getRawMany();
    if (varientIds.length !== 1) {
      return null;
    }
    return this.varientRepo.findOneBy({ id: varientIds[0].varientId });
  }

  async delete(productId: string, queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.delete(Product, productId);
    }
    return this.productRepo.delete(productId);
  }
}
