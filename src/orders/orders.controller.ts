import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import JwtAuthGuard from 'src/auth/guard/jwt-auth.guard';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';
import { CreateOrderInputDto, OrderOutputDto } from './dtos/order.dto';
import { CoreOutput } from 'src/common/dtos/output.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  listOrders(@Req() request: RequestWithUser): Promise<OrderOutputDto> {
    const { id } = request.user;
    return this.orderService.listOrderByUser(id);
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  createOrder(
    @Req() request: RequestWithUser,
    @Body() order: CreateOrderInputDto,
  ): Promise<CoreOutput> {
    const { id } = request.user;
    return this.orderService.createOrder(id, order);
  }
}
