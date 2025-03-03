import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category{
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({unique: true})
  name:string
}