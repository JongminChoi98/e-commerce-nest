import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payments.service';
import JwtAuthGuard from 'src/auth/guard/jwt-auth.guard';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';
import { CreatePaymentInputDto } from './dtos/create-payment.dto';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { PaymentOutputDto } from './dtos/payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  createPayment(
    @Req() { user: { id } }: RequestWithUser,
    @Body() createPaymentDto: CreatePaymentInputDto,
  ): Promise<CoreOutput> {
    return this.paymentService.createUserPayment(id, createPaymentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':pid(\\d+)')
  deletePayment(
    @Param('pid') paymentId: number,
    @Req() { user: { id } }: RequestWithUser,
  ): Promise<CoreOutput> {
    return this.paymentService.deleteUserPayment(id, paymentId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':pid(\\d+)')
  getPayment(
    @Param('pid') paymentId: number,
    @Req() { user: { id } }: RequestWithUser,
  ): Promise<PaymentOutputDto> {
    return this.paymentService.getUserPayment(id, paymentId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  getPayments(@Req() { user: { id } }: RequestWithUser) {
    return this.paymentService.getUserPayments(id);
  }
}
