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
      tagNames,
    } = queryProduct;
    const queryBuilder = this.productRepo
      .createQueryBuilder('product')
      .skip((page - 1) * limit)
      .take(limit);

    // Thêm điều kiện cho tagNames (nếu có)
    if (tagNames && tagNames.length > 0) {
      queryBuilder
        .leftJoin('product.tags', 'tag')
        .andWhere('tag.name IN (:...tagNames)', { tagNames });
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
    return await queryBuilder.getMany();
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

  async findVarientById(varientId :string){
    const varient: Varient = await this.varientRepo.findOneBy({id: varientId})
    if(!varient){
      throw new NotFoundException('Not found varient')
    }
    return varient
  }

  async findVarientByValueIds(valueAttrIds: string[]) {
    const varientIds: {varientId: string}[]= await this.varientValueRepo
    .createQueryBuilder('vv')
    .select('vv.varientId', 'varientId')
    .where('vv.valueAttrId = ANY(:valueAttrIds)', { valueAttrIds })
    .groupBy('vv.varientId')
    .having(
      `ARRAY_AGG(vv.valueAttrId ORDER BY vv.valueAttrId) @> ARRAY[:valueAttrIds]::uuid[]`,
      { valueAttrIds }
    )
    .getRawMany();
    if(varientIds.length!==1){
      return null
    }
    return this.varientRepo.findOneBy({id: varientIds[0].varientId})
    
  }

  async delete(productId: string, queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.delete(Product, productId);
    }
    return this.productRepo.delete(productId);
  }
}
