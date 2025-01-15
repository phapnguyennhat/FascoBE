import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";

export class CreateValueAttrDto {
  @IsString()
  @IsNotEmpty()
  value: string

  @IsString()
  @IsNotEmpty()
  attrName: string

}

export class CreateValueAttr extends CreateValueAttrDto{
  productId: string
  imageId?: string
}

export class CreateAbulkValueAttrDto {
  @IsArray()
  @ArrayMinSize(1)
  @Type(()=> CreateValueAttrDto)
  @ValidateNested({each: true})
  createValueAttrDtos: CreateValueAttrDto[]
}

