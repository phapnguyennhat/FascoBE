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
import { CreateOrder, CreateOrderDto } from './dto/createOrder.dto';
import JwtAuthGuard from '../auth/guard/jwt-auth.guard';
import { DataSource } from 'typeorm';
import { CreateOrderItem } from './dto/createOrderItem.dto';
import { CartService } from '../cart/cart.service';
import { CartItem } from 'src/database/entity/cartItem.entity';
import { feeShip, feeWrap, minOrderFreeShip } from 'src/common/constant';
import { EStatusOrder, Order, TotalOrder } from 'src/database/entity/order.entity';
import { DistrictService } from '../district/district.service';
import { CommuneService } from '../commune/commune.service';
import { IdParam } from 'src/common/validate';
import { ERole } from 'src/database/entity/user.entity';
import { UpdateAddressDto } from '../address/dto/updateAddress.dto';
import { AddressService } from '../address/address.service';
import { QueryOrderDto } from './dto/queryOrder.dto';
import RoleGuard from '../auth/guard/role.guard';
import { Varient } from 'src/database/entity/varient.entity';
import { ParamUpdateOrder } from './dto/paramUpdateOrder';
import { getPriceVarient } from 'src/util/utils';

@Controller('')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly dataSource: DataSource,
    private readonly cartService: CartService,
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
      price: getPriceVarient(item.varient),
      quantity: item.quantity,
    }));

    const subTotal = cartItems.reduce(
      (sum, cartItem) => sum + cartItem.quantity * getPriceVarient(cartItem.varient),
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
      
      await Promise.all(cartItems.map( async cartItem =>{
        const {quantity, varient, varientId} = cartItem
        const {sold: varientSold, pieceAvail: varientPieceAvail} = varient
      
        if(quantity >varient.pieceAvail){
          throw new BadRequestException('this variant is sold out')
        }
        await queryRunner.manager.update(Varient, varientId, {pieceAvail: varientPieceAvail-quantity, sold: varientSold+quantity})
        // await queryRunner.manager.update(Product,product.id, )
        
      }))
      
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
    if(req.user.role===ERole.ADMIN){
      return this.orderService.getAllOrder(query)
    }
    return this.orderService.getOrderByUserId(req.user.id, query);
  }


  @Get('user/order/:id')
  @UseGuards(JwtAuthGuard)
  async getOrderById(@Req() req, @Param() { id }: IdParam) {
    return this.orderService.getOrderById(id, req.user)
  }



  @Put('user/order/:id/:status')
  @UseGuards(JwtAuthGuard)
  async cancelOrder(@Req() req, @Param() {id, status}: ParamUpdateOrder) {

    const order = await this.orderService.getOrderById(id, req.user)

    if(status===EStatusOrder.CANCEL){
      return this.orderService.cancelOrder(order)
    }
    else if (status===EStatusOrder.SHIPPING && req.user.role===ERole.ADMIN){
      return this.orderService.shippingOrder(order)
    }
    else if(status===EStatusOrder.COMPLETE && req.user.role===ERole.ADMIN){
      return this.orderService.completeOrder(order)
    }
    throw new BadRequestException('not allow')
  }

  

  

  @Put('user/order/:id/address/:addressId')
  @UseGuards(JwtAuthGuard)
  async updateAddress(
    @Req() req,
    @Body() updateAddressDto: UpdateAddressDto,
    @Param() {id, addressId}: { id: string; addressId: string },
  ) {

    const order: Order = await this.orderService.getOrderById(id, req.user);
    if(order.status!==EStatusOrder.PENDING){
      throw new ForbiddenException('Do not allow update address of order whose status is not pending')
    }
    
    return this.addressService.updateAddressOrder(order.id,addressId,updateAddressDto)
  }
}
