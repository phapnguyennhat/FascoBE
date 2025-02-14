import { Transform } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { EGender } from "src/database/entity/user.entity";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  currentHashedRefreshToken?: string;

  @IsOptional()
  @IsString()
  avatarId?: string

  @IsOptional()
  @IsString()
  name?: string

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string

  @IsEmail()
  @IsOptional()
  email?: string

  @IsEnum(EGender)
  @IsOptional()
  gender?: EGender

  @IsOptional()
  @Transform(({ value }) => new Date(value)) // Chuyển chuỗi thành Date
  @IsDate()
  birthday?: Date;


}
