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

import { ValueAttr } from 'src/database/entity/valueAttr.entity';
import { Varient } from 'src/database/entity/varient.entity';
import { CreateVarient, CreateVarientDto } from './dto/createVarient.dto';
import { Tag } from 'src/database/entity/tag.entity';
import { ECollection, QueryProductDto } from './dto/queryProduct';
import { VarientValue } from 'src/database/entity/varient_value.entity';
import { SearchParams } from 'src/common/searchParams';
import { Cron } from '@nestjs/schedule';
import { UpdateValueAttr, UpdateValueAttrDto } from './dto/updateValueAttr.dto';
import { UpdateOrderDto } from '../order/dto/updateOrder.dto';
import { UpdateAttrProductDto } from './dto/updateAttrProduct.dto';

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

  async create(createProduct: CreateProduct, queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.save(Product, createProduct);
    }
    return this.productRepo.save(createProduct);
  }

  async updateAttrValue(
    id: string,
    updateValueAttr: UpdateValueAttr,
    queryRunner?: QueryRunner,
  ) {
    const valueAttr = await this.getValueById(id, queryRunner);
    Object.assign(valueAttr, updateValueAttr);
    if (queryRunner) {
      return queryRunner.manager.save(ValueAttr, valueAttr);
    }
    return this.valueAttrRepo.save(valueAttr);
  }

 

  async getValueById(id: string, queryRunner?: QueryRunner) {
    let valueAttr: ValueAttr | undefined = undefined;
    if (queryRunner) {
      valueAttr = await queryRunner.manager.findOneBy(ValueAttr, { id });
    } else {
      valueAttr = await this.valueAttrRepo.findOneBy({ id });
    }
    if (!valueAttr) {
      throw new NotFoundException('Not found attr value');
    }
    return valueAttr;
  }

  async findProduct(queryProduct: QueryProductDto) {
    let {
      page,
      limit,
      keyword,
      brandName,
      categoryName,
      collection,
      maxPrice,
      minPrice,
      tag,
      size,
    } = queryProduct;

    page = page || 1;
    limit = limit || 9;
    const queryBuilder = this.productRepo
      .createQueryBuilder('product')
      .innerJoin('product.user', 'user')
      .innerJoin('product.images', 'images')
      .select([
        'product.id',
        'product.name',
        'product.price',
        'product.pieceAvail',
        'product.discountPrice',
        'product.createAt',
        'product.sold',
        'product.reviewNumber',
        'user.name',
        'images.url',
      ])
      .andWhere('product.price IS NOT NULL')
      .skip((page - 1) * limit)
      .take(limit || 9);

    if (keyword) {
      queryBuilder.andWhere('product.name ILIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }

    if (size) {
      queryBuilder
        .innerJoin('product.attrProducts', 'attrProducts')
        .innerJoin('attrProducts.valueAttrs', 'valueAttrs')
        .andWhere("attrProducts.name='Size' ")
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
      queryBuilder
        .innerJoin('product.brand', 'brand')
        .andWhere('brand.name = :brandName', {
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
          queryBuilder.orderBy('product.createAt', 'DESC');
          break;
        case ECollection.LOWTOHIGH:
          queryBuilder.orderBy('product.price', 'ASC');
          break;
        case ECollection.HIGHTOLOW:
          queryBuilder.orderBy('product.price', 'DESC');
          break;
        case ECollection.DEALS:
          queryBuilder
            .andWhere('product.discountPrice IS NOT NULL')
            .andWhere('product.discountPrice >0');
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

  async findValueByNamesAndProductId(
    attrValueNames: string[],
    productId: string,
    queryRunner?: QueryRunner,
  ) {
    if (queryRunner) {
      const queryBuilder = this.valueAttrRepo
        .createQueryBuilder('valueAttr', queryRunner)
        .innerJoin(
          'valueAttr.attrProduct',
          'attrProduct',
          'attrProduct.productId = :productId',
          { productId },
        )
        .andWhere('valueAttr.value IN (:...attrValueNames)', { attrValueNames })
        .distinctOn(['attrProduct.name'])
        .select(['valueAttr', 'attrProduct.name']);

      return queryBuilder.getMany();
    }
  }

  async findValueHasImageByProductId(productId: string) {
    const queryBuilder = this.valueAttrRepo
      .createQueryBuilder('valueAttr')
      .innerJoin(
        'valueAttr.attrProduct',
        'attrProduct',
        'attrProduct.productId = :productId',
        { productId },
      )
      .andWhere('attrProduct.hasImage = true');

    return queryBuilder.getMany();
  }

  async findValueByNameAndProductId(value: string, productId: string) {
    const queryBuilder = this.valueAttrRepo
      .createQueryBuilder('valueAttr')
      .innerJoin(
        'valueAttr.attrProduct',
        'attrProduct',
        'attrProduct.productId = :productId',
        { productId },
      )
      .andWhere('valueAttr.value =:value', { value });
    const valueAttr = await queryBuilder.getOne();
    if (!valueAttr) {
      throw new NotFoundException(`Not found value ${value}`);
    }
    return valueAttr;
  }

  async findValueHasImageByIdsJoinAttr(productId: string, valueIds: string[]) {
    const queryBuilder = this.valueAttrRepo
      .createQueryBuilder('valueAttr')
      .innerJoin(
        'valueAttr.attrProduct',
        'attrProduct',
        'attrProduct.hasImage = true',
      )
      .andWhere('valueAttr.productId =:productId', { productId })
      .andWhere('valueAttr.id IN (:...valueIds)', { valueIds })
      .select(['valueAttr']);
    return queryBuilder.getMany();
  }

  async findProductById(productId: string, userId?: string) {
    const queryBuilder = this.productRepo
      .createQueryBuilder('product')
      .leftJoin('product.images', 'images')
      .innerJoin('product.attrProducts', 'attrProducts')
      .innerJoin('attrProducts.valueAttrs', 'valueAttrs')
      .leftJoin('valueAttrs.image', 'image')
      .orderBy('attrProducts.hasImage', 'DESC')
      .andWhere('product.id=:productId', { productId })

      .select([
        'product.id',
        'product.name',
        'product.starRating',
        'product.reviewNumber',
        'product.sold',
        'product.pieceAvail',
        'product.price',
        'attrProducts.id',
        'attrProducts.name',
        'attrProducts.hasImage',
        'valueAttrs.value',
        'valueAttrs.id',
        'images.id',
        'images.url',
        'image.id',
        'image.url',
      ]);

    queryBuilder
      .leftJoin(
        'product.favoriteDetails',
        'favoriteDetails',
        'favoriteDetails.userId=:userId',
        { userId },
      )
      // .andWhere('favoriteDetails.userId=:userId', {userId})
      .addSelect('favoriteDetails');

    const product = await queryBuilder.getOne();

    if (!product) {
      throw new NotFoundException('Product not exist');
    }
    return product;
  }

  async findProductDetailById(id: string) {
    const queryBuilder = this.productRepo
      .createQueryBuilder('product')
      .andWhere('product.id = :id', { id })
      .innerJoin('product.tags', 'tags')
      .innerJoin('product.attrProducts', 'attrProducts')
      .innerJoin('attrProducts.valueAttrs', 'valueAttrs')
      .innerJoin('product.varients', 'varients')
      .leftJoin('product.images', 'images')
      .leftJoin('valueAttrs.image', 'image')
      .innerJoin('varients.valueAttrs', 'varientvalueAttrs')
      .innerJoin('varientvalueAttrs.attrProduct', 'attrProduct')
      .orderBy('attrProducts.hasImage', 'DESC')
      .addOrderBy('valueAttrs.id', 'DESC')
      .addOrderBy('images.id', 'DESC')

      .select([
        'product.id',
        'product.name',
        'product.categoryName',
        'product.brandId',
        'tags.name',
        'attrProducts.id',
        'attrProducts.name',
        'valueAttrs.id',
        'valueAttrs.value',
        'varients.id',
        'varients.pieceAvail',
        'varients.price',
        'varients.discountPrice',
        'varientvalueAttrs.id',
        'varientvalueAttrs.value',
        'images.id',
        'images.url',
        'image.id',
        'image.url'
      ]);

    return queryBuilder.getOne();
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

  async deleteValueAttr(id: string, queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.delete(ValueAttr, id);
    }
    return this.valueAttrRepo.delete(id);
  }

  async deleteAttrProduct(id: string, queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.delete(AttrProduct, id);
    }
    return this.attrProductRepo.delete(id);
  }

  async deleteProduct(id: string, queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.delete(Product, id);
    }
    return this.productRepo.delete(id);
  }

  async deleteVarientByProductId(productId: string, queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.delete(Varient, { productId });
    }
    return this.varientRepo.delete({ productId });
  }

  @Cron('0 0 1 * *')
  async setNullDiscountPrice() {
    console.log('set null discount price for all varient');
    this.varientRepo.update({}, { discountPrice: null });
  }
}
