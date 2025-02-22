import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ERole } from "src/database/entity/user.entity";


export class CreateUserDto {

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  username: string

  @IsNotEmpty()
  @IsString()
  password: string;


  @IsNotEmpty()
  @IsEmail()
  email: string


  @IsOptional()
  @IsEnum(ERole)
  role: ERole
}