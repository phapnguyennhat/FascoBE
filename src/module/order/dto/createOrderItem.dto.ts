import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateOrderItemDto {
 
}

export class CreateOrderItem {
  // orderId: string
  varientId: string
  price: number
  quantity: number
}