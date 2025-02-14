import { ArrayMinSize, IsArray, IsNotEmpty, IsString, IsUUID, MinLength } from "class-validator";

export class ProductIdsDto {
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @IsUUID(4, {each: true})
  productIds: string[]
}