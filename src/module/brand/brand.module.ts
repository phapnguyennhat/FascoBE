import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from 'src/database/entity/brand.entity';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [TypeOrmModule.forFeature([Brand]), ImageModule],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
