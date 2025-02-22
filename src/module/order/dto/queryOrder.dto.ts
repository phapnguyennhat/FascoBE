import { IsEnum, IsOptional } from "class-validator";
import { QueryParam } from "src/common/queryParam";
import { EStatusOrder } from "src/database/entity/order.entity";

export class QueryOrderDto extends QueryParam  {
  @IsOptional()
  @IsEnum(EStatusOrder)
  status: EStatusOrder
}