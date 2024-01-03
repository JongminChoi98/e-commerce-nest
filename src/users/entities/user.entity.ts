import { Cart } from 'src/cart/entities/cart-product.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Entity, Column, OneToMany } from 'typeorm';

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

  @Column('boolean', { default: 0 })
  hasAddress: boolean;
}
