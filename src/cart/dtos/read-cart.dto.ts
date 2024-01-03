import { CoreOutput } from 'src/common/dtos/output.dto';
import { Cart } from '../entities/cart-product.entity';

export class ReadCartOutputDto extends CoreOutput {
  carts?: Cart[];
}
