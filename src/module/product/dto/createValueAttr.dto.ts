import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ValueAttrDto {
  @IsString()
  @IsNotEmpty()
  value: string

  @IsString()
  @IsNotEmpty()
  attrName: string

  
}