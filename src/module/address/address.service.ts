import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/database/entity/address.entity';
import { Repository } from 'typeorm';
import { CreateAddress } from './dto/createAddress.dto';
import { UpdateAddressDto } from './dto/updateAddress.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
  ) {}

  async createAddress (createAddress: CreateAddress){
    return this.addressRepo.save(createAddress)
  }

  async updateAddress (userId: string,id: string,updateAddressDto :UpdateAddressDto){
    return this.addressRepo.update({userId, id}, updateAddressDto)
  }

  async findByUserId(userId: string){
    return this.addressRepo.findOne({where: {userId}, relations: {
      province: true,
      district: true,
      commune: true
    }})
  }
}
