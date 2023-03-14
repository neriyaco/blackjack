import { Card } from './types/card';

export const cardImage = (card: Card) => {
    if (card.isFacedDown) {
        return 'assets/images/cards/back_black.svg';
    }
    return `assets/images/cards/${snakeCase(card.name)}.svg`;
}

export const snakeCase = (str: string) => {
    return str.replace(/\s+/g, '_').toLowerCase();
}