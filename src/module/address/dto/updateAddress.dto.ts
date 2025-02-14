import { IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class UpdateAddressDto {
  @IsString()
  @IsOptional()
  firstName :string

  @IsString()
  @IsOptional()
  lastName: string

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber: string

  @IsOptional()
  @IsString()
  provinceId: string

  @IsOptional()
  @IsString()
  districtId: string

  @IsOptional()
  @IsString()
  communeId: string
}