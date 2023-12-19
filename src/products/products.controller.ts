import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductOutputDto } from './dtos/product.dto';
import { ProductService } from './products.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('')
  async getProduct(
    @Query() params: PagenationOption,
  ): Promise<ProductOutputDto> {
    return this.productService.findAll(params);
  }

  @Get(':id(\\d+)')
  async getProductByCategory(
    @Query() params: PagenationOption,
    @Param('id') categoryID: number,
  ): Promise<ProductOutputDto> {
    return this.productService.findAllByCategory(categoryID, params);
  }

  @Get('search')
  async searchProduct(
    @Query() params: PagenationOption,
  ): Promise<ProductOutputDto> {
    return this.productService.searchtByName(params);
  }
}
