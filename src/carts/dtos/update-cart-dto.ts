import { IsNotEmpty } from 'class-validator';

export class UpdateCartInputDto {
  @IsNotEmpty()
  quantity: number;
}
