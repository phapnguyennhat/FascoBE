import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Image } from "./image.entity";
import { AttrProduct } from "./attrProduct.entity";
import { Varient } from "./varient.entity";

@Entity()
export class ValueAttr{
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  value: string

  @Column({nullable: true})
  imageId: string

  @OneToOne(()=>Image)
  @JoinColumn()
  image: Image

  @Column({name: 'attrProductName'})
  attrName: string

  @Column({name: 'attrProductProductId'})
  productId: string

  @Column()
  varientId:string
  
  @ManyToOne(()=>AttrProduct)
  attrProduct: AttrProduct

  @ManyToOne(()=> Varient)
  varient: Varient

  @BeforeInsert()
  @BeforeUpdate()
  async checkImageConstraint() {
    const attrProduct = await this.attrProduct; // Use relationship to fetch attrProduct
    if (attrProduct && attrProduct.hasImage && !this.imageId) {
      throw new Error('imageId cannot be null if attrProduct hasImage is true');
    }
  }
}