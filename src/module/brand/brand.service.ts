import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryParam } from 'src/common/queryParam';
import { Brand } from 'src/database/entity/brand.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand) private readonly brandRepo: Repository<Brand>,
  ) {}

  async find(query: QueryParam) {
    const { page, limit } = query;
    return this.brandRepo.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
