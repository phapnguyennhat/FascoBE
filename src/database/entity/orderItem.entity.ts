import { PatternEntity } from "src/common/patternEntity";
import { Check, Column, Entity, ManyToOne } from "typeorm";
import { Order } from "./order.entity";
import { Varient } from "./varient.entity";

@Entity()
@Check(`"quantity" > 0`)
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
    onDelete: 'CASCADE',
  })
  varient: Varient;
}