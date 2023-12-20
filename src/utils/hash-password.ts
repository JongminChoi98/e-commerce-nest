import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export function hashPassword(password: string): Promise<string> {
  try {
    return bcrypt.hash(password, 10);
  } catch (error) {
    throw new InternalServerErrorException();
  }
}
