import { Controller, Get, Query, Req } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  FETCH_USER_TRANSACTION,
  SUM_TRANSACTION,
} from '../../../common/constants/payment.constant';
import { ResponseMessage } from '../../../common/decorator/response.decorator';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ResponseMessage(SUM_TRANSACTION)
  @Get('referral')
  async sumReferralBonusAmount(@Req() req) {
    return await this.transactionService.sumReferralBonusAmount(req.user.id);
  }

  @ResponseMessage(FETCH_USER_TRANSACTION)
  @Get()
  async paginate(@Query() queryData, @Req() req) {
    return await this.transactionService.paginate(queryData, req.user);
  }
}
