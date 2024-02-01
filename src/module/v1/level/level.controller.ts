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
import { ResponseMessage } from '../../../common/decorator/response.decorator';
import { Public } from '../../../common/decorator/public.decorator';
import {
  LEVEL_CREATED,
  LEVEL_DELETED,
  LEVEL_FETCH,
  LEVEL_SEEDER,
  LEVEL_UPDATED,
} from '../../../common/constants/level.constant';
import { LevelDto } from './dto/level.dto';
import { LevelService } from './level.service';
@Controller('level')
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @ResponseMessage(LEVEL_SEEDER)
  @Public()
  @Post('/seeder')
  async levelSeeder() {
    return await this.levelService.levelSeeder();
  }

  @ResponseMessage(LEVEL_CREATED)
  @Post()
  async create(@Body() requestData: LevelDto) {
    return await this.levelService.create(requestData);
  }

  @ResponseMessage(LEVEL_FETCH)
  @Public()
  @Get()
  async paginate(@Query() queryData) {
    return await this.levelService.paginate(queryData);
  }

  @ResponseMessage(LEVEL_UPDATED)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() requestData: LevelDto) {
    return await this.levelService.update(id, requestData);
  }

  @ResponseMessage(LEVEL_DELETED)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.levelService.delete(id);
  }
}
