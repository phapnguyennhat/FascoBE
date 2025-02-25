import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, Unique } from "typeorm";
import { Image } from "./image.entity";
import { PatternEntity } from "src/common/patternEntity";

@Entity()
export class Brand extends PatternEntity {
  @Column({unique: true})
  name: string

  @Column({nullable: true})

  imageId: string

  @OneToOne(()=>Image,{eager: true, onDelete: 'SET NULL'})
  @JoinColumn()
  image: Image

}