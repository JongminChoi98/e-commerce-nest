import { IsNotEmpty } from 'class-validator';

export class AddCartInputDto {
  userId?: number;

  @IsNotEmpty()
  productId: number;
}
