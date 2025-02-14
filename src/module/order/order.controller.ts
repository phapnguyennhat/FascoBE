import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrder, CreateOrderDto } from './dto/CreateOrder.dto';
import JwtAuthGuard from '../auth/guard/jwt-auth.guard';
import { DataSource } from 'typeorm';
import { CreateOrderItem } from './dto/createOrderItem.dto';
import { CartService } from '../cart/cart.service';
import { CartItem } from 'src/database/entity/cartItem.entity';
import { feeShip, feeWrap, minOrderFreeShip } from 'src/common/constant';
import { TotalOrder } from 'src/database/entity/order.entity';
import { ProvinceService } from '../province/province.service';
import { DistrictService } from '../district/district.service';
import { CommuneService } from '../commune/commune.service';
import { District } from 'src/database/entity/district.entity';

@Controller('')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly dataSource: DataSource,
    private readonly cartService: CartService,
    private readonly provinceService: ProvinceService,
    private readonly districtService: DistrictService,
    private readonly communeService: CommuneService
  ) {}

  @Post('user/order')
  @UseGuards(JwtAuthGuard)
  async createOrder(@Req() req, @Body() createOrderDto: CreateOrderDto) {
    const address = createOrderDto.address
    
    await Promise.all([
      this.districtService.findById(address.provinceId, address.districtId),
      this.communeService.findById(address.districtId, address.communeId),
    ]);

    const cartItems: CartItem[] = await this.cartService.getCartByUserId(
      req.user.id,
    );
    if (cartItems.length === 0) {
      throw new BadRequestException('Your cart is empty');
    }
    const createOrderItems: CreateOrderItem[] = cartItems.map((item) => ({
      varientId: item.varientId,
      price: item.varient.price,
      quantity: item.quantity,
    }));

    const subTotal = cartItems.reduce(
      (sum, cartItem) => sum + cartItem.quantity * cartItem.varient.price,
      0,
    );

    const shipping = subTotal >= minOrderFreeShip ? 0 : feeShip;

    const totalOrder: TotalOrder = { subTotal, shipping };
    if (createOrderDto.isWrap) {
      totalOrder.wrap = feeWrap;
    }

    const createOrder: CreateOrder = {
      ...createOrderDto,
      userId: req.user.id,
      orderItems: createOrderItems,
      totalOrder,
    };

    const queryRunner = this.dataSource.createQueryRunner()

    try {
      await queryRunner.connect()
      await queryRunner.startTransaction()

      const newOrder = await this.orderService.createOrder(createOrder, queryRunner)
      await this.cartService.deleteByUserId(req.user.id, queryRunner)

      await queryRunner.commitTransaction()
      return newOrder
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
      
    }finally{
      await queryRunner.release()
    }


  }

  @Get('user/order')
  @UseGuards(JwtAuthGuard)
  async getOrder(@Req() req){
    return this.orderService.getOrderByUserId(req.user.id)
  }
}
