import { Transform } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";

export class UpdateLogDto {
    @IsOptional()
    @IsBoolean()
    hasRead: boolean
}