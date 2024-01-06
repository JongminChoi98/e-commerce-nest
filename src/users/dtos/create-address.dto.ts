import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAddressInputDto {
  @IsNotEmpty()
  @IsString()
  addressLine1: string;

  addressLine2?: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsNumber()
  postalCode: number;

  @IsNotEmpty()
  @IsString()
  country: string;
}
