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
    return this.categoryRepo.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
