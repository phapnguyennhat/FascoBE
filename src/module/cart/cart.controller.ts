import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import JwtAuthGuard from 'src/module/auth/guard/jwt-auth.guard';
import { Request } from 'express';
import { CreateCartItemDto } from './dto/createCartItem.dto';
import { UpdateCartItemDto } from './dto/updateCartItem.dto';
import { IdParam } from 'src/common/validate';
import RoleGuard from '../auth/guard/role.guard';
import { ERole } from 'src/database/entity/user.entity';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @UseGuards(RoleGuard(ERole.USER))
  @UseGuards(JwtAuthGuard)
  async createCartItem (@Req() req, @Body() createCartItemDto: CreateCartItemDto){
    return this.cartService.createCartItem({...createCartItemDto, userId: req.user.id})
  }

  @Get() 
  @UseGuards(JwtAuthGuard)
  async getCart(@Req() req){
    return this.cartService.getCartByUserId(req.user.id)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateCartItem (@Req() req, @Body() updateCartItemDto: UpdateCartItemDto, @Param(){id}: IdParam){
    return this.cartService.updateCartItem(id, req.user.id, updateCartItemDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteCartItem (@Req() req, @Param(){id}: IdParam){
    return this.cartService.deleteCartItem(id, req.user.id)
  }

}
