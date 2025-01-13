import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/database/entity/product.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CreateProduct, CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { AttrProduct } from 'src/database/entity/attrProduct.entity';
import { CreateAttrProduct, CreateAttrProductDtos } from './dto/createAttrProduct.dto';
import { ValueAttr } from 'src/database/entity/valueAttr.entity';
import { Varient } from 'src/database/entity/varient.entity';
import { CreateVarient } from './dto/createVarient.dto';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(AttrProduct) private readonly attrProductRepo: Repository<AttrProduct>,
    @InjectRepository(ValueAttr) private readonly valueAttrRepo: Repository<ValueAttr>,
    @InjectRepository(Varient) private readonly varientRepo: Repository<Varient>,
  ){}

  async create(createProduct: CreateProduct){
    return this.productRepo.save(createProduct)
  }

  async createAttr(createAttrProducts:CreateAttrProduct[] ){
    return this.attrProductRepo.insert(createAttrProducts)
  }

  async createVarient (createVarient: CreateVarient){
    return createVarient
  }


  async update(productId: string, updateProductDto: UpdateProductDto, queryRunner?: QueryRunner){
    if(queryRunner){
      return queryRunner.manager.update(Product, productId, updateProductDto)
    }
    return this.productRepo.update(productId, updateProductDto)
  }

  async findById(productId: string){
    const product: Product= await this.productRepo.findOneBy({id: productId})
    if(!product){
      throw new NotFoundException('Product doesnt exist')
    }
    return  product
  }



  async delete (productId:string, queryRunner?:QueryRunner){
    if(queryRunner){
      return queryRunner.manager.delete(Product, productId)
    }
    return this.productRepo.delete(productId)
  }

}
