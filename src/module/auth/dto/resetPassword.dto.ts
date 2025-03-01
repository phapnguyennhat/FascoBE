import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ResetPasswordDto {

  @IsNotEmpty()
  @IsString()
  @MinLength(6, {message: 'Password must be longer than or equal 6 characters long'})
  password: string
}