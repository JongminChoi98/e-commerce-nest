import { CoreOutput } from 'src/common/dtos/output.dto';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserInputDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  firstName: string;

  phone?: string;
}

export class CreateUserOutputDto extends CoreOutput {}
