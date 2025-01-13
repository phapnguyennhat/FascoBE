import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsString, IsUUID, Min, MinLength, ValidateNested } from "class-validator";
import { UniqueHasImage } from "src/common/decorator/uniqueHasImage";

export class CreateAttrProductDto {
  @IsNotEmpty()
  @IsString()
  name: string


  @IsBoolean()
  @IsNotEmpty()
  hasImage: boolean
}

export class CreateAttrProductDtos{
  @IsNotEmpty()
  @IsArray()
  @Type(()=>CreateAttrProductDto)
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @UniqueHasImage({ message: 'There must be exactly one item with hasImage set to true' })
  createAttrProducts: CreateAttrProductDto[]
}

export class CreateAttrProduct extends CreateAttrProductDto{
  productId: string
}