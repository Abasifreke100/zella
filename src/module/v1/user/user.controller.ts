import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  LOGGED_OUT,
  PIN_CREATED,
  PIN_UPDATED,
  REFERRAL_COUNT,
  REFERRAL_FETCH,
  USER_FETCH,
} from '../../../common/constants/user.constants';
import { ResponseMessage } from '../../../common/decorator/response.decorator';
import { CreatePinDto, UpdatePinDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ResponseMessage(USER_FETCH)
  @Get('me')
  async findCurrentUser(@Request() req) {
    const user = req.user;
    return user;
  }

  @ResponseMessage(LOGGED_OUT)
  @Post('logout')
  async logout(@Req() req) {
    await this.userService.logout(req.user.id);
    return null;
  }

  @ResponseMessage(PIN_CREATED)
  @Patch('create/pin')
  async createPin(@Body() requestData: CreatePinDto, @Request() req) {
    const { pin } = requestData;

    const user = req.user;
    if (user.hasPin === true) {
      throw new BadRequestException('You already have a transaction pin');
    }
    await this.userService.createPin(pin, user);

    return;
  }

  @ResponseMessage(PIN_UPDATED)
  @Patch('update/pin')
  async changePin(@Body() requestData: UpdatePinDto, @Req() req) {
    await this.userService.changePin(requestData, req.user);
    return null;
  }

  @ResponseMessage(REFERRAL_FETCH)
  @Get('referrals')
  async getUserReferral(@Req() req, @Query() queryData) {
    const referralCode = req.user.referralCode;

    return await this.userService.listReferredUsers(referralCode, queryData);
  }

  @ResponseMessage(REFERRAL_COUNT)
  @Get('referrals/count')
  async countUserReferral(@Req() req) {
    const referralCode = req.user.referralCode;

    return await this.userService.countUserReferral(referralCode);
  }
}
