import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import JwtAuthGuard from 'src/auth/guard/jwt-auth.guard';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';
import { AddCartInputDto, AddCartOutputDto } from './dtos/add-cart.dto';
import { DeleteCartInputDto } from './dtos/delete-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  addCart(
    @Req() request: RequestWithUser,
    @Body() addCartInput: AddCartInputDto,
  ): Promise<AddCartOutputDto> {
    const { id } = request.user;
    addCartInput.userId = id;

    return this.cartService.addCart(addCartInput);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  readCart(@Req() request: RequestWithUser) {
    const { id } = request.user;
    return this.cartService.findCart(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':cid(\\d+)')
  DeleteCartInputDto(
    @Req() request: RequestWithUser,
    @Param('cid') cartId: number,
  ) {
    const { id } = request.user;
    return this.cartService.deleteCart(id, cartId);
  }
}
