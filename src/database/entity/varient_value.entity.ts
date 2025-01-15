import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export class VarientValue {
  @PrimaryColumn('uuid')
  varientId: string

  @PrimaryColumn('uuid')
  valueAttrId: string
}