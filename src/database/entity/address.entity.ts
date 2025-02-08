import { PatternEntity } from "src/common/patternEntity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Commune } from "./commune.entity";
import { District } from "./district.entity";
import { Province } from "./province.entity";

@Entity()
export class Address extends PatternEntity {
  @Column()
  firstName: string

  @Column()
  lastName: string

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
  
}