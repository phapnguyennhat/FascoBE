import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/database/entity/order.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CreateOrder } from './dto/CreateOrder.dto';
import { OrderItem } from 'src/database/entity/orderItem.entity';
import { CreateOrderItem } from './dto/createOrderItem.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItemRepo: Repository<OrderItem>
  ) {}

  async createOrder(createOrder: CreateOrder, queryRunner?:QueryRunner){
    if(queryRunner){
      return queryRunner.manager.save(Order, createOrder)
    }
    return this.orderRepo.save(createOrder)
  }

  async getOrderByUserId (userId: string){
    return this.orderRepo.find({where: {userId}})
  }

  async createAbulkOrderItem (createOrderItems: CreateOrderItem[], queryRunner?: QueryRunner){
    if(queryRunner){
      return queryRunner.manager.insert(OrderItem, createOrderItems)
    }
    return this.orderItemRepo.insert(createOrderItems)

  }
}
