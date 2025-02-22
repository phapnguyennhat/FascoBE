import { IsNotEmpty, IsString } from "class-validator";

export class UpdateAttrValueDto {
  @IsString()
  @IsNotEmpty()
  value?: string


}

export class UpdateAttrValue extends UpdateAttrValueDto{
  imageId?: string
}