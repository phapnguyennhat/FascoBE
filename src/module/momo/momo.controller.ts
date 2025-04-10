import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { MomoService } from './momo.service';
import { CreateMomoDto } from './dto/createMomo.dto';
import JwtAuthGuard from '../auth/guard/jwt-auth.guard';
import { ERequestTypeMoMo } from 'src/common/enum/ERequestTypeMoMo';

@Controller('momo')
export class MomoController {
  constructor(private readonly momoService: MomoService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPaymentUrl(@Req() req, @Body() body: { amount: number, orderId: string }) {
    return this.momoService.createMomo(req.user.id, body.amount, body.orderId);
  }

  @Get('/detail/:orderId')
  async query(@Param('orderId') orderId: string) {
    return this.momoService.queryMomo(orderId);
  }

  @Post('/:orderId/cancel')
  cancel(@Param('orderId') orderId: string) {
    return this.momoService.actionPayment(
      1000,
      orderId,
      ERequestTypeMoMo.CANCEL,
    );
  }
}


