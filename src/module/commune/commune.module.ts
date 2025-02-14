import { Module } from '@nestjs/common';
import { CommuneService } from './commune.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commune } from 'src/database/entity/commune.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Commune])],
  providers: [CommuneService],
  exports: [CommuneService]
})
export class CommuneModule {}
