import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import JwtAuthGuard from '../auth/guard/jwt-auth.guard';
import { CreateProductDto } from './dto/createProduct.dto';
import {
  CreateAttrProduct,
  CreateAttrProductDtos,
} from './dto/createAttrProduct.dto';
import { IdParam } from 'src/common/validate';
import { CreateValueAttr, CreateValueAttrDto } from './dto/createValueAttr.dto';
import { CreateVarientDto } from './dto/createVarient.dto';

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

  @Post(':id/attrProduct')
  @UseGuards(JwtAuthGuard)
  createAttrProduct(
    @Param() { id }: IdParam,
    @Body() createAttrProductDtos: CreateAttrProductDtos,
  ) {
    const createAttrProducts: CreateAttrProduct[] =
      createAttrProductDtos.createAttrProducts.map((item) => ({
        ...item,
        productId: id,
      }));
    return this.productService.createAttr(createAttrProducts);
  }

  @Post(':id/varient')
  @UseGuards(JwtAuthGuard)
  async createVarient(
    @Param() { id }: IdParam,
    @Body() createVarientDto: CreateVarientDto,
  ) {
    const product = await this.productService.findById(id)
    const valueAttrs: CreateValueAttr[] = createVarientDto.valueAttrs.map(item =>{
      
      return {...item, productId: id}
    })

    return this.productService.createVarient({
      ...createVarientDto,
      valueAttrs,
      productId: id,
    });
  }
}
