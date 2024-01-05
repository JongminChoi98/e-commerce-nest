import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Payment extends CoreEntity {
  @Column()
  paymentType: string;

  @Column()
  accountNumber: string;

  @Column()
  expire: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.carts)
  @JoinColumn({ name: 'userId' })
  user: User;
}
