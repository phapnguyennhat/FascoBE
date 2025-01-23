import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Product } from "./product.entity";
import { ValueAttr } from "./valueAttr.entity";

@Entity()
export class AttrProduct {
  @PrimaryColumn()
  name: string

  @PrimaryColumn()
  productId: string

  @Column({default: false})
  hasImage: boolean

  @OneToMany(()=>ValueAttr, (valueAttr: ValueAttr)=>valueAttr.attrProduct)
  valueAttrs: ValueAttr[]

  @ManyToOne(()=>Product )
  product: Product

}