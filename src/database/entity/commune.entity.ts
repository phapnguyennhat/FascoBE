import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { District } from './district.entity';

@Entity()
export class Commune {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  districtId: string;

  @ManyToOne(() => District, (district: District) => district.communes, {
    onDelete: 'CASCADE',
  })
  district: District;
}
