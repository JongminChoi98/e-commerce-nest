import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart-product.entity';
import { Repository } from 'typeorm';
import { AddCartInputDto, AddCartOutputDto } from './dtos/add-cart.dto';
import { Product } from 'src/products/entities/product.entity';
import { ReadCartOutputDto } from './dtos/read-cart.dto';
import { DeleteCartOutputDto } from './dtos/delete-cart.dto';
import { UpdateCartOutputDto } from './dtos/update-cart-dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private carts: Repository<Cart>,

    @InjectRepository(Product)
    private products: Repository<Product>,
  ) {}

  async addCart({
    userId,
    productId,
  }: AddCartInputDto): Promise<AddCartOutputDto> {
    try {
      const exists = await this.carts.findOne({
        where: { productId: productId },
      });

      if (exists) {
        const cart = await this.carts.findOne({
          where: { productId: productId },
        });
        cart.quantity++;
        await this.carts.save(cart);
      } else {
        const product = await this.products.findOneOrFail({
          where: { id: productId },
        });

        const cart = this.carts.create({
          name: product.name,
          quantity: 1,
          userId: userId,
          productId: productId,
        });
        await this.carts.save(cart);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Unknown error has occurred.' };
    }
  }

  async findCart(userId: number): Promise<ReadCartOutputDto> {
    try {
      const carts = await this.carts.find({
        where: { userId: userId },
      });

      return { success: true, carts };
    } catch (error) {
      return { success: false, error: "Couldn't find cart" };
    }
  }

  async deleteCart(
    userId: number,
    cartId: number,
  ): Promise<DeleteCartOutputDto> {
    try {
      const cart = await this.carts.findOneOrFail({ where: { id: cartId } });
      if (cart.userId !== userId) {
        return { success: false, error: 'Not allowed.' };
      }

      await this.carts
        .createQueryBuilder()
        .delete()
        .from(Cart)
        .where('id = :id', { id: cartId })
        .execute();

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Unknown error has occurred.' };
    }
  }

  async updateCart(
    cartId: number,
    quantity: number,
  ): Promise<UpdateCartOutputDto> {
    try {
      const cart = await this.carts.findOneOrFail({ where: { id: cartId } });

      cart.quantity = quantity;
      await this.carts.save(cart);

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Unknown error has occurred.' };
    }
  }
}
