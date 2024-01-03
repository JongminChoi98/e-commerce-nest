import { CoreOutput } from 'src/common/dtos/output.dto';
import { IsNotEmpty } from 'class-validator';

export class AddCartInputDto {
  userId?: number;

  @IsNotEmpty()
  productId: number;
}

export class AddCartOutputDto extends CoreOutput {}
