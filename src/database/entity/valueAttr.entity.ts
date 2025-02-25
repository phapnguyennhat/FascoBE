import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Image } from "./image.entity";
import { AttrProduct } from "./attrProduct.entity";
import { Varient } from "./varient.entity";
import { PatternEntity } from "src/common/patternEntity";

@Entity()
@Unique(['value', 'attrProductId']) 
export class ValueAttr extends PatternEntity {

  @Column()
  value: string

  @Column({nullable: true})
  imageId: string

  @OneToOne(()=>Image, {onDelete: 'SET NULL'})
  @JoinColumn()
  image: Image


  @Column()
  attrProductId: string

  @ManyToOne(()=>AttrProduct)
  attrProduct: AttrProduct

  @ManyToMany(()=>Varient, (varient: Varient)=>varient.valueAttrs, {onDelete: 'CASCADE'})
  varients: Varient[]
}