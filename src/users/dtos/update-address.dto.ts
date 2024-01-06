import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateAddressInputDto {
  addressLine1?: string;

  addressLine2?: string;

  city?: string;

  postalCode?: number;

  country?: string;
}
