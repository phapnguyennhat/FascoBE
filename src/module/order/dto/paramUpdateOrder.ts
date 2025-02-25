import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { EStatusOrder } from "src/database/entity/order.entity";

export class ParamUpdateOrder{
  @IsNotEmpty()
  @IsUUID(4)
  id: string

  @IsEnum(EStatusOrder)
  @IsNotEmpty()
  status: EStatusOrder
}