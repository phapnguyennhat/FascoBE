import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Category{
  @PrimaryColumn()
  name:string
}