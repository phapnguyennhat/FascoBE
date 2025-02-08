import { PatternEntity } from "src/common/patternEntity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Order } from "./order.entity";
import { Varient } from "./varient.entity";

@Entity()
export class OrderItem extends PatternEntity{
  @Column()
  orderId: string

  @Column()
  varientId: string

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Order, (order: Order) => order.orderItems, {
    onDelete: 'CASCADE',
  })
  order: Order;

  @ManyToOne(() => Varient, {
    onDelete: 'SET NULL',
  })
  varient: Varient;
}