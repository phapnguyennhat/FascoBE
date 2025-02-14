import { IsNotEmpty, IsString } from "class-validator";

export class CreateFavoriteDto {
  @IsNotEmpty()
  @IsString()
  productId: string
}

export class CreateFavorite extends CreateFavoriteDto{
  userId: string
}