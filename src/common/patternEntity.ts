import { Transform } from "class-transformer";
import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import  moment from 'moment-timezone';

export class PatternEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  @Transform(({ value }) => value ? moment(value).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss') : null)
  createAt: Date;
  
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  @Transform(({ value }) => value ? moment(value).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss') : null)
  updateAt: Date;
}