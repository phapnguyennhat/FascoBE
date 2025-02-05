import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class UpdateCartItemDto {
  @Type(()=>Number)
  @IsNumber()
  @IsOptional()
  quantity: number
}