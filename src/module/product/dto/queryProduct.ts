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
  ALLPRODUCT = 'All Products',
  BESTSELLER = 'Best Seller',
  NEWARRIVAL = 'New Arrivals',
  LOWTOHIGH = 'Price: Low to High',
  HIGHTOLOW = 'Price: High to Low',
  DEALS = 'Deals'
}

export class QueryProductDto  extends QueryParam {

  @IsOptional()
  @IsString()
  keyword: string
  
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
