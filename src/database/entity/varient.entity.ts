import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ValueAttr } from "./valueAttr.entity";

@Entity()
export class Varient{
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  productId: string

  @Column({default: 0})
  pieceAvail: number

  @Column({default: 0})
  sold:number

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  discountPrice: number;

  @OneToMany(()=> ValueAttr, (valueAttr: ValueAttr)=>valueAttr.varient )
  valueAttrs: ValueAttr[]
  
}