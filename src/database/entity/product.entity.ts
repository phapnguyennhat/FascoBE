import { Check, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Image } from "./image.entity";

@Entity()
@Check(`"starRating" >=0 AND "starRating" <=5`)

export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 5 })
  starRating: number

  @Column({default: 0})
  reviewNumber: number;

  @Column({default: 0})
  pieceAvail: number

  @Column({default: 0})
  sold: number

  @Column()
  userId: string
  
  @ManyToOne(()=>User, {onDelete: 'CASCADE'})
  user: User
}