import {
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { BlackJackGame } from './classes/game';
import { GameError } from './classes/error';

@Injectable()
export class GameService {
  private static games = new Map<string, BlackJackGame>();

  createGame() {
    const game = new BlackJackGame();
    GameService.games.set(game.id, game);
    return game.id;
  }

  startGame(id: string) {
    const game = GameService.games.get(id);
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    game.start();
  }

  addPlayer(gameId: string, playerName: string) {
    const game = GameService.games.get(gameId);
    try {
      return game.addPlayer(playerName);
    } catch (e) {
      if (e instanceof GameError) {
        throw new BadRequestException(e.message);
      }
      throw e;
    }
  }

  hit(gameId: string) {
    const game = GameService.games.get(gameId);
    try {
      return game.hit();
    } catch (e) {
      if (e instanceof GameError) {
        throw new BadRequestException(e.message);
      }
      throw e;
    }
  }

  stand(gameId: string) {
    const game = GameService.games.get(gameId);
    return game.stand();
  }

  split(gameId: string) {
    const game = GameService.games.get(gameId);
    return game.split();
  }

  state(gameId: string) {
    const game = GameService.games.get(gameId);
    return game.state();
  }

  actions(gameId: string) {
    const game = GameService.games.get(gameId);
    return game.actions();
  }
}
