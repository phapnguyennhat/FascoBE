import { IsEmail, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class UpdateAddressDto {
  @IsString()
  @IsOptional()
  fullName :string

  @IsEmail()
  @IsOptional()
  email: string



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

  @IsOptional()
  @IsString()
  street: string
}