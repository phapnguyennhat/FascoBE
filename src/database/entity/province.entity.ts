import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { District } from './district.entity';

@Entity()
export class Province {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @OneToMany(() => District, (district: District) => district.province, {
    cascade: true,
  })
  districts: District[];
}
