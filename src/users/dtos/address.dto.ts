import { CoreOutput } from 'src/common/dtos/output.dto';
import { Address } from '../entities/user-address.entity';

export class AddressOutputDto extends CoreOutput {
  address?: Address;
}
