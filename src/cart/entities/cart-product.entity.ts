import { CoreEntity } from 'src/common/entities/core.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class Cart extends CoreEntity {
  @Column()
  name: String;

  @Column()
  quantity: Number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => Product)
  @JoinColumn()
  product: Product;
}
