import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateLogDto {
    @IsNotEmpty()
    @IsString()
    message: string


    // if receiverId is not provided, it will be sent to all admins
    @IsOptional()
    @IsString()
    receiverId: string

    @IsNotEmpty()
    @IsString()
    href: string
}
