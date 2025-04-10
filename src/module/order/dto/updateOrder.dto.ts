import { IsEnum, IsOptional } from "class-validator";
import { EPaymentStatus, EStatusOrder } from "src/database/entity/order.entity";

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(EStatusOrder)
  status?: EStatusOrder

  @IsOptional()
  @IsEnum(EPaymentStatus)
  paymentStatus?: EPaymentStatus
}