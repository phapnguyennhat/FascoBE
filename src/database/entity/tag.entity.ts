import { Column, Entity, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class Tag{

  @PrimaryColumn()
  name: string

  @ManyToMany(()=>Product, (product: Product)=>product.tags, {onDelete: 'CASCADE'})
  products: Product
}