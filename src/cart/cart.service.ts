import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart-product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private carts: Repository<Cart>,
  ) {}

  //TODO: ADD Product to cart
  //TODO: READ Product from cart
  //TODO: DELETE Cart product
  //TODO: UPDATE Cart product
}
