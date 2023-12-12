import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './users.service';
import {
  CreateUserInputDto,
  CreateUserOutputDto,
} from './dtos/create-account.dto';
import JwtAuthGuard from 'src/auth/guard/jwt-auth.guard';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';

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
  getUser(@Req() request: RequestWithUser) {
    const { user } = request;
    return user;
  }
}
