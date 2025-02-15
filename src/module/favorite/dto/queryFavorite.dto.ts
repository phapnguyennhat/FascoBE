import { Type } from "class-transformer";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { QueryParam } from "src/common/queryParam";

export class QueryFavoriteDto extends QueryParam{
  @IsString()
  @IsOptional()
  status?:string

  @IsBoolean()
  @IsOptional()
  @Type(()=>Boolean)
  discount?:boolean

  @IsString()
  @IsOptional()
  category?: string
}