import { Cart } from 'src/carts/entities/cart-product.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { Address } from './user-address.entity';
import { OrderDetails } from 'src/orders/entities/order.entity';

@Entity()
export class User extends CoreEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @OneToMany(() => Address, (address) => address.user)
  address: Address[];

  @OneToMany(() => OrderDetails, (order) => order.user)
  orders: OrderDetails[];

  @Column('boolean', { default: 0 })
  hasAddress: boolean;
}
