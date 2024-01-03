import { CoreOutput } from 'src/common/dtos/output.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateCartInputDto {
  @IsNotEmpty()
  quantity: number;
}

export class UpdateCartOutputDto extends CoreOutput {}
