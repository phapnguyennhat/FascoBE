import { Type } from "class-transformer";
import { ArrayMinSize, ArrayUnique, IsArray, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, Min, MinLength, ValidateNested } from "class-validator";
import { Tag } from "src/database/entity/tag.entity";
import { CreateAttrProductDto } from "./createAttrProduct.dto";
import { UniqueHasImage } from "src/common/decorator/uniqueHasImage";
import { CreateTagDto } from "src/module/tag/dto/createTag.dto";
import { CreateVarientDto } from "./createVarient.dto";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsString()
  categoryName: string;

  @IsNotEmpty()
  @IsArray()
  @Type(() => CreateTagDto)
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayUnique((item: CreateTagDto) => item.name) 
  tags: CreateTagDto[]

  @IsString()
  @IsNotEmpty()
  brandId: string;

  @IsNotEmpty()
  @IsArray()
  @Type(() => CreateAttrProductDto)
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @UniqueHasImage({
    message: 'There must be exactly one item with hasImage set to true',
  })
  attrProducts: CreateAttrProductDto[];

  @IsNotEmpty()
  @IsArray()
  @Type(()=>CreateVarientDto)
  @ValidateNested({each: true})
  @ArrayMinSize(1)
  createVarientDtos: CreateVarientDto[]
}

export class CreateProduct extends CreateProductDto{
  userId: string
  price?:number
  discountPrice ?:number
  pieceAvail?:number
}