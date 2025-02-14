import { Address } from './address.entity';
import { Exclude } from "class-transformer";
import {  Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Image } from "./image.entity";
import { extend } from "joi";
import { PatternEntity } from "src/common/patternEntity";

export enum AuthBy {
  GOOGLE='GOOGLE',
  GITHUB='GITHUB',
  FACEBOOK='FACEBOOK',
  LOCAL='LOCAL'
}

export enum EGender {
  MALE= 'MALE',
  FEMALE= 'FEMALE',
  OTHER = 'OTHER'
}

export interface IAuthPayload {
  userId: string
}

@Entity()
export class User extends PatternEntity {
 

  @Column({nullable: true})
  name: string

  @Column({nullable: true})
  username: string

  @Column({nullable: true})
  phoneNumber: string

  @Column({nullable: true})
  @Exclude()
  password: string

  @Column({unique: true})
  email: string

  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken: string;

  @Column( {enum:AuthBy, type: 'enum', default: AuthBy.LOCAL})
  authBy: AuthBy

  @Column( {enum:EGender, type: 'enum', nullable: true})
  gender: EGender

  @Column({ type: 'date', nullable: true })
  birthday: Date;

  @Column({nullable: true})
  avatarId: string


  @OneToOne(()=> Image, {eager: true, onDelete: 'SET NULL'})
  @JoinColumn()
  avatar: Image

}