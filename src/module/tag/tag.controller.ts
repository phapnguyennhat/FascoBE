import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { QueryParam } from 'src/common/queryParam';
import JwtAuthGuard from '../auth/guard/jwt-auth.guard';
import RoleGuard from '../auth/guard/role.guard';
import { ERole } from 'src/database/entity/user.entity';
import { CreateTagDto } from './dto/createTag.dto';
import { UpdateTagDto } from './dto/updateTag.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import Redis from 'ioredis';
import { genKeyQuery } from 'src/util/utils';

@Controller('tag')
export class TagController {
  constructor(
    private readonly tagService: TagService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject('REDIS_MANAGER') private readonly redisManager: Redis,
  ) {}

  @Get()
  find(@Query() query: QueryParam) {
    return this.cacheManager.wrap(
      `tag-search:${genKeyQuery(query as any)}`,
      () => this.tagService.find(query),30*60*1000
    );
  }

  @Post()
  @UseGuards(RoleGuard(ERole.ADMIN))
  @UseGuards(JwtAuthGuard)
  async create(@Body() createTagDto: CreateTagDto) {
    const result = await this.tagService.create(createTagDto);
    const keys = await this.redisManager.keys('tag-search:*');
    await this.cacheManager.mdel(keys);
    return result;
  }

  @Put(':id')
  @UseGuards(RoleGuard(ERole.ADMIN))
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    const result = await this.tagService.update(id, updateTagDto);
    const keys = await this.redisManager.keys('tag-search:*');
    await this.cacheManager.mdel(keys);
    return result;
  }

  @Delete(':id')
  @UseGuards(RoleGuard(ERole.ADMIN))
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    const result = await this.tagService.delete(id);
    const keys = await this.redisManager.keys('tag-search:*');
    await this.cacheManager.mdel(keys);
    return result;
  }
}
