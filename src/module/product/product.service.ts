import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/database/entity/product.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CreateProduct, CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { AttrProduct } from 'src/database/entity/attrProduct.entity';
import { CreateAttrProduct, CreateAttrProductDtos } from './dto/createAttrProduct.dto';
import { ValueAttr } from 'src/database/entity/valueAttr.entity';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(AttrProduct) private readonly attrProductRepo: Repository<AttrProduct>,
    @InjectRepository(ValueAttr) private readonly valueAttrRepo: Repository<ValueAttr>
  ){}

  async create(createProduct: CreateProduct){
    return this.productRepo.save(createProduct)
  }

  async createAttr(createAttrProducts:CreateAttrProduct[] ){
    return this.attrProductRepo.insert(createAttrProducts)
  }

  async createValueAttr(){
    
  }

  async update(productId: string, updateProductDto: UpdateProductDto, queryRunner?: QueryRunner){
    if(queryRunner){
      return queryRunner.manager.update(Product, productId, updateProductDto)
    }
    return this.productRepo.update(productId, updateProductDto)
  }



  async delete (productId:string, queryRunner?:QueryRunner){
    if(queryRunner){
      return queryRunner.manager.delete(Product, productId)
    }
    return this.productRepo.delete(productId)
  }

}
