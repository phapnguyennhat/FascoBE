import { Address } from './address.entity';
import { PatternEntity } from "src/common/patternEntity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { OrderItem } from "./orderItem.entity";
import { User } from "./user.entity";


export enum EStatusOrder {
  PENDING = 'PENDING',
  COMPLETE = 'COMPLETE',
  CANCEL = 'CANCEL',
  SHIPPING = 'SHIPPING',
}

@Entity()
export class Order extends PatternEntity{
  @Column()
  userId: string

  @Column()
  addressId: string

  @Column({ default: EStatusOrder.PENDING, type: 'enum', enum: EStatusOrder })
  status: EStatusOrder;

  @OneToMany(() => OrderItem, (orderItem: OrderItem) => orderItem.order)
  orderItems: OrderItem[];

  @ManyToOne(() => User)
  user: User;

  @OneToOne(()=>Address)
  @JoinColumn()
  address: Address
  
}