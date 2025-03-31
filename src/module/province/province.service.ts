import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Province } from 'src/database/entity/province.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectRepository(Province)
    private readonly provinceRepo: Repository<Province>,
  ) {}



  async findById(id: string) {
    const province: Province = await this.provinceRepo.findOne({
      where: { id },
      relations: {
        districts: true,
      },
      order: {
        districts: {
          name: 'ASC'
        }
      }
    });
    if (!province) {
      throw new NotFoundException('Không tìm thấy province ');
    }
    return province;
  }

  findAll() {
    return this.provinceRepo.find({
      order: {
      name: 'ASC'
    }});
  }
}
