import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Image } from "./image.entity";

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string;

  @Column()
  starRating: number

  @Column()
  reviewNumber: number;

  @Column()
  price: number;

  @Column()
  pieceAvail: number

  @Column()
  sold: number

  @Column()
  userId: string
  
  @ManyToOne(()=>User, {onDelete: 'CASCADE'})
  user: User


}