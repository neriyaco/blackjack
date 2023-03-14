export const enum CardSymbol {
  Spade = '♠',
  Heart = '♥',
  Diamond = '♦',
  Club = '♣',
  Joker = '🃏',
}

export interface Card {
  symbol: CardSymbol;
  value: number;
  color: string;
  name: string;
  isFacedDown: boolean;
}
