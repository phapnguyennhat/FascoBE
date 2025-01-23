import { Transform, Type } from 'class-transformer';
import {
  IsString,
  MinLength,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsNumber,
  IsEnum,
  Min,
} from 'class-validator';
import { QueryParam } from 'src/common/queryParam';

export enum ECollection {
  ALLPRODUCT = 'ALLPRODUCT',
  BESTSELLER = 'BESTSELLER',
  NEWARRIVAL = 'NEWARRIVAL',
  LOWTOHIGH = 'LOWTOHIGH',
  HIGHTOLOW = 'HIGHTOLOW',
}

export class QueryProductDto  extends QueryParam {
  
  @IsOptional()
  @IsString()
  tag: string;

  @IsOptional()
  @IsString()
  categoryName: string;

  @IsOptional()
  @IsString()
  size?:string

  @IsString()
  @IsOptional()
  brandName: string;

  @Type(() => Number)
  @Min(0)
  @IsNumber()
  @IsOptional()
  minPrice: number;

  @Type(() => Number)
  @Min(0)
  @IsNumber()
  @IsOptional()
  maxPrice: number;

  @IsOptional()
  @IsEnum(ECollection)
  collection: ECollection;
}
