import { IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  currentHashedRefreshToken?: string;

  @IsString()
  @IsOptional()
  imageId?: string
}