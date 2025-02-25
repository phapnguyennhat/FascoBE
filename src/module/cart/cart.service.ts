import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'src/database/entity/cartItem.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CreateCartItem } from './dto/createCartItem.dto';
import { UpdateCartItemDto } from './dto/updateCartItem.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
  ) {}

  async createCartItem(createCartItem: CreateCartItem) {
    const cartItem: CartItem = await this.cartItemRepo.findOneBy({
      userId: createCartItem.userId,
      varientId: createCartItem.varientId,
    });
    if (cartItem) {
      return this.updateCartItem(cartItem.id,createCartItem.userId, {
        quantity: cartItem.quantity + createCartItem.quantity,
      });
    }
    return this.cartItemRepo.save(createCartItem);
  }

  async updateCartItem(id: string, userId: string,updateCartItemDto: UpdateCartItemDto) {
    return this.cartItemRepo.update({id, userId}, updateCartItemDto);
  }

  async deleteCartItem (id: string, userId: string){
    return this.cartItemRepo.delete({userId, id})
  }

  async getCartByUserId(userId: string) {
    return this.cartItemRepo
      .createQueryBuilder('cartItem')
      .orderBy('cartItem.createAt', 'DESC')
      .innerJoin('cartItem.varient', 'varient')
      .innerJoin('varient.product', 'product')
      .innerJoin('varient.valueAttrs', 'valueAttrs')
      .innerJoin('valueAttrs.image', 'image')
      .innerJoin('valueAttrs.attrProduct', 'attrProduct')
      .select([
        'cartItem.id',
        'cartItem.varientId',
        'valueAttrs.value',
        // 'valueAttrs.attrName',
        'attrProduct.name',
        'image.url',
        'cartItem.quantity',
        'product.name',
        'product.pieceAvail',
        'product.sold',
        'product.id',
        'varient.price',
        'varient.discountPrice',
        'varient.sold',
        'varient.pieceAvail',
      ])
      .getMany();
  }

  async deleteByUserId(userId: string, queryRunner?:QueryRunner){
    if(queryRunner){
     return queryRunner.manager.delete(CartItem,{userId})
    }
    return this.cartItemRepo.delete({userId})

  }
}
