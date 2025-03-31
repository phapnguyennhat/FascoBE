import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { DistrictService } from '../district/district.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { REDIS_MANAGER } from 'src/common/constant';
import Redis from 'ioredis';

@Controller('province')
export class ProvinceController {
  constructor(
    private readonly provinceService: ProvinceService,
    private readonly districtService: DistrictService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Get(':id')
  findProvinceById(@Param('id') id: string) {
    return this.cacheManager.wrap(`province:${id}`, ()=>this.provinceService.findById(id))
  }

  @Get(':provinceId/district/:districtId')
  findDistrictById(@Param() { provinceId, districtId }: { provinceId: string, districtId: string }) {
    return this.cacheManager.wrap(`province:${provinceId}:district:${districtId}`, ()=>this.districtService.findById(provinceId, districtId))
  }

  @Get('')  
  findAll() { 
    return this.cacheManager.wrap(`province:all`, ()=>this.provinceService.findAll())
  }
}