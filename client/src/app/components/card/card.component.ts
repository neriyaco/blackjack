import { Component, Input } from '@angular/core';
import { Card } from 'src/types/card';
import { cardImage } from 'src/utilities';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  constructor() {}

  @Input()
  card!: Card;

  cardImage: string = '';

  ngOnInit(): void {
    if (!this.card) {
      throw new Error('Card is required');
    }

    this.cardImage = cardImage(this.card);
  }

}
