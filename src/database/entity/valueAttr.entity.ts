import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Image } from "./image.entity";
import { AttrProduct } from "./attrProduct.entity";
import { Varient } from "./varient.entity";
import { extend } from "joi";
import { PatternEntity } from "src/common/patternEntity";

@Entity()
@Unique(['value', 'attrName', 'productId']) 
export class ValueAttr extends PatternEntity {

  @Column()
  value: string

  @Column({nullable: true})
  imageId: string

  @OneToOne(()=>Image)
  @JoinColumn()
  image: Image

  @Column({nullable: true})
  attrName: string

  @Column({nullable: true})
  productId: string

  @ManyToOne(()=>AttrProduct)
  @JoinColumn([
    { name: 'attrName', referencedColumnName: 'name' },
    { name: 'productId', referencedColumnName: 'productId' },
  ])
  attrProduct: AttrProduct

  @ManyToMany(()=>Varient, (varient: Varient)=>varient.valueAttrs, {onDelete: 'CASCADE'})
  varients: Varient[]
}