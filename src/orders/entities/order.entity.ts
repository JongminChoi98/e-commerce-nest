import { CoreEntity } from 'src/common/entities/core.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class OrderDetails extends CoreEntity {
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  price: number;

  @Column()
  paymentId: number;

  @Column()
  userId: number;

  // @Column()
  // status: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Payment, (payment) => payment.orders)
  @JoinColumn({ name: 'paymentId' })
  payment: Payment;

  @OneToMany(() => OrderItems, (order) => order.detail)
  orders: OrderItems[];
}

@Entity()
export class OrderItems extends CoreEntity {
  @Column()
  quantity: number;

  @Column()
  orderId: number;

  @Column()
  productId: number;

  @ManyToOne(() => OrderDetails, (detail) => detail.orders)
  @JoinColumn({ name: 'orderId' })
  detail: OrderDetails;

  @ManyToOne(() => Product, (product) => product.orders)
  @JoinColumn({ name: 'productId' })
  products: Product;
}
