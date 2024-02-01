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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/role.dto';
import {
  ROLE_CREATED,
  ROLE_DELETED,
  ROLE_FETCH,
  ROLE_SEEDER,
  ROLE_UPDATED,
} from '../../../common/constants/role.constant';
import { Public } from '../../../common/decorator/public.decorator';
import { ResponseMessage } from '../../../common/decorator/response.decorator';

@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Public()
  @ResponseMessage(ROLE_FETCH)
  @Get()
  async paginate(@Query() queryData) {
    return await this.roleService.paginate(queryData);
  }

  @Public()
  @ResponseMessage(ROLE_SEEDER)
  @Post('seeder')
  async roleSeeder() {
    return await this.roleService.roleSeeder();
  }

  @ResponseMessage(ROLE_CREATED)
  @Post()
  async create(@Body() requestData: CreateRoleDto) {
    return await this.roleService.create(requestData);
  }

  @ResponseMessage(ROLE_UPDATED)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() requestData: CreateRoleDto) {
    return await this.roleService.update(id, requestData);
  }

  @ResponseMessage(ROLE_DELETED)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.roleService.delete(id);
  }
}
