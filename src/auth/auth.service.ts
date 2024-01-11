import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/users/users.service';
import { UserOutputDto } from 'src/users/dtos/user.dto';
import { CoreOutput } from 'src/common/dtos/output.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async getAuthenticatedUser(
    email: string,
    plainTextPassword: string,
  ): Promise<UserOutputDto> {
    try {
      const { user } = await this.userService.findByEmail(email);
      const result = await this.verifyPassword(
        plainTextPassword,
        user.password,
      );

      if (result.success) {
        user.password = undefined;
        return { success: true, user };
      }

      return { success: false, error: 'Invalid authentication information.' };
    } catch (error) {
      return { success: false, error: 'Unknown error has occurred.' };
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<CoreOutput> {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (isPasswordMatching) {
      return { success: true };
    }
    return { success: false, error: 'Invalid authentication information.' };
  }

  public getCookieWithJwtToken(userId: any) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRATION_TIME,
      secret: process.env.JWT_SECRET,
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
