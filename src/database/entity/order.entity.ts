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


export interface TotalOrder {
 subTotal: number
 wrap?: number
 shipping?:number

}

@Entity()
export class Order extends PatternEntity{
  @Column()
  userId: string

  @Column({
    type: 'jsonb'
  })
  totalOrder: TotalOrder;
  

  @Column({ default: EStatusOrder.PENDING, type: 'enum', enum: EStatusOrder })
  status: EStatusOrder;

  @OneToMany(() => OrderItem, (orderItem: OrderItem) => orderItem.order, {cascade: true})
  orderItems: OrderItem[];

  @ManyToOne(() => User, {onDelete: 'SET NULL'})
  user: User;

  @OneToOne(()=>Address, (address: Address)=>address.order, {cascade: true})
  address: Address

  
}