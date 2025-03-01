import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ConfirmDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  code :string
}