import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';

  import { Type } from 'class-transformer';
import { ERequestTypeMoMo } from 'src/common/enum/ERequestTypeMoMo';
  
  export class ConfirmMomoDto {
    @IsNotEmpty()
    @IsString()
    partnerCode: string;
  
    @IsNotEmpty()
    @IsString()
    requestId: string;
  
    @IsNotEmpty()
    orderId: string;
  
    @IsNotEmpty()
    @IsEnum(ERequestTypeMoMo)
    requestType: ERequestTypeMoMo;
  
    @IsNotEmpty()
    @IsString()
    lang: string;
  
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    amount: number;
  
    @IsOptional()
    @IsString()
    description: string;
  }
  