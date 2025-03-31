import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import JwtAuthGuard from 'src/module/auth/guard/jwt-auth.guard';
import { Request } from 'express';
import { CreateCartItemDto } from './dto/createCartItem.dto';
import { UpdateCartItemDto } from './dto/updateCartItem.dto';
import { IdParam } from 'src/common/validate';
import RoleGuard from '../auth/guard/role.guard';
import { ERole } from 'src/database/entity/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import Redis from 'ioredis';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @UseGuards(RoleGuard(ERole.USER))
  @UseGuards(JwtAuthGuard)
  async createCartItem(
    @Req() req,
    @Body() createCartItemDto: CreateCartItemDto,
  ) {
    const result = await this.cartService.createCartItem({
      ...createCartItemDto,
      userId: req.user.id,
    });

    return result;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getCart(@Req() req) {
    return this.cartService.getCartByUserId(req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateCartItem(
    @Req() req,
    @Body() updateCartItemDto: UpdateCartItemDto,
    @Param() { id }: IdParam,
  ) {
    const result = await this.cartService.updateCartItem(
      id,
      req.user.id,
      updateCartItemDto,
    );
    return result;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteCartItem(@Req() req, @Param() { id }: IdParam) {
    const result = this.cartService.deleteCartItem(id, req.user.id);
    return result;
  }
}
