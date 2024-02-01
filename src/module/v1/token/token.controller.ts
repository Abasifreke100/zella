import { Controller, Post, Body } from '@nestjs/common';
import { TokenService } from './token.service';
import { CreateTokenDto } from './dto/create-token.dto';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post()
  create(@Body() requestData: CreateTokenDto) {
    return this.tokenService.create(requestData);
  }
}
