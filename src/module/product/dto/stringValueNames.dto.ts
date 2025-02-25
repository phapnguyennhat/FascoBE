import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from "class-validator";

export class StringValueNamesDto {

  @IsNotEmpty()
  @IsString()
  stringValueNames: string
}