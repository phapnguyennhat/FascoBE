import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Inject } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import JwtAuthGuard from '../auth/guard/jwt-auth.guard';
import RoleGuard from '../auth/guard/role.guard';
import { ERole } from 'src/database/entity/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { REDIS_MANAGER } from 'src/common/constant';
import Redis from 'ioredis';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(REDIS_MANAGER) private readonly redisManager: Redis
  ) {}

  @Post()
  @UseGuards(RoleGuard(ERole.ADMIN))
  @UseGuards(JwtAuthGuard)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const result = await this.categoryService.create(createCategoryDto);
    await this.cacheManager.del('category-search')
    return result
  }

  @Get()
  findAll() {
    return this.cacheManager.wrap(`category-search`,()=>this.categoryService.findAll(), 30*60*1000)
  }

  @Put(':id')
  @UseGuards(RoleGuard(ERole.ADMIN))
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    const result = await this.categoryService.update(id, updateCategoryDto);
    await this.cacheManager.del('category-search')
    return result
  }

  @Delete(':id')
  @UseGuards(RoleGuard(ERole.ADMIN))
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    const result = await this.categoryService.remove(id);
    await this.cacheManager.del('category-search')
    return result
  }
}
