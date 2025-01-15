import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateValueAttr, CreateValueAttrDto } from './createValueAttr.dto';
import { IsSet } from 'src/common/decorator/isSet';
import { ValueAttr } from 'src/database/entity/valueAttr.entity';

export class CreateVarientDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Min(10)
  pieceAvail: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must have at most 2 decimal places' },
  )
  @IsPositive({ message: 'Price must be a positive number' })
  price: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must have at most 2 decimal places' },
  )
  @IsPositive({ message: 'Price must be a positive number' })
  discountPrice: number;

  @IsArray()
  @ArrayMinSize(1, {
    message: 'valueAttrIds must contain at least one element',
  })
  @IsUUID('4', { each: true, message: 'Each valueAttrId must be a valid UUID' })
  @IsSet({
    message: 'valueAttrIds must not contain duplicate elements',
  })
  valueAttrIds: string[];
}

export class CreateVarient extends CreateVarientDto {
  productId: string;
  valueAttrs: ValueAttr[]
 
}
