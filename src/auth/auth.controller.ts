import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import RequestWithUser from './interfaces/requestWithUser.interface';
import JwtAuthGuard from './guard/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  signIn(@Req() request: RequestWithUser, @Res() response: Response): Response {
    const { user } = request;
    const cookie = this.authService.getCookieWithJwtToken(user);
    response.setHeader('Set-Cookie', cookie);
    return response.json({ success: true });
  }

  @UseGuards(JwtAuthGuard)
  @Post('log-out')
  async logOut(_: null, @Res() response: Response): Promise<Response> {
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return response.json({ success: true });
  }
}
