import { CoreEntity } from 'src/common/entities/core.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Address extends CoreEntity {
  @Column()
  addressLine1: string;

  @Column({ nullable: true })
  addressLine2: string;

  @Column()
  city: string;

  @Column()
  postalCode: number;

  @Column()
  country: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.address)
  @JoinColumn({ name: 'userId' })
  user: User;
}
