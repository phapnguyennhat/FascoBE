import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Province } from './province.entity';
import { Commune } from './commune.entity';

@Entity()
export class District {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  provinceId: string;

  @ManyToOne(() => Province, (province: Province) => province, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  province: Province;

  @OneToMany(() => Commune, (commune: Commune) => commune.district, {
    cascade: true,
  })
  communes: Commune[];
}
