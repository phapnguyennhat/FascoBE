import { Type } from "class-transformer";
import { ArrayMinSize, ArrayUnique, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, Min, MinLength, ValidateNested } from "class-validator";
import { UpdateTagDto } from "src/module/tag/dto/updateTag.dto";
import { UpdateAttrProductDto } from "./updateAttrProduct.dto";
import { UpdateVarientDto } from "./updateVarient.dto";

export class UpdateProductDto {

  @IsOptional()
  @IsString()
  name: string

  
  @IsOptional()
  @IsString()
  categoryName: string

  @IsOptional()
  @IsArray()
  @Type(()=>UpdateTagDto)
  @ValidateNested({each: true})
  @ArrayMinSize(1)
  @ArrayUnique((item: UpdateTagDto)=>item.name)
  tags: UpdateTagDto[]

  @IsUUID()
  @IsOptional()
  brandId: string

  @IsOptional()
  @IsArray()
  @Type(()=>UpdateAttrProductDto)
  @ValidateNested({each: true})
  @ArrayMinSize(1)
  updateAttrProductDtos: UpdateAttrProductDto[]

  @IsOptional()
  @IsArray()
  @Type(()=>UpdateVarientDto)
  @ValidateNested({each: true})
  @ArrayMinSize(1)
  updateVarientDtos: UpdateVarientDto[]

}

// export class UpdateProduct extends PartialType(Product)  {}