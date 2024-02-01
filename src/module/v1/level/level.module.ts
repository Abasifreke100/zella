import { Module } from '@nestjs/common';
import { LevelService } from './level.service';
import { LevelController } from './level.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Level } from './entity/level.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Level])],
  providers: [LevelService],
  controllers: [LevelController],
  exports: [LevelService],
})
export class LevelModule {}
