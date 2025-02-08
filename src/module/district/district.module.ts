import { Module } from '@nestjs/common';
import { DistrictService } from './district.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { District } from 'src/database/entity/district.entity';

@Module({
  imports: [TypeOrmModule.forFeature([District])],
  providers: [DistrictService],
  exports: [DistrictService]
})
export class DistrictModule {}
