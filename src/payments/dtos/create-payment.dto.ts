import { CoreOutput } from 'src/common/dtos/output.dto';
import { IsNotEmpty } from 'class-validator';

export class CreatePaymentInputDto {
  @IsNotEmpty()
  paymentType: string;

  @IsNotEmpty()
  expire: string;

  @IsNotEmpty()
  accountNumber: string;
}
