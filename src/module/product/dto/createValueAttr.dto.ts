import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateValueAttrDto {
  @IsString()
  @IsNotEmpty()
  value: string

  @IsString()
  @IsNotEmpty()
  attrName: string

  // @IsUUID()
  // @IsNotEmpty()
  // productId: string

  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  imageId?: string
}

export class CreateValueAttr extends CreateValueAttrDto{
  productId: string
}