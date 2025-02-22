import { IsOptional, IsString } from "class-validator";

export class UpdateBrandDto {
  @IsOptional()
  @IsString()
  name?: string

}

export class UpdateBrand extends UpdateBrandDto {
  imageId?: string
}