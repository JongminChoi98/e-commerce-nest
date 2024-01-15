import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserInputDto } from './dtos/create-account.dto';
import JwtAuthGuard from 'src/auth/guard/jwt-auth.guard';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';
import { UserOutputDto } from './dtos/user.dto';
import { UpdateUserInputDto } from './dtos/edit-account.dto';
import { CreateAddressInputDto } from './dtos/create-address.dto';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { AddressOutputDto } from './dtos/address.dto';
import { UpdateAddressInputDto } from './dtos/update-address.dto';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserInputDto): Promise<CoreOutput> {
    return this.usersService.signup(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  getUser(@Req() { user: { id } }: RequestWithUser): Promise<UserOutputDto> {
    return this.usersService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('')
  updateUser(
    @Req() { user: { id } }: RequestWithUser,
    @Body() updateUserDto: UpdateUserInputDto,
  ): Promise<CoreOutput> {
    return this.usersService.updateProfile(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('address')
  addAddress(
    @Req() { user: { id } }: RequestWithUser,
    @Body() addressDto: CreateAddressInputDto,
  ): Promise<CoreOutput> {
    return this.usersService.addAddress(addressDto, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('address')
  readAddress(
    @Req() { user: { id } }: RequestWithUser,
  ): Promise<AddressOutputDto> {
    return this.usersService.readAddress(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('address')
  updateAddress(
    @Req() { user: { id } }: RequestWithUser,
    @Body() updateAddressDto: UpdateAddressInputDto,
  ): Promise<CoreOutput> {
    return this.usersService.updateAddress(id, updateAddressDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('address')
  deleteAddress(@Req() { user: { id } }: RequestWithUser): Promise<CoreOutput> {
    return this.usersService.deleteAddress(id);
  }
}
