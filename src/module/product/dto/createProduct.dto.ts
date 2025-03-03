import { Type } from "class-transformer";
import { ArrayMinSize, ArrayUnique, IsArray, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID, Min, MinLength, ValidateNested } from "class-validator";
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
  @IsUUID()
  categoryId: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({each: true})
  tagIds: string[]

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
  tags: Tag[]
  price?:number
  discountPrice ?:number
  pieceAvail?:number
}