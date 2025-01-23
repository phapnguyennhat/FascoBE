import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryParam } from 'src/common/queryParam';
import { Tag } from 'src/database/entity/tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagService {

  constructor(@InjectRepository(Tag) private readonly tagRepo: Repository<Tag>){
    
  }

  async find(query:QueryParam){
    const {page, limit} = query

    return this.tagRepo.find({
      skip: (page - 1) * limit,
      take: limit,
    })
  }
}
