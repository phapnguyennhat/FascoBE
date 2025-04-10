import { Type } from "class-transformer"
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, ValidateNested } from "class-validator"
import { CreateAddressDto } from "src/module/address/dto/createAddress.dto"
import { CreateOrderItem } from "./createOrderItem.dto"
import { EPaymentMethod, TotalOrder } from "src/database/entity/order.entity"



export class CreateOrderDto {
  @Type(()=>CreateAddressDto)
  @IsNotEmpty()
  @ValidateNested()
  address: CreateAddressDto

  @Type(()=>Boolean)
  @IsBoolean()
  @IsNotEmpty()
  isWrap: boolean

  @IsEnum(EPaymentMethod)
  @IsNotEmpty()
  paymentMethod: EPaymentMethod
}


export class CreateOrder extends CreateOrderDto{
  userId: string
  orderItems: CreateOrderItem[]
  totalOrder: TotalOrder

}