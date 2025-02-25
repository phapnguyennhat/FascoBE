import { IsOptional, IsString, MinLength } from "class-validator";

export class UpdateBrandDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string

}

export class UpdateBrand extends UpdateBrandDto {
  imageId?: string
}