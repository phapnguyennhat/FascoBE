import { Type } from "class-transformer"
import { IsNotEmpty, IsString } from "class-validator"

import { IsNumber } from "class-validator"

export class MomoResponseDto { 

    // @IsNumber()
    // @IsNotEmpty()
    // @Type(()=>Number)
    resultCode: number

    // @IsString()
    // @IsNotEmpty()
    orderId: string
 
}
