import { IsEnum, IsOptional } from "class-validator";
import { EOrder } from "src/common/order.enum";
import { QueryParam } from "src/common/queryParam";

export enum ELogCollection {
    HASREAD = 'hasRead',
    UNREAD = 'unRead',
    ALL = 'all'
}


export class QueryLogDto extends QueryParam {
    @IsOptional()
    @IsEnum(ELogCollection)
    collection: ELogCollection

    @IsOptional()
    @IsEnum(EOrder)
    createAt : EOrder
 }
