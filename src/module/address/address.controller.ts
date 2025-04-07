import { IdParam } from 'src/common/validate';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import JwtAuthGuard from '../auth/guard/jwt-auth.guard';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/createAddress.dto';
import { UpdateAddressDto } from './dto/updateAddress.dto';
import { Address } from 'src/database/entity/address.entity';


@Controller('')
export class AddressController {
  constructor(
    private readonly addressService: AddressService,

  ) {}

  @Post('user/address')
  @UseGuards(JwtAuthGuard)
  async createAddress(@Req() req, @Body() createAddressDto: CreateAddressDto) {
   
    const address: Address = await this.addressService.findByUserId(
      req.user.id,
    );
    if (address) {
      await this.addressService.updateAddress(
        req.user.id,
        address.id,
        createAddressDto,
      );
    } else {
      await this.addressService.createAddress({
        ...createAddressDto,
        userId: req.user.id,
      });
    }
 
    return { message: 'Create successfully' };
  }

  @Get('user/address')
  @UseGuards(JwtAuthGuard)
  async getAddressByUserId(@Req() req) {
     return  this.addressService.findByUserId(req.user.id)
  }

  @Put('user/address/:id')
  @UseGuards(JwtAuthGuard)
  async updateAddress(
    @Req() req,
    @Param() { id }: IdParam,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    const result = await this.addressService.updateAddress(
      req.user.id,
      id,
      updateAddressDto,
    );
    return result;
  }
}
