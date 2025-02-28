import { IsOptional, IsString } from "class-validator";

export class UpdateImageDto {
  @IsOptional()
  @IsString()
  stringValueIds: string

  @IsOptional()
  @IsString()
  stringUpdateImageIds: string

  @IsOptional()
  @IsString()
  stringDeleteImageIds: string
}