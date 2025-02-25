import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import JwtAuthGuard from '../auth/guard/jwt-auth.guard';
import { CreateFavoriteDto } from './dto/createFavorite.dto';
import { ProductIdsDto } from './dto/productIds.dto';
import { QueryFavoriteDto } from './dto/queryFavorite.dto';

@Controller('')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}


  @Post('user/favorite/:productId')
  @UseGuards(JwtAuthGuard)
  async create(@Req() req, @Param('productId') productId: string){
    return this.favoriteService.create({productId,userId: req.user.id})
  }

  @Delete('user/favorite')
  @UseGuards(JwtAuthGuard)
  async delete(@Req() req,  @Body(){productIds}: ProductIdsDto){
    return this.favoriteService.deleteAbulk(req.user.id, productIds)
  }

  @Get('user/favorite')
  @UseGuards(JwtAuthGuard)
  async getFavorite(@Req() req, @Query() queryFavoriteDto: QueryFavoriteDto){
    return this.favoriteService.findByUser(req.user.id, queryFavoriteDto)
  }
}

