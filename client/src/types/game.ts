import { Card } from './card';

export interface Player {
  name: string;
  hand: Card[];
  splitHand?: Card[];
  score: number;
}

export enum GameStatus {
  /**
   * The game has not started yet
   * Players can join the game
   */
  NOT_STARTED = 'not-started',
  /**
   * The game has started
   * Players can draw cards
   */
  STARTED = 'started',
  /**
   * The game has ended
   * Players can no longer draw cards
   * The dealer will draw cards until they have a score of 17 or higher
   * The winner will be determined
   */
  ENDED = 'ended',
}

export interface GameState {
  id: string;
  players: Player[];
  currentPlayerIndex: number;
  currentPlayerActions: string[];
  gameStatus: GameStatus;
  winners: Player[];
}
