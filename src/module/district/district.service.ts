import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { District } from 'src/database/entity/district.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DistrictService {
  constructor(
    @InjectRepository(District)
    private readonly districtRepo: Repository<District>,
  ) {}
  async findById(provinceId: string,id: string) {
    const district: District = await this.districtRepo.findOne({
      where: { id, provinceId },
      relations: {
        communes: true,
      },
     
    });
    if (!district) {
      throw new NotFoundException('Không tìm thấy quận/huyện');
    }
    return district;
  }
}
