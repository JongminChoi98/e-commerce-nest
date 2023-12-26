import {
  Body,
  Controller,
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
}
