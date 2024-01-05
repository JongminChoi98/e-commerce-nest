import { CoreOutput } from 'src/common/dtos/output.dto';
import { Payment } from '../entities/payment.entity';

export class PaymentOutputDto extends CoreOutput {
  payment?: Payment;
}

export class PaymentsOutputDto extends CoreOutput {
  payment?: Payment[];
}
