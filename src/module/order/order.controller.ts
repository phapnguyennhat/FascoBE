import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
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
import { EStatusOrder, Order, TotalOrder } from 'src/database/entity/order.entity';
import { ProvinceService } from '../province/province.service';
import { DistrictService } from '../district/district.service';
import { CommuneService } from '../commune/commune.service';
import { District } from 'src/database/entity/district.entity';
import { IdParam } from 'src/common/validate';
import { ERole } from 'src/database/entity/user.entity';
import { UpdateAddressDto } from '../address/dto/updateAddress.dto';
import { AddressService } from '../address/address.service';
import { QueryOrderDto } from './dto/queryOrder.dto';
import RoleGuard from '../auth/guard/role.guard';

@Controller('')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly dataSource: DataSource,
    private readonly cartService: CartService,
    private readonly provinceService: ProvinceService,
    private readonly districtService: DistrictService,
    private readonly communeService: CommuneService,
    private readonly addressService: AddressService,
  ) {}

  @Post('user/order')
  @UseGuards(RoleGuard(ERole.USER))
  @UseGuards(JwtAuthGuard)
  async createOrder(@Req() req, @Body() createOrderDto: CreateOrderDto) {
    const address = createOrderDto.address;

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

    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const newOrder = await this.orderService.createOrder(
        createOrder,
        queryRunner,
      );
      await this.cartService.deleteByUserId(req.user.id, queryRunner);

      await queryRunner.commitTransaction();
      return newOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  @Get('user/order')
  @UseGuards(JwtAuthGuard)
  async getOrder(@Req() req, @Query() query: QueryOrderDto) {
    return this.orderService.getOrderByUserId(req.user.id, query);
  }

  @Get('user/order/:id')
  @UseGuards(JwtAuthGuard)
  async getOrderById(@Req() req, @Param() { id }: IdParam) {
    const order: Order = await this.orderService.getOrderById(id);
    if (req.user.role === ERole.USER) {
      if (req.user.id !== order.userId) {
        throw new ForbiddenException('This is not your order 🥲');
      }
      return order;
    }
    return order;
  }

  @Put('user/order/:id/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelOrder(@Req() req, @Param() { id }: IdParam) {
    return this.orderService.cancelOrder(req.user.id, id);
  }

  

  @Put('user/order/:id/address/:addressId')
  @UseGuards(JwtAuthGuard)
  async updateAddress(
    @Req() req,
    @Body() updateAddressDto: UpdateAddressDto,
    @Param() {id, addressId}: { id: string; addressId: string },
  ) {

    const order: Order = await this.orderService.getOrderById(id);
    if(order.status!==EStatusOrder.PENDING){
      throw new ForbiddenException('Do not allow update address of order whose status is not pending')
    }
    if(order.userId !==req.user.id){
      throw new ForbiddenException('This is not your order 🥲');
    }
    return this.addressService.updateAddressOrder(order.id,addressId,updateAddressDto)
  }
}
