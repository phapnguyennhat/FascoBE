import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateValueAttrDto {
  @IsNotEmpty() 
  @IsUUID()
  id: string

  @IsString()
  @IsOptional()
  value: string
}

export class UpdateValueAttr {
  imageId?: string
  value?:string
}