import { GameCard } from './card';

export const handScore = (hand: GameCard[]) => {
  let score = 0;
  let aces = 0;
  for (const card of hand) {
    if (card.isFacedDown()) {
      continue;
    }
    if (card.isAce()) {
      aces++;
      continue;
    }
    if (card.isFaceCard()) {
      score += 10;
    } else {
      score += card.value;
    }
  }
  for (let i = 0; i < aces; i++) {
    // If the score + 11 + the number of aces left is greater than 21
    // then the ace is worth 1 point
    if (score + 11 + aces - i - 1 > 21) {
      score += 1;
    } else {
      score += 11;
    }
  }
  return score;
};
