import { Controller, Get, Query } from '@nestjs/common';
import { TagService } from './tag.service';
import { QueryParam } from 'src/common/queryParam';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  find(@Query() query: QueryParam){
    return this.tagService.find(query)
  }
}
