import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/database/entity/product.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CreateProduct, CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product) private readonly productRepo: Repository<Product>
  ){}

  async create(createProduct: CreateProduct){
    return this.productRepo.save(createProduct)
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
