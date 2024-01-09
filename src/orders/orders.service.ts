import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetails, OrderItems } from './entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderItems)
    private orderItems: Repository<OrderItems>,

    @InjectRepository(OrderDetails)
    private orderDetails: Repository<OrderDetails>,
  ) {}
}
