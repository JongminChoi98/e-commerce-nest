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
import {
  CreateUserInputDto,
  CreateUserOutputDto,
} from './dtos/create-account.dto';
import JwtAuthGuard from 'src/auth/guard/jwt-auth.guard';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';
import { UserOutputDto } from './dtos/user.dto';
import {
  UpdateUserInputDto,
  UpdateUserOutputDto,
} from './dtos/edit-account.dto';
import { CreateAddressInputDto } from './dtos/create-address.dto';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { AddressOutputDto } from './dtos/address.dto';
import { UpdateAddressInputDto } from './dtos/update-address.dto';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserInputDto,
  ): Promise<CreateUserOutputDto> {
    return this.usersService.signup(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  getUser(@Req() request: RequestWithUser): Promise<UserOutputDto> {
    const { user } = request;
    return this.usersService.findById(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('')
  updateUser(
    @Req() request: RequestWithUser,
    @Body() updateUserDto: UpdateUserInputDto,
  ): Promise<UpdateUserOutputDto> {
    const { id } = request.user;
    return this.usersService.updateProfile(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('address')
  addAddress(
    @Req() request: RequestWithUser,
    @Body() addressDto: CreateAddressInputDto,
  ): Promise<CoreOutput> {
    const { id } = request.user;
    return this.usersService.addAddress(addressDto, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('address')
  readAddress(@Req() request: RequestWithUser): Promise<AddressOutputDto> {
    const { id } = request.user;
    return this.usersService.readAddress(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('address')
  updateAddress(
    @Req() request: RequestWithUser,
    @Body() updateAddressDto: UpdateAddressInputDto,
  ): Promise<CoreOutput> {
    const { id } = request.user;
    return this.usersService.updateAddress(id, updateAddressDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('address')
  deleteAddress(@Req() request: RequestWithUser): Promise<CoreOutput> {
    const { id } = request.user;
    return this.usersService.deleteAddress(id);
  }
}
