import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { Address } from './entities/user-address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}
