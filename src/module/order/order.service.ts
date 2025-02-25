import {  BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EStatusOrder, Order } from 'src/database/entity/order.entity';
import { DataSource, FindOptionsWhere, QueryRunner, Repository } from 'typeorm';
import { CreateOrder } from './dto/CreateOrder.dto';
import { OrderItem } from 'src/database/entity/orderItem.entity';
import { CreateOrderItem } from './dto/createOrderItem.dto';
import { QueryOrderDto } from './dto/queryOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { string } from 'joi';
import { ERole, User } from 'src/database/entity/user.entity';
import { Varient } from 'src/database/entity/varient.entity';
import { Product } from 'src/database/entity/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    private readonly dataSource :DataSource
  ) {}

  async createOrder(createOrder: CreateOrder, queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.save(Order, createOrder);
    }
    return this.orderRepo.save(createOrder);
  }



  async getOrderByUserId(userId: string, query: QueryOrderDto) {
    let { page, limit, status } = query;
    page = page || 1;
    limit = limit || 9;

    if (status) {
      const [orders, count] = await this.orderRepo.findAndCount({
        where: { userId, status },
        order: { createAt: 'DESC' },
        skip: (page-1)* limit,
        take: limit
      });
      return { orders, count };
    }

    const [orders, count] = await this.orderRepo.findAndCount({
      where: { userId },
      order: { createAt: 'DESC' },
      skip: (page-1)* limit,
      take: limit
    });
    return { orders, count };
  }

  async getAllOrder( query: QueryOrderDto) {
    let { page, limit, status } = query;
    page = page || 1;
    limit = limit || 9;

    if (status) {
      const [orders, count] = await this.orderRepo.findAndCount({
        where: {  status },
        order: { createAt: 'DESC' },
        skip: (page-1)* limit,
        take: limit
      });
      return { orders, count };
    }

    const [orders, count] = await this.orderRepo.findAndCount({
      order: { createAt: 'DESC' },
      skip: (page-1)* limit,
      take: limit
    });
    return { orders, count };
  }

  async findOrderByIdAndUserId(userId: string, id: string) {
    return this.orderRepo.findOneBy({ userId, id });
  }

  async getOrderById(id: string, user:User) {
    const queryBuilder = this.orderRepo
      .createQueryBuilder('order')
      .andWhere('order.id=:id', { id })
      .innerJoin('order.address', 'address')
      .innerJoin('address.province', 'province')
      .innerJoin('address.district', 'district')
      .innerJoin('address.commune', 'commune')
      .leftJoin('order.orderItems', 'orderItems')
      .leftJoin('orderItems.varient', 'varient')
      .leftJoin('varient.product', 'product')
      .leftJoin('varient.valueAttrs', 'valueAttrs')
      .leftJoin('valueAttrs.image', 'image')
      .orderBy('image.url', 'ASC')

      .select([
        'order.id',
        'order.userId',
        'order.totalOrder',
        'order.createAt',
        'order.updateAt',
        'order.status',
        'address.id',
        'address.orderId',
        'address.email',
        'address.fullName',
        'address.phoneNumber',
        'address.street',
        'province.name',
        'province.id',

        'district.name',
        'district.id',
        'commune.name',
        'commune.id',
        'orderItems.price',
        'orderItems.quantity',
        'varient.id',
        'varient.sold',
        'varient.pieceAvail',
        'product.name',
        'product.id',
        'product.sold',
        'product.pieceAvail',
        'valueAttrs.value',
        'image.url',
      ]);

    const order = await queryBuilder.getOne();
    if (!order) {
      throw new NotFoundException('Order not found');
    }
     if (user.role === ERole.USER) {
       if (user.id !== order.userId) {
         throw new ForbiddenException('This is not your order 🥲');
       }
       return order;
     }
     return order;
  }



  async updateOrder(id:string,updateOrderDto :UpdateOrderDto, queryRunner?:QueryRunner){
    if(queryRunner){
      return queryRunner.manager.update(Order,id, updateOrderDto)
    }
    return this.orderRepo.update(id, updateOrderDto)
  }

  async cancelOrder (order:Order){

    if(order.status !== EStatusOrder.PENDING){
      throw new ForbiddenException("Not allow set order's status is cancel whose status is not pending ")
    }
    const orderItems = order.orderItems
    const queryRunner = this.dataSource.createQueryRunner()

    try {
          await queryRunner.connect()
          await queryRunner.startTransaction()
    
          await Promise.all(orderItems.map( async( orderItem)=>{
            const {quantity, varient} = orderItem
            const {id: variantId,sold: variantSold, pieceAvail:variantPieceAvail } = varient
    
            await queryRunner.manager.update(Varient, variantId, {sold: variantSold-quantity, pieceAvail: variantPieceAvail+quantity})
            await this.updateOrder(order.id, {status: EStatusOrder.CANCEL}, queryRunner)
          }))
    
          await queryRunner.commitTransaction()
          return {
            message: 'Cancel order successfully'
          }
        } catch (error) {
          await queryRunner.rollbackTransaction()
          throw error
        } finally{
          await queryRunner.release()
        }
  }

  async shippingOrder(order: Order){
    if(order.status !== EStatusOrder.PENDING){
      throw new ForbiddenException("Not allow set order's status is shipping whose status is not pending ")
    }
    return this.orderRepo.update(order.id, {status: EStatusOrder.SHIPPING})
  }

  async completeOrder(order:Order){
    if(order.status!== EStatusOrder.SHIPPING){
      throw new ForbiddenException("Not allow set order's status is complete whose status is not shipping ")
    }
    return this.orderRepo.update(order.id, {status: EStatusOrder.COMPLETE})
  }

  
}
