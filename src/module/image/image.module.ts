import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseStorageModule } from '../firebase-storage/firebase-storage.module';
import { Image } from 'src/database/entity/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Image]), FirebaseStorageModule],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService]
})
export class ImageModule {}
