import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { GameController } from './game/game.controller';

@Module({
  imports: [CommonModule],
  controllers: [GameController],
})
export class ApiModule {}
