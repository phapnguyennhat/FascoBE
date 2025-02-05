import { PatternEntity } from "src/common/patternEntity";
import { Check, Column, Entity, ManyToOne, Unique } from "typeorm";
import { User } from "./user.entity";
import { Varient } from "./varient.entity";

@Entity()
@Check(`"quantity" >= 1`)
@Unique(['userId', 'varientId'])  
export class CartItem extends PatternEntity {
  @Column()
  userId: string

  @ManyToOne(()=>User, {onDelete: 'CASCADE'})
  user: User

  @Column()
  varientId: string

  @ManyToOne(()=>Varient, {onDelete: 'CASCADE'})
  varient: Varient

  @Column()
  quantity: number;
}