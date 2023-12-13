import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateUserInputDto,
  CreateUserOutputDto,
} from './dtos/create-account.dto';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';
import { UserOutputDto } from './dtos/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async signup({
    email,
    password,
    firstName,
    lastName,
    phone = '',
  }: CreateUserInputDto): Promise<CreateUserOutputDto> {
    try {
      const exists = await this.users.findOne({ where: { email } });

      if (exists) {
        return { success: false, error: 'User already exists' };
      }

      const user = this.users.create({
        email,
        password,
        firstName,
        lastName,
        phone,
      });
      await this.users.save(user);

      return { success: true };
    } catch (error) {
      return { success: false, error: "Couldn't create account" };
    }
  }

  async findById(id: number): Promise<UserOutputDto> {
    try {
      const user = await this.users.findOne({ where: { id } });
      if (user) {
        return { success: true, user };
      }

      return { success: false, error: "Couldn't find account" };
    } catch (error) {
      return { success: false, error: 'Unknown error has occurred.' };
    }
  }

  async findByEmail(email: string): Promise<UserOutputDto> {
    try {
      const user = await this.users.findOne({ where: { email } });
      if (user) {
        return { success: true, user };
      }
      return { success: false, error: "Couldn't find account" };
    } catch (error) {
      return { success: false, error: 'Unknown error has occurred.' };
    }
  }
  async profile(request: RequestWithUser): Promise<UserOutputDto> {
    try {
      const { user } = request;
      return { success: true, user };
    } catch (error) {
      return { success: false, error: 'Unknown error has occurred.' };
    }
  }
}
