import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Brand{
  @PrimaryColumn()
  name: string
}