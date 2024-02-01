import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Badge } from './entity/badge.entity';
import { BadgeController } from './badge.controller';
import { BadgeService } from './badge.service';

@Module({
  imports: [TypeOrmModule.forFeature([Badge])],
  providers: [BadgeService],
  controllers: [BadgeController],
  exports: [BadgeService],
})
export class BadgeModule {}
