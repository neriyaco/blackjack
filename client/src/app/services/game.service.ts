import { Injectable } from '@angular/core';
import { Axios } from 'axios';
import { GameState, GameStatus } from 'src/types/game';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  gameId: string = '';
  state = {} as GameState;

  constructor(private readonly http: Axios) {}

  async newGame() {
    this.gameId = await this.http.post<string>('/game').then((res) => res.data);
    await this.getState();
  }

  async joinGame(playerName: string) {
    const player = await this.http.post(`/game/${this.gameId}/addPlayer`, { playerName });
    this.state.players.push(player.data);
  }

  async getState() {
    this.state = await this.http.get<GameState>(`/game/${this.gameId}`).then((res) => res.data);
    return this.state;
  }

  async startGame() {
    await this.http.post(`/game/${this.gameId}/start`);
    this.state.gameStatus = GameStatus.STARTED;
  }

  async hit() {
    await this.http.post(`/game/${this.gameId}/hit`);
    await this.getState();
  }

  async stand() {
    await this.http.post(`/game/${this.gameId}/stand`);
    await this.getState();
  }

  async split() {
    await this.http.post(`/game/${this.gameId}/split`);
    await this.getState();
  }
}
