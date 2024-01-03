import { CoreEntity } from 'src/common/entities/core.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Cart extends CoreEntity {
  @Column()
  name: String;

  @Column()
  quantity: number;

  @Column()
  userId: number;

  @Column()
  productId: number;

  @ManyToOne(() => User, (user) => user.carts)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;
}
