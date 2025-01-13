import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreateProductDto{
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  name: string

  // @Type(()=>Number)
  // @IsNotEmpty()
  // @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must have at most 2 decimal places' })
  // @IsPositive({ message: 'Price must be a positive number' })
  // price: number

  @Type(()=>Number)
  @IsNumber()
  @IsNotEmpty()
  @Min(10)
  pieceAvail: number
}

export class CreateProduct extends CreateProductDto{
  userId: string
}