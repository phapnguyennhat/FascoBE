import { Module } from '@nestjs/common';
import { MomoService } from './momo.service';
import { MomoController } from './momo.controller';

@Module({
  controllers: [MomoController],
  providers: [MomoService],
})
export class MomoModule {}
