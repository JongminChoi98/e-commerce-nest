import { Module } from '@nestjs/common';
import { PaymentService } from './payments.service';
import { PaymentController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentsModule {}
