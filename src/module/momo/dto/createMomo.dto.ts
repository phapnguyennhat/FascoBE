import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ERequestTypeMoMo } from 'src/common/enum/ERequestTypeMoMo';


export class CreateMomoDto {
  @IsString()
  @IsNotEmpty()
  partnerCode: string;

  @IsString()
  @IsOptional()
  partnerName?: string;

  @IsString()
  @IsOptional()
  storeId?: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  amount: number;

  @IsString()
  @IsNotEmpty()
  orderInfo: string;

  @IsBoolean()
  @IsOptional()
  autoCapture?: boolean = true;

  @IsUrl()
  @IsNotEmpty()
  redirectUrl: string;

  @IsUrl()
  @IsNotEmpty()
  ipnUrl: string;

  @IsNotEmpty()
  @IsString()
  extraData: string;

  @IsNotEmpty()
  @IsString()
  orderId: string;

  @IsNotEmpty()
  @IsString()
  requestId: string;

  @IsNotEmpty()
  @IsEnum(ERequestTypeMoMo)
  requestType: ERequestTypeMoMo;

  @IsNotEmpty()
  @IsString()
  lang: string;
}
