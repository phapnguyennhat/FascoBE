import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from 'src/database/entity/cartItem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
