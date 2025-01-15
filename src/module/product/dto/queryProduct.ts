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
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  tagNames: string[];

  @IsOptional()
  @IsString()
  categoryName: string;

  @IsString()
  @IsOptional()
  brandName: string;

  @Type(() => Number)
  @IsPositive()
  @IsNumber()
  @IsOptional()
  minPrice: number;

  @Type(() => Number)
  @IsPositive()
  @IsNumber()
  @IsOptional()
  maxPrice: number;

  @IsOptional()
  @IsEnum(ECollection)
  collection: ECollection;
}
