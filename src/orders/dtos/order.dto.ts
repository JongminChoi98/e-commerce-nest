import { CoreOutput } from 'src/common/dtos/output.dto';
import { OrderItems } from '../entities/order.entity';

export class CreateOrderInputDto {
  productId: number;

  quantity: number;
}

export class OrderOutputDto extends CoreOutput {
  orders?: OrderItems[];
}
