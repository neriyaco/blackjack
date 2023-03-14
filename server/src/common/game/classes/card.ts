import { titleCase } from 'src/common/utils';

/**
 * A card in a deck of cards
 * @param symbol The symbol of the card (♠, ♣, ♦, ♥, 🃏)
 * @param value The value of the card (1-13)
 *
 */
export class GameCard {
  color: string;

  readonly name: string;
  /**
   * The full name of the card
   * (Ace of ♠, Jack of ♣, etc.)
   */
  readonly fullName: string;

  constructor(
    public readonly symbol: string,
    public readonly value: number,
    public facedDown = false,
  ) {
    this.color = this.symbol === '♠' || this.symbol === '♣' ? 'black' : 'red';
    switch (value) {
      case 1:
        this.name = 'Ace';
        break;
      case 11:
        this.name = 'Jack';
        break;
      case 12:
        this.name = 'Queen';
        break;
      case 13:
        this.name = 'King';
        break;
      case 0:
        this.name = 'Joker';
        break;
      default:
        this.name = value.toString();
    }

    switch (this.symbol) {
      case '♠':
        this.fullName = titleCase(`${this.name} of Spades`);
        break;
      case '♣':
        this.fullName = titleCase(`${this.name} of Clubs`);
        break;
      case '♦':
        this.fullName = titleCase(`${this.name} of Diamonds`);
        break;
      case '♥':
        this.fullName = titleCase(`${this.name} of Hearts`);
        break;
      case '🃏':
        this.fullName = titleCase(`${this.color} ${this.name}`);
        break;
    }
  }

  /**
   * Returns true if the card is an ace,
   * this is used to determine if the card is worth 1 or 11 points
   */
  isAce() {
    return this.value === 1;
  }

  /**
   * Returns true if the card is a face card,
   * this is used to determine if the card is worth 10 points
   * (Jack, Queen, King)
   */
  isFaceCard() {
    return this.value >= 11 && this.value <= 13;
  }

  /**
   * Returns true if the card is a joker,
   */
  isJoker() {
    return this.value === 0;
  }

  /**
   * Returns true if the card is faced down
   */
  isFacedDown() {
    return this.facedDown;
  }

  /**
   * Flips the card over
   * @param facedDown
   * @returns this
   */
  flip(facedDown = !this.facedDown) {
    this.facedDown = facedDown;
    return this;
  }

  toJSON() {
    if (this.isFacedDown()) {
      return {
        symbol: null,
        value: null,
        name: null,
        color: null,
        isFacedDown: this.facedDown,
      };
    }
    return {
      symbol: this.symbol,
      value: this.value,
      name: this.fullName,
      color: this.color,
      isFacedDown: this.facedDown,
    };
  }
}
