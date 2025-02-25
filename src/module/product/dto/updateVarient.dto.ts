import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Min } from "class-validator";

export class UpdateVarientDto {
  @IsNotEmpty()
  @IsUUID()
  id: string

  @Type(()=>Number)
  @IsNumber()
  @IsOptional()
  @Min(10)
  pieceAvail: number


  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must have at most 2 decimal places' },
  )
  @IsPositive({ message: 'Price must be a positive number' })
  @IsOptional()
  @Type(()=>Number)
  price: number;


  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must have at most 2 decimal places' },
  )
  @IsPositive({ message: 'Price must be a positive number' })
  @IsOptional()
  @Type(()=>Number)
  discountPrice: number
 
}
