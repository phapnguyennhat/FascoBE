import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ValueAttr } from "./valueAttr.entity";
import { Product } from "./product.entity";
import { PatternEntity } from "src/common/patternEntity";

@Entity()
export class Image extends PatternEntity {
  
  @Column()
  url: string

  @Column()
  key: string

  @Column({nullable: true})
  productId: string

  @ManyToOne(()=> Product)
  product: Product

}

