import { CoreOutput } from 'src/common/dtos/output.dto';
import { IsEmail, IsString } from 'class-validator';

export class UpdateUserInputDto {
  email?: string;

  password?: string;

  lastName?: string;

  firstName?: string;

  phone?: string;
}

export class UpdateUserOutputDto extends CoreOutput {}
