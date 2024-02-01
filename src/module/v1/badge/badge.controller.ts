import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BadgeService } from './badge.service';
import { ResponseMessage } from '../../../common/decorator/response.decorator';
import { Public } from '../../../common/decorator/public.decorator';
import {
  BADGE_CREATED,
  BADGE_DELETED,
  BADGE_FETCH,
  BADGE_SEEDER,
  BADGE_UPDATED,
} from '../../../common/constants/badge.constant';
import { BadgeDto } from './dto/badge.dto';
@Controller('badge')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @ResponseMessage(BADGE_SEEDER)
  @Public()
  @Post('/seeder')
  async badgeSeeder() {
    return await this.badgeService.badgeSeeder();
  }

  @ResponseMessage(BADGE_CREATED)
  @Post()
  async create(@Body() requestData: BadgeDto) {
    return await this.badgeService.create(requestData);
  }

  @ResponseMessage(BADGE_FETCH)
  @Public()
  @Get()
  async paginate(@Query() queryData) {
    return await this.badgeService.paginate(queryData);
  }

  @ResponseMessage(BADGE_UPDATED)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() requestData) {
    return await this.badgeService.update(id, requestData);
  }

  @ResponseMessage(BADGE_DELETED)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.badgeService.delete(id);
  }
}
