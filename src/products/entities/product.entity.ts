import { CoreEntity } from 'src/common/entities/core.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { ProductCategory } from './product-category.entity';
import { OrderItems } from 'src/orders/entities/order.entity';

@Entity()
export class Product extends CoreEntity {
  @Column()
  name: String;

  @Column()
  description: String;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  price: Number;

  @Column()
  quantity: Number;

  @ManyToOne(() => ProductCategory, (category) => category.products)
  category: ProductCategory;

  @OneToMany(() => OrderItems, (order) => order.products)
  orders: OrderItems[];
}
