import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class AttrProduct {
  @PrimaryColumn()
  name: string

  @PrimaryColumn()
  productId: string

  @Column({default: false})
  hasImage: boolean

  @ManyToOne(()=>Product)
  product: Product

}