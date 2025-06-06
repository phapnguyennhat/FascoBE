import { IsNotEmpty, IsString } from "class-validator";

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  password: string

  @IsNotEmpty()
  @IsString()
  new_password: string

  @IsNotEmpty()
  @IsString()
  confirm_password: string
}

