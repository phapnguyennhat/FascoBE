import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Max, Min, MinLength } from "class-validator";

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(10)
  name?:string

  @Type(()=>Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(5)
  starRating: number

  @Type(()=>Number)
  @IsNumber()
  @IsOptional()
  reviewNumber: number

  // @Type(()=>Number)
  // @IsNumber()
  // @IsOptional()
  // price: number

  @Type(()=>Number)
  @IsNumber()
  @IsOptional()
  pieceAvail: number

  @Type(()=>Number)
  @IsNumber()
  @IsOptional()
  sold: number

}