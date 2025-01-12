import { IsNotEmpty, IsString } from "class-validator";

export class TokenVerifyDto {
  @IsNotEmpty()
  @IsString()
  credential: string
}