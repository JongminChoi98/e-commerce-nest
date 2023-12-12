import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './users.service';
import {
  CreateUserInputDto,
  CreateUserOutputDto,
} from './dtos/create-account.dto';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserInputDto,
  ): Promise<CreateUserOutputDto> {
    return this.usersService.signup(createUserDto);
  }
}
