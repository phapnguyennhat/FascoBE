import { IsNotEmpty, IsString } from "class-validator";

export class CreateBrandDto {
  @IsNotEmpty()
  @IsString()
  name: string
}

export class CreateBrand extends CreateBrandDto{
  imageId: string
}