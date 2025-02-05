import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsUUID, Min } from "class-validator";

export class CreateCartItemDto {
  @IsUUID()
  @IsNotEmpty()
  varientId: string;

  @Type(()=>Number)
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number
}

export class CreateCartItem extends CreateCartItemDto {
  userId: string
}