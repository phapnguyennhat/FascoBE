import { Module } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { ProvinceController } from './province.controller';
import { Province } from 'src/database/entity/province.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistrictModule } from '../district/district.module';

@Module({
  imports: [TypeOrmModule.forFeature([Province]), DistrictModule],
  controllers: [ProvinceController],
  providers: [ProvinceService],
})
export class ProvinceModule {}
