import { IsNotEmpty, IsString } from "class-validator";

export class stringValueIdsDto {
  @IsString()
  @IsNotEmpty()
  stringvalueIds: string
}