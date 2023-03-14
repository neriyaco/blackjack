import { Component, Input } from '@angular/core';
import { Player } from 'src/types/game';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {
  @Input()
  player!: Player;

  ngOnInit(): void {
    if (!this.player) {
      throw new Error('Player is required');
    }
  }
}
