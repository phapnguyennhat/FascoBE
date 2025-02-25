import { Type } from "class-transformer";
import { ArrayMinSize, ArrayUnique, IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { UpdateValueAttrDto } from "./updateValueAttr.dto";

export class UpdateAttrProductDto {
  @IsUUID()
  @IsNotEmpty()
  id: string

  @IsOptional()
  @IsString()
  name: string


  @IsOptional()
  @IsArray()
  @Type(()=>UpdateValueAttrDto)
  @ValidateNested({each: true})
  @ArrayMinSize(1)
  @ArrayUnique((item: UpdateValueAttrDto)=>item.value)
  updateValueAttrDtos: UpdateValueAttrDto[]
}