import { Body, Controller, Post, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ResponseMessage } from '../../../common/decorator/response.decorator';
import { MAKE_PAYMENT } from '../../../common/constants/payment.constant';
import { CreatePaymentDto } from './dto/payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ResponseMessage(MAKE_PAYMENT)
  @Post()
  async makeDeposit(@Req() req, @Body() requestData: CreatePaymentDto) {
    return await this.paymentService.makeDeposit(req.user, requestData);
  }
}
