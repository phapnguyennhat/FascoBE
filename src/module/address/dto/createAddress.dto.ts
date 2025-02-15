import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator"

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  fullName :string

  
  // @IsString()
  // @IsNotEmpty()
  // lastName: string
  
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string

  @IsNotEmpty()
  @IsString()
  provinceId: string

  @IsNotEmpty()
  @IsString()
  districtId: string

  @IsNotEmpty()
  @IsString()
  communeId: string

  @IsNotEmpty()
  @IsString()
  street: string
}

export class CreateAddress extends CreateAddressDto {
  userId ?:string
}