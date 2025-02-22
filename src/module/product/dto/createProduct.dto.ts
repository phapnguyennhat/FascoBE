import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, Min, MinLength } from "class-validator";
import { Tag } from "src/database/entity/tag.entity";

export class CreateProductDto{
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string

  @IsNotEmpty()
  @IsString()
  categoryName: string

  @IsString({each :true})
  @MinLength(1, {each: true})
  @IsArray()
  @IsNotEmpty()
  tagNames: string[]

  @IsString()
  @IsNotEmpty()
  brandId: string
}

export class CreateProduct extends CreateProductDto{
  userId: string
  tags: Tag[]
}