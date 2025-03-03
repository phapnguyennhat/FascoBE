import { Check, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Category } from "./category.entity";
import { Tag } from "./tag.entity";
import { Brand } from "./brand.entity";
import { Varient } from "./varient.entity";
import { PatternEntity } from "src/common/patternEntity";
import { Image } from "./image.entity";
import { AttrProduct } from "./attrProduct.entity";
import { FavoriteDetail } from "./favoriteDetail.entity";


@Entity()
@Check(`"starRating" >=0 AND "starRating" <=5`)
@Check(`"sold" >= 0`)
@Check(`"pieceAvail" >= 0`)
export class Product extends PatternEntity {

  @Column({unique: true})
  name: string;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 5 })
  starRating: number

  @Column({default: 0})
  reviewNumber: number;
  
  @Column({default: 0}, )
  sold: number

  @Column({ default: 0 })
  pieceAvail: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number

  @Column('decimal', { precision: 10, scale: 2 , nullable: true})
  discountPrice: number;

  @Column({nullable: true})
  categoryId: string

  @ManyToOne(()=>Category, {onUpdate:'CASCADE', onDelete: 'SET NULL'} )
  @JoinColumn()
  category: Category

  @ManyToMany(()=>Tag, (tag: Tag)=>tag.products , {onUpdate: 'CASCADE'})
  @JoinTable({name: 'product_tag'})
  tags: Tag[]



  @Column({nullable: true})
  brandId: string

  @ManyToOne(()=>Brand, {onDelete: 'SET NULL'})
  brand: Brand


  @Column()
  userId: string
  
  @ManyToOne(()=>User, {onDelete: 'CASCADE'})
  user: User

  @OneToMany(()=> Varient, (varient: Varient)=>varient.product)
  varients: Varient

  @OneToMany(()=>AttrProduct, (attrProduct: AttrProduct)=>attrProduct.product, {cascade: true})
  attrProducts: AttrProduct[]

  @OneToMany(()=>Image, (image: Image)=>image.product)
  images: Image[]

  @OneToMany(()=>FavoriteDetail, ((favoriteDetail: FavoriteDetail)=>favoriteDetail.product))
  favoriteDetails: FavoriteDetail[]


}