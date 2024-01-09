import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetails, OrderItems } from './entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItems, OrderDetails])],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
