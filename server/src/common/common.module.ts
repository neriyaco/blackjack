import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';

const common = [GameModule];

@Module({
  imports: [GameModule],
  exports: common,
})
export class CommonModule {}
