import { Controller, Get, Query } from '@nestjs/common';
import { BrandService } from './brand.service';
import { QueryParam } from 'src/common/queryParam';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  async find(@Query() query: QueryParam){
    return this.brandService.find(query)
  }
}
