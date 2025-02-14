import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Commune } from 'src/database/entity/commune.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommuneService {
  constructor(
    @InjectRepository(Commune)
    private readonly communeRepo: Repository<Commune>,
  ) {}

  async findById(districtId: string,id: string) {
    const commune: Commune = await this.communeRepo.findOneBy({ districtId,id });
    if (!commune) {
      throw new NotFoundException('Không tìm thấy xã phường ');
    }
    return commune;
  }
}
