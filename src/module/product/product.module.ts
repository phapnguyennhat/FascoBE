import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/database/entity/product.entity';
import { AttrProduct } from 'src/database/entity/attrProduct.entity';
import { ValueAttr } from 'src/database/entity/valueAttr.entity';
import { Varient } from 'src/database/entity/varient.entity';
import { ImageModule } from '../image/image.module';
import { Tag } from 'src/database/entity/tag.entity';
import { VarientValue } from 'src/database/entity/varient_value.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, AttrProduct, ValueAttr, Varient, Tag, VarientValue]), ImageModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
