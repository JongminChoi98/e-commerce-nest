import { Cart } from 'src/carts/entities/cart-product.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { Address } from './user-address.entity';

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

  @Column('boolean', { default: 0 })
  hasAddress: boolean;
}
