import {  BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EStatusOrder, Order } from 'src/database/entity/order.entity';
import { FindOptionsWhere, QueryRunner, Repository } from 'typeorm';
import { CreateOrder } from './dto/CreateOrder.dto';
import { OrderItem } from 'src/database/entity/orderItem.entity';
import { CreateOrderItem } from './dto/createOrderItem.dto';
import { QueryOrderDto } from './dto/queryOrder.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
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

  async findOrderByIdAndUserId(userId: string, id: string) {
    return this.orderRepo.findOneBy({ userId, id });
  }

  async getOrderById(id: string) {
    const queryBuilder = this.orderRepo
      .createQueryBuilder('order')
      .andWhere('order.id=:id', { id })
      .innerJoin('order.address', 'address')
      .innerJoin('address.province', 'province')
      .innerJoin('address.district', 'district')
      .innerJoin('address.commune', 'commune')
      .innerJoin('order.orderItems', 'orderItems')
      .innerJoin('orderItems.varient', 'varient')
      .innerJoin('varient.product', 'product')
      .innerJoin('varient.valueAttrs', 'valueAttrs')
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
        'product.name',
        'valueAttrs.value',
        'image.url',
      ]);

    const order = await queryBuilder.getOne();
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async createAbulkOrderItem(
    createOrderItems: CreateOrderItem[],
    queryRunner?: QueryRunner,
  ) {
    if (queryRunner) {
      return queryRunner.manager.insert(OrderItem, createOrderItems);
    }
    return this.orderItemRepo.insert(createOrderItems);
  }

  async cancelOrder(userId: string, id: string) {
    const result = await this.orderRepo.update(
      { userId, id },
      { status: EStatusOrder.CANCEL },
    );
    if (result.affected === 0) {
      throw new BadRequestException('Order not found');
    }
    return result;
  }
}
