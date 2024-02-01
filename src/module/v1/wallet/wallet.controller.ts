import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ResponseMessage } from '../../../common/decorator/response.decorator';
import {
  WALLET_CREATED,
  WALLET_FETCH,
} from '../../../common/constants/wallet.constant';
import { WalletDto } from './dto/wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @ResponseMessage(WALLET_CREATED)
  @Post()
  async createWallet(@Body() requestData: WalletDto, @Req() req) {
    return await this.walletService.createWallet(requestData, req.user);
  }

  @ResponseMessage(WALLET_FETCH)
  @Get()
  async paginate(@Query() query, @Req() req) {
    return await this.walletService.paginate(query, req.user);
  }
}
