import { Component, TemplateRef, ViewChild, isDevMode } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { GameStatus } from 'src/types/game';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  constructor(
    public readonly gameService: GameService,
    private readonly modalService: NgbModal
  ) {}

  @ViewChild('gameEndModal')
  gameEndModal!: TemplateRef<any>;

  async startGame() {
    this.close();
    await this.gameService.newGame();
    await this.gameService.joinGame('Player 1');
    await this.gameService.startGame();
    await this.gameService.getState();
  }

  async hit() {
    await this.gameService.hit();
  }

  async stand() {
    await this.gameService.stand();
    if (this.gameService.state.gameStatus === GameStatus.ENDED) {
      this.open(this.gameEndModal);
    }
  }

  async split() {
    await this.gameService.split();
  }

  async action(action: string) {
    switch (action) {
      case 'hit':
        await this.hit();
        break;
      case 'stand':
        await this.stand();
        break;
      case 'split':
        await this.split();
        break;
    }
  }

  open(content: any) {
    // no backdrop
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      backdrop: 'static',
    });
  }

  close() {
    this.modalService.dismissAll();
  }

  get actions() {
    return this.gameService.state.currentPlayerActions;
  }

  get dealer() {
    return this.gameService.state.players.at(-1)!;
  }

  get players() {
    return this.gameService.state.players.slice(0, -1);
  }

  get gameStatus() {
    return this.gameService.state.gameStatus;
  }

  get winners() {
    return this.gameService.state.winners;
  }

  GameStatus = GameStatus;
}
