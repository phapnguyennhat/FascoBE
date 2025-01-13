import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/database/entity/product.entity';
import { AttrProduct } from 'src/database/entity/attrProduct.entity';
import { ValueAttr } from 'src/database/entity/valueAttr.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, AttrProduct, ValueAttr])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
