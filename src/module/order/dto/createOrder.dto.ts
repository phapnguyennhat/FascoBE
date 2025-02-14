import { Type } from "class-transformer"
import { IsBoolean, IsNotEmpty, IsNumber, ValidateNested } from "class-validator"
import { CreateAddressDto } from "src/module/address/dto/createAddress.dto"
import { CreateOrderItem } from "./createOrderItem.dto"
import { TotalOrder } from "src/database/entity/order.entity"



export class CreateOrderDto {
  @Type(()=>CreateAddressDto)
  @IsNotEmpty()
  @ValidateNested()
  address: CreateAddressDto

  @IsBoolean()
  @IsNotEmpty()
  isWrap: boolean
}


export class CreateOrder extends CreateOrderDto{
  userId: string
  orderItems: CreateOrderItem[]
  totalOrder: TotalOrder

}