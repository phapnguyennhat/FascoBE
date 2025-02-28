import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Min, ValidateIf } from "class-validator";

export class UpdateVarientDto {
  @IsNotEmpty()
  @IsUUID()
  id: string

  @Type(()=>Number)
  @IsNumber()
  @IsOptional()
  @IsPositive({ message: 'Price must be a positive number' })
  pieceAvail: number


  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must have at most 2 decimal places' },
  )
  @IsPositive({ message: 'Price must be a positive number' })
  @IsOptional()
  @Type(()=>Number)
  price: number;


  @IsOptional()
  @Type(() => Number)
  @ValidateIf((o) => o.discountPrice !== "")
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'discountPrice must have at most 2 decimal places' })
  @IsPositive({ message: 'discountPrice must be a positive number' })
  discountPrice: number
 
}
