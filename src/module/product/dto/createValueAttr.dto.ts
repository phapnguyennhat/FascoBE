import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";

export class CreateValueAttrDto {
  @IsString()
  @IsNotEmpty()
  value: string

  // @IsString()
  // @IsNotEmpty()
  // attrName: string

}




