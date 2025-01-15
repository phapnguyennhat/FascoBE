import { Check, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Category } from "./category.entity";
import { Tag } from "./tag.entity";
import { Brand } from "./brand.entity";
import { Varient } from "./varient.entity";
import { PatternEntity } from "src/common/patternEntity";




@Entity()
@Check(`"starRating" >=0 AND "starRating" <=5`)

export class Product extends PatternEntity {

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 5 })
  starRating: number

  @Column({default: 0})
  reviewNumber: number;

  @Column({default: 0})
  sold: number

  @Column({ default: 0 })
  pieceAvail: number;

  @Column('decimal', { precision: 10, scale: 2 , nullable: true})
  price: number

  @Column()
  categoryName: string

  @OneToOne(()=>Category, )
  @JoinColumn()
  category: Category

  @ManyToMany(()=>Tag, (tag: Tag)=>tag.products)
  @JoinTable({name: 'product_tag'})
  tags: Tag[]

  @Column()
  brandName: string

  @ManyToOne(()=>Brand)
  brand: Brand

  @Column()
  userId: string
  
  @ManyToOne(()=>User, {onDelete: 'CASCADE'})
  user: User

  @OneToMany(()=> Varient, (varient: Varient)=>varient.product)
  varients: Varient
}
