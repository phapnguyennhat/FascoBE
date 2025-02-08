import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { DistrictService } from '../district/district.service';

@Controller('province')
export class ProvinceController {
  constructor(
    private readonly provinceService: ProvinceService,
    private readonly districtService: DistrictService,
  ) {}

  @Get(':id')
  findProvinceById(@Param('id') id: string) {
    return this.provinceService.findById(id);
  }

  @Get(':provinceId/district/:districtId')
  findDistrictById(@Param() {provinceId, districtId}: {provinceId: string, districtId: string}) {
    return this.districtService.findById(provinceId, districtId);
  }

  @Get('')
  findAll() { 
    return this.provinceService.findAll();
  }


}
