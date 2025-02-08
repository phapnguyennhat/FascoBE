import { AfterInsert, AfterUpdate, Entity,  Column, ManyToOne, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Product } from './product.entity';
import { ValueAttr } from './valueAttr.entity';

@Entity()
export class Varient extends  BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createAt: Date

  @UpdateDateColumn()
  updateAt: Date

  @Column()
  productId: string;

  @Column({ default: 0 })
  pieceAvail: number;

  @Column({ default: 0 })
  sold: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2 , nullable: true})
  discountPrice: number;

  
  @ManyToOne(() => Product)
  product: Product;

  @ManyToMany(()=>ValueAttr, (valueAttr:ValueAttr)=>valueAttr.varients)
  @JoinTable({name: 'varient_value'})
  valueAttrs: ValueAttr[]
}
