import { Exclude } from "class-transformer";
import {  Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Image } from "./image.entity";
import { extend } from "joi";
import { PatternEntity } from "src/common/patternEntity";

export enum AuthBy {
  GOOGLE='GOOGLE',
  GITHUB='GITHUB',
  LOCAL='LOCAL'
}

export interface IAuthPayload {
  userId: string
}

@Entity()
export class User extends PatternEntity {
 

  @Column()
  name: string

  @Column()
  username: string

  @Column()
  @Exclude()
  password: string

  @Column({unique: true})
  email: string

  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken: string;

  @Column( {enum:AuthBy, type: 'enum', default: AuthBy.LOCAL})
  authBy: AuthBy

  @Column({nullable: true})
  avatarId: string


  @OneToOne(()=> Image)
  @JoinColumn()
  avatar: Image
}