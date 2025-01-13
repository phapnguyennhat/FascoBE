import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateValueAttr, CreateValueAttrDto } from './createValueAttr.dto';

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

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({each: true})
  @Type(() => CreateValueAttrDto)
  valueAttrs: CreateValueAttrDto[];
}

export class CreateVarient extends CreateVarientDto{
  productId: string;
  valueAttrs: CreateValueAttr[]
}
