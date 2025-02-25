import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryParam } from 'src/common/queryParam';
import { Brand } from 'src/database/entity/brand.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CreateBrand, CreateBrandDto } from './dto/createBrand.dto';
import { UpdateBrand } from './dto/updateBrand.dto';
import { take } from 'rxjs';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand) private readonly brandRepo: Repository<Brand>,
  ) {}

  async find(query: QueryParam) {
    const {page, limit}  =query

    if(page && limit){
      return this.brandRepo.find({skip: (page-1)* limit, take: limit})
    }
    
    const brands = await this.brandRepo.find({order: {name: 'ASC'}})
    const grouped = brands.reduce((acc, brand) => {
      let initial = brand.name.charAt(0).toUpperCase();
      if(!(initial>='A' && initial <='Z')){
        initial='#'
      }
      if (!acc[initial]) {
        acc[initial] = [];
      }
      acc[initial].push(brand);
      return acc;
    }, {});
  
    return {groupedShop: grouped, count: brands.length};
  }

  async findAll(){
    return this.brandRepo.find({order: {name: 'ASC'}})
  }

  async create(createBrand: CreateBrand, queryRunner? : QueryRunner){
    if(queryRunner){
      return queryRunner.manager.save(Brand, createBrand)
    }
    return this.brandRepo.save(createBrand)
  }

  async update(id: string,updateBrand: UpdateBrand, queryRunner?: QueryRunner){
    if(queryRunner){
      return queryRunner.manager.update(Brand, id, updateBrand)
    }
    return this.brandRepo.update(id, updateBrand)
  }

  async findById(id: string){
    const brand = await this.brandRepo.findOneBy({id})
    if(!brand){
      throw new NotFoundException('Not found brand')
    }
    return brand
  }

  async deleteById(id: string, queryRunner?:QueryRunner){
    if(queryRunner){
      console.log({id}, 'delet this id')
      return queryRunner.manager.delete(Brand, {id})
    }
    return this.brandRepo.delete(id)
  }

}
