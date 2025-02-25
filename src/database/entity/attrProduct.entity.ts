import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, Unique } from "typeorm";
import { Product } from "./product.entity";
import { ValueAttr } from "./valueAttr.entity";
import { PatternEntity } from "src/common/patternEntity";

@Entity()
@Unique(['name', 'productId'])
export class AttrProduct extends PatternEntity {

  @Column()
  name: string

  @Column()
  productId: string

  @Column({default: false})
  hasImage: boolean

  @OneToMany(()=>ValueAttr, (valueAttr: ValueAttr)=>valueAttr.attrProduct, {cascade: true})
  valueAttrs: ValueAttr[]

  @ManyToOne(()=>Product )
  product: Product

}