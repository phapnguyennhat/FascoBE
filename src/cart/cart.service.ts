import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'src/database/entity/cartItem.entity';
import { Repository } from 'typeorm';
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

  async getCartByUserId(userId: string) {
    return this.cartItemRepo
      .createQueryBuilder('cartItem')
      .innerJoin('cartItem.varient', 'varient')
      .innerJoin('varient.product', 'product')
      .innerJoin('varient.valueAttrs', 'valueAttrs')
      .innerJoin('valueAttrs.image', 'image')
      .select(['cartItem.id','valueAttrs.value','valueAttrs.attrName','image.url', 'cartItem.quantity', 'product.name', 'product.id', 'varient.price','varient.pieceAvail'])
      .getMany();
  }
}
