import { IsEnum, IsOptional } from "class-validator";
import { EStatusOrder } from "src/database/entity/order.entity";

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(EStatusOrder)
  status: EStatusOrder
}