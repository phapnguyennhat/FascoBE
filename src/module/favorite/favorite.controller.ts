import { Body, Controller, Delete, Get, Inject, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import JwtAuthGuard from '../auth/guard/jwt-auth.guard';
import { CreateFavoriteDto } from './dto/createFavorite.dto';
import { ProductIdsDto } from './dto/productIds.dto';
import { QueryFavoriteDto } from './dto/queryFavorite.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { REDIS_MANAGER } from 'src/common/constant';
import Redis from 'ioredis';
import { genKeyQuery } from 'src/util/utils';

@Controller('')
export class FavoriteController {
  constructor(
    private readonly favoriteService: FavoriteService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(REDIS_MANAGER) private readonly redisManager: Redis,
  ) {}

  @Post('user/favorite/:productId')
  @UseGuards(JwtAuthGuard)
  async create(@Req() req, @Param('productId') productId: string) {
    const result = await this.favoriteService.create({
      productId,
      userId: req.user.id,
    });

    const keys = await this.redisManager.keys(`user-detail:${req.user.id}:favorite:*`)
    await Promise.all([
      this.cacheManager.mdel(keys),
      this.cacheManager.del(`product-detail:${productId}:${genKeyQuery({userId: req.user.id})}`)
    ])

    return result;
  }

  @Delete('user/favorite')
  @UseGuards(JwtAuthGuard)
  async delete(@Req() req, @Body() { productIds }: ProductIdsDto) {
    const result = await this.favoriteService.deleteAbulk(req.user.id, productIds);
    await Promise.all(productIds.map(async (productId) => {
      const keys = await this.redisManager.keys(`user-detail:${req.user.id}:favorite:*`)
      await Promise.all([
        this.cacheManager.mdel(keys),
        this.cacheManager.del(`product-detail:${productId}:${genKeyQuery({userId: req.user.id})}`)
      ])
    }))
    return result
  }

  @Get('user/favorite')
  @UseGuards(JwtAuthGuard)
  async getFavorite(@Req() req, @Query() queryFavoriteDto: QueryFavoriteDto) {
    return this.cacheManager.wrap(
      `user-detail:${req.user.id}:favorite:${genKeyQuery(queryFavoriteDto as any) || 'user'}`,
      () => this.favoriteService.findByUser(req.user.id, queryFavoriteDto),
    );
  }
}

