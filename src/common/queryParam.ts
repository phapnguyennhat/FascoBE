import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class QueryParam {
  @Type(()=>Number)
  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Min(1)
  page: number=1

  @Type(()=>Number)
  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Min(5)
  limit: number =6
}