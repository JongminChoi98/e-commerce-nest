import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserInputDto } from './dtos/create-account.dto';
import { UserOutputDto } from './dtos/user.dto';
import { UpdateUserInputDto } from './dtos/edit-account.dto';
import { hashPassword } from 'src/utils/hash-password';
import { CreateAddressInputDto } from './dtos/create-address.dto';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Address } from './entities/user-address.entity';
import { AddressOutputDto } from './dtos/address.dto';
import { UpdateAddressInputDto } from './dtos/update-address.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,

    @InjectRepository(Address)
    private readonly addresses: Repository<Address>,
  ) {}

  async signup({
    email,
    password,
    firstName,
    lastName,
    phone = '',
  }: CreateUserInputDto): Promise<CoreOutput> {
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
  ): Promise<CoreOutput> {
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

  async addAddress(
    {
      addressLine1,
      addressLine2,
      city,
      postalCode,
      country,
    }: CreateAddressInputDto,
    userId: number,
  ): Promise<CoreOutput> {
    try {
      const user = await this.users.findOne({ where: { id: userId } });
      if (user.hasAddress) {
        return { success: false, error: 'Address exist.' };
      }

      const address = await this.addresses.create({
        addressLine1,
        addressLine2,
        city,
        postalCode,
        country,
        userId,
      });
      user.hasAddress = true;

      await this.addresses.save(address);
      await this.users.save(user);

      return { success: true };
    } catch (error) {
      return { success: false, error: "Couldn't create address" };
    }
  }
  async readAddress(userId: number): Promise<AddressOutputDto> {
    try {
      const address = await this.addresses.findOneOrFail({
        where: { userId: userId },
      });

      return { success: true, address };
    } catch (error) {
      return { success: false, error: "Couldn't find address" };
    }
  }

  async deleteAddress(userId: number): Promise<CoreOutput> {
    try {
      const user = await this.users.findOne({ where: { id: userId } });

      if (!user.hasAddress) {
        return { success: false, error: 'Address not exist' };
      }

      await this.addresses
        .createQueryBuilder()
        .delete()
        .from(Address)
        .where('userId = :id', { id: userId })
        .execute();

      user.hasAddress = false;
      await this.users.save(user);

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Unknown error has occurred.' };
    }
  }

  async updateAddress(
    userId: number,
    updateAddressDto: UpdateAddressInputDto,
  ): Promise<CoreOutput> {
    try {
      const address = await this.addresses.findOneOrFail({
        where: { userId: userId },
      });
      Object.assign(address, updateAddressDto);
      await this.addresses.save(address);

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Unknown error has occurred.' };
    }
  }
}
