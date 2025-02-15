import { PatternEntity } from "src/common/patternEntity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { Commune } from "./commune.entity";
import { District } from "./district.entity";
import { Province } from "./province.entity";
import { User } from "./user.entity";
import { Order } from "./order.entity";

@Entity()
export class Address extends PatternEntity {

  @Column({nullable: true})
  userId: string

  @Column()
  email: string

  @Column({nullable: true})
  orderId: string

  // @Column()
  // firstName: string

  // @Column()
  // lastName: string
  
  @Column()
  fullName: string

  @Column()
  phoneNumber: string;

  @Column()
  provinceId: string;

  @Column()
  districtId: string;

  @Column()
  communeId: string;

  @Column()
  street: string

  @ManyToOne(() => Province, { eager: true })
  province: Province;

  @ManyToOne(() => District, { eager: true })
  district: District;

  @ManyToOne(() => Commune, { eager: true })
  commune: Commune;

  @OneToOne(()=>User, {onDelete: 'CASCADE'})
  @JoinColumn()
  user:User

  @OneToOne(()=>Order, (order: Order)=>order.address, {onDelete: 'CASCADE'})
  @JoinColumn()
  order: Order

}