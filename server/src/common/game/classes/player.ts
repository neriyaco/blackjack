import { GameCard } from './card';
import { handScore } from './utils';

export class GamePlayer {
  readonly hand: GameCard[] = [];
  splitHand?: GameCard[];

  constructor(public readonly name: string) {}

  get score() {
    const score = handScore(this.hand);
    if (this.splitHand) {
      const splitScore = handScore(this.splitHand);
      return score > splitScore ? score : splitScore;
    }
    return score;
  }

  toJSON() {
    return {
      name: this.name,
      hand: this.hand,
      splitHand: this.splitHand,
      score: this.score,
    };
  }
}
