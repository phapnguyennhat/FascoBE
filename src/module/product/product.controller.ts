import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import JwtAuthGuard from '../auth/guard/jwt-auth.guard';
import { CreateProductDto } from './dto/createProduct.dto';
import {
  CreateAttrProduct,
  CreateAttrProductDtos,
} from './dto/createAttrProduct.dto';
import { IdParam } from 'src/common/validate';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  create(@Req() req, @Body() createProductDto: CreateProductDto) {
    return this.productService.create({
      ...createProductDto,
      userId: req.user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/attrProduct')
  createAttrProduct(
    @Param() { id }: IdParam,
    @Body() createAttrProductDtos: CreateAttrProductDtos,
  ) {
    const createAttrProducts : CreateAttrProduct[] = createAttrProductDtos.createAttrProducts.map(item => ({...item, productId: id}))
    return this.productService.createAttr(createAttrProducts)
  }
}
