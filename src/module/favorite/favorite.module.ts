import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { TypeORMError } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteDetail } from 'src/database/entity/favoriteDetail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FavoriteDetail])],
  controllers: [FavoriteController],
  providers: [FavoriteService],
})
export class FavoriteModule {}
