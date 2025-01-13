import { IsNotEmpty, IsUUID } from "class-validator";

export class IdParam{
  @IsUUID()
  @IsNotEmpty()
  id: string
}