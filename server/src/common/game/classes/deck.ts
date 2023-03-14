import { GameCard } from './card';

export enum DeckDepletedAction {
  ERROR = 'error',
  RESTART = 'restart',
  RESTART_SHUFFLED = 'restart-shuffled',
}

/**
 * A deck of cards
 * @param shuffle Whether to shuffle the deck
 * @param jokers Whether to include jokers
 */
export class GameDeck {
  cards: GameCard[];

  constructor({ shuffle = true, jokers = false } = {}) {
    this.cards = Array.from({ length: 52 }, (_, i) => {
      const value = (i % 13) + 1;
      const symbol = ['♠', '♣', '♦', '♥'][Math.floor(i / 13)];
      return new GameCard(symbol, value);
    });
    if (jokers) {
      const blackJoker = new GameCard('🃏', 0);
      const redJoker = new GameCard('🃏', 0);
      blackJoker.color = 'black';
      redJoker.color = 'red';
      this.cards.push(blackJoker, redJoker);
    }
    if (shuffle) {
      this.shuffle();
    }
  }

  /**
   * Shuffle the deck
   */
  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  /**
   * Draw cards from the deck
   * @param count The number of cards to draw
   * @param deckDepletedAction What to do if the deck is depleted
   * @returns The drawn cards
   */
  draw({ count = 1, deckDepletedAction = DeckDepletedAction.ERROR } = {}) {
    if (count > this.cards.length) {
      switch (deckDepletedAction) {
        case DeckDepletedAction.ERROR:
          throw new Error('Deck is empty');
        case DeckDepletedAction.RESTART:
          this.cards = this.cards.concat(new GameDeck({ shuffle: true }).cards);
          break;
        case DeckDepletedAction.RESTART_SHUFFLED:
          this.cards = this.cards.concat(new GameDeck({ shuffle: true }).cards);
          this.shuffle();
          break;
        default:
          throw new Error('Invalid deckDepletedAction');
      }
    }
    return this.cards.splice(0, count);
  }
}
