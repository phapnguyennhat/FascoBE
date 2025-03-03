import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/database/entity/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {

  constructor(@InjectRepository(Category) private readonly categoryRepo: Repository<Category>){}
  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryRepo.save(createCategoryDto)
  }

  findAll() {
    return this.categoryRepo.find({
      order: {
        name: 'ASC'
      }
    })
  }



  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryRepo.update(id, updateCategoryDto)
  }

  remove(id: string) {
    return this.categoryRepo.delete(id)
  }
}
