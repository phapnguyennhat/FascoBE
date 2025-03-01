import { Transform } from "class-transformer";
import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import  moment from 'moment-timezone';

export class PatternEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn()
  @Transform(({ value }) => moment(value).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss'))
  createAt: Date;
  
  @UpdateDateColumn()
  @Transform(({ value }) => moment(value).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss'))
  updateAt: Date;
}