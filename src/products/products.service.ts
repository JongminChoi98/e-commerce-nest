import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductOutputDto } from './dtos/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private products: Repository<Product>,
  ) {}

  async findAll(params: PagenationOption): Promise<ProductOutputDto> {
    try {
      const products = await this.products
        .createQueryBuilder('product')
        .orderBy('product.id', 'ASC')
        .offset(params.offset)
        .limit(params.limit)
        .getMany();

      return { success: true, products };
    } catch (error) {
      return { success: false, error: 'Unknown error has occurred.' };
    }
  }

  async findAllByCategory(
    categoryId: number,
    params: PagenationOption,
  ): Promise<ProductOutputDto> {
    try {
      const products = await this.products
        .createQueryBuilder('product')
        .where('product.categoryId = :categoryId', { categoryId })
        .orderBy('product.id', 'ASC')
        .offset(params.offset)
        .limit(params.limit)
        .getMany();

      return { success: true, products };
    } catch (error) {
      return { success: false, error: 'Unknown error has occurred.' };
    }
  }

  async searchByName(params: PagenationOption): Promise<ProductOutputDto> {
    try {
      const products = await this.products
        .createQueryBuilder('product')
        .where('product.name like :search', { search: `%${params.search}%` })
        .orderBy('product.id', 'ASC')
        .offset(params.offset)
        .limit(params.limit)
        .getMany();

      return { success: true, products };
    } catch (error) {
      return { success: false, error: 'Unknown error has occurred.' };
    }
  }
}
