import { CoreEntity } from 'src/common/entities/core.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductCategory extends CoreEntity {
  @Column()
  name: String;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
