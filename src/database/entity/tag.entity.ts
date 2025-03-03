import { Column, Entity, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class Tag{

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({unique: true})
  name: string

  @ManyToMany(()=>Product, (product: Product)=>product.tags, {onDelete: 'CASCADE'})
  products: Product
}