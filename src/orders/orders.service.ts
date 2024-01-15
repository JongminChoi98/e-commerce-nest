import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetails, OrderItems } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderInputDto, OrderOutputDto } from './dtos/order.dto';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Payment } from 'src/payments/entities/payment.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderItems)
    private orderItems: Repository<OrderItems>,

    @InjectRepository(OrderDetails)
    private orderDetails: Repository<OrderDetails>,

    @InjectRepository(Payment)
    private payments: Repository<Payment>,

    @InjectRepository(Product)
    private products: Repository<Product>,
  ) {}

  async createOrder(
    userId: number,
    { quantity, productId }: CreateOrderInputDto,
  ): Promise<CoreOutput> {
    try {
      const payment = await this.payments.findOneOrFail({
        where: { userId: userId },
      });

      const product = await this.products.findOneOrFail({
        where: { id: productId },
      });

      const totalPrice = product.price * quantity;

      const orderDetail = this.orderDetails.create({
        price: totalPrice,
        paymentId: payment.id,
        userId: userId,
      });
      await this.orderDetails.save(orderDetail);

      const orderItem = this.orderItems.create({
        quantity: quantity,
        orderId: orderDetail.id,
        productId: productId,
      });
      await this.orderItems.save(orderItem);

      return { success: true };
    } catch (error) {
      return { success: false, error: "Couldn't create an order." };
    }
  }

  async listOrderByUser(userId: number): Promise<OrderOutputDto> {
    try {
      const orders = await this.orderItems
        .createQueryBuilder('order_items')
        .innerJoinAndSelect(
          'order_details', // This should be the name of the relation as defined in your entity
          'details', // Alias for the joined table
          'details.id = order_items.orderId', // Join condition
        )
        .where('details.userId = :userId', { userId })
        .orderBy('order_items.updatedAt', 'ASC')
        .getMany();

      return { success: true, orders };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Unknown error has occurred.',
      };
    }
  }
}
