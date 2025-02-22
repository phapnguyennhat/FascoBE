import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/database/entity/order.entity';
import { CartModule } from '../cart/cart.module';
import { OrderItem } from 'src/database/entity/orderItem.entity';
import { ProvinceModule } from '../province/province.module';
import { DistrictModule } from '../district/district.module';
import { CommuneModule } from '../commune/commune.module';
import { AddressModule } from '../address/address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    CartModule,
    ProvinceModule,
    DistrictModule,
    CommuneModule,
    AddressModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
