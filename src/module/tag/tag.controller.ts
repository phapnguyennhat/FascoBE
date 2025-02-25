import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { TagService } from './tag.service';
import { QueryParam } from 'src/common/queryParam';
import JwtAuthGuard from '../auth/guard/jwt-auth.guard';
import RoleGuard from '../auth/guard/role.guard';
import { ERole } from 'src/database/entity/user.entity';
import { CreateTagDto } from './dto/createTag.dto';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  find(@Query() query: QueryParam){
    return this.tagService.find(query)
  }

  @Post()
  @UseGuards(RoleGuard(ERole.ADMIN))
  @UseGuards(JwtAuthGuard)
  async create(@Body() createTagDto: CreateTagDto){
    return this.tagService.create(createTagDto)
  }
}
