import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { GameService } from 'src/common/game/game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  createGame() {
    return this.gameService.createGame();
  }

  @Post(':id/addPlayer')
  addPlayer(@Param('id') id: string, @Body('playerName') playerName: string) {
    return this.gameService.addPlayer(id, playerName);
  }

  @Post(':id/start')
  startGame(@Param('id') id: string) {
    return this.gameService.startGame(id);
  }

  @Post(':id/hit')
  hit(@Param('id') id: string) {
    return this.gameService.hit(id);
  }

  @Post(':id/stand')
  stand(@Param('id') id: string) {
    return this.gameService.stand(id);
  }

  @Post(':id/split')
  split(@Param('id') id: string) {
    return this.gameService.split(id);
  }

  @Get(':id')
  state(@Param('id') id: string) {
    return this.gameService.state(id);
  }

  @Get(':id/actions')
  actions(@Param('id') id: string) {
    return this.gameService.actions(id);
  }
}
