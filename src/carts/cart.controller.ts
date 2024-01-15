import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import JwtAuthGuard from 'src/auth/guard/jwt-auth.guard';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';
import { AddCartInputDto } from './dtos/add-cart.dto';
import { UpdateCartInputDto } from './dtos/update-cart-dto';
import { CoreOutput } from 'src/common/dtos/output.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  addCart(
    @Req() { user: { id } }: RequestWithUser,
    @Body() addCartInput: AddCartInputDto,
  ): Promise<CoreOutput> {
    addCartInput.userId = id;
    return this.cartService.addCart(addCartInput);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  readCart(@Req() { user: { id } }: RequestWithUser) {
    return this.cartService.findCart(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':cid(\\d+)')
  deleteCart(
    @Req() { user: { id } }: RequestWithUser,
    @Param('cid') cartId: number,
  ) {
    return this.cartService.deleteCart(id, cartId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':cid(\\d+)')
  updateCart(@Body() body: UpdateCartInputDto, @Param('cid') cartId: number) {
    const { quantity } = body;
    return this.cartService.updateCart(cartId, quantity);
  }
}
