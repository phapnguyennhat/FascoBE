import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryParam } from 'src/common/queryParam';
import { Tag } from 'src/database/entity/tag.entity';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/createTag.dto';

@Injectable()
export class TagService {

  constructor(@InjectRepository(Tag) private readonly tagRepo: Repository<Tag>){}

  async find(query:QueryParam){
    const {page, limit} = query
    
    if(!page ||!limit){
      return this.tagRepo.find()
    }

    return this.tagRepo.find({
      skip: (page - 1) * limit,
      take: limit,
    })
  }

  async create(createTagDto: CreateTagDto){
    return this.tagRepo.save(createTagDto)
  }
}
