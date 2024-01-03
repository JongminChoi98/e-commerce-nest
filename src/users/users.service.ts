import { Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateUserInputDto,
  CreateUserOutputDto,
} from './dtos/create-account.dto';
import { UserOutputDto } from './dtos/user.dto';
import {
  UpdateUserInputDto,
  UpdateUserOutputDto,
} from './dtos/edit-account.dto';
import { hashPassword } from 'src/utils/hash-password';

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

      password = await hashPassword(password);

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
      const user = await this.users.findOneOrFail({ where: { id } });
      return { success: true, user };
    } catch (error) {
      return { success: false, error: "Couldn't find user" };
    }
  }

  async findByEmail(email: string): Promise<UserOutputDto> {
    try {
      const user = await this.users.findOneOrFail({ where: { email } });
      return { success: true, user };
    } catch (error) {
      return { success: false, error: "Couldn't find user" };
    }
  }

  async updateProfile(
    userId: number,
    updateUserDto: UpdateUserInputDto,
  ): Promise<UpdateUserOutputDto> {
    try {
      const user = await this.users.findOneOrFail({ where: { id: userId } });
      if (updateUserDto.password) {
        updateUserDto.password = await hashPassword(updateUserDto.password);
      }

      Object.assign(user, updateUserDto);
      await this.users.save(user);

      return { success: true };
    } catch (error) {
      return { success: false, error: "Couldn't find user" };
    }
  }
}
