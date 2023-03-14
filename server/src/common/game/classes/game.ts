import { customAlphabet } from 'nanoid';
import { GameDeck } from './deck';
import { GamePlayer } from './player';
import { GameError } from './error';

const nanoid = customAlphabet(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  10,
);

export const enum GameState {
  /**
   * The game has not started yet
   * Players can join the game
   */
  NOT_STARTED = 'not-started',
  /**
   * The game has started
   * Players can draw cards
   */
  STARTED = 'started',
  /**
   * The game has ended
   * Players can no longer draw cards
   * The dealer will draw cards until they have a score of 17 or higher
   * The winner will be determined
   */
  ENDED = 'ended',
}

export class BlackJackGame {
  readonly id = nanoid(12);

  /**
   * The deck of cards
   *
   * The deck is automatically restocked when it runs out of cards
   */
  deck = new GameDeck({ shuffle: true });
  /**
   * The players in the game
   *
   * The last player in the array is the dealer since they are the last to play
   */
  players: GamePlayer[] = [];
  /**
   * The dealer
   */
  readonly dealer = new GamePlayer('Dealer');
  /**
   * The current player
   */
  currentPlayer: GamePlayer;

  /**
   * The current state of the game
   */
  private _gameStatus = GameState.NOT_STARTED;
  /**
   * The index of the current player
   * This is used to determine the next player
   */
  private _currentPlayerIndex = 0;

  /**
   * Adds a player to the game
   * @param name The name of the player
   * @returns The player that was added
   */
  addPlayer(name: string) {
    this._verifyGameState(GameState.NOT_STARTED);
    // Add the player to the second to last position
    // This is so the dealer is always the last player
    const player = new GamePlayer(name);
    this.players.splice(this.players.length - 1, 0, player);
    return player;
  }

  /**
   * Start the game, stop players from joining and deal cards
   * @returns The first player
   */
  start() {
    this._verifyGameState(GameState.NOT_STARTED);
    this._gameStatus = GameState.STARTED;
    this.players.push(this.dealer);
    this.deal();
    this.currentPlayer = this.players[0];
    return this.currentPlayer;
  }

  /**
   * Deal cards to the players
   */
  deal() {
    this.players.forEach((player) => {
      const cards = this.deck.draw({ count: 2 });
      player.hand.push(...cards.splice(0, 2));
    });
    this.dealer.hand[0].facedDown = true;
  }

  /**
   * Add a card to the current player's hand
   * @returns The card that was added
   */
  hit() {
    this._verifyGameState(GameState.STARTED);
    if (this.currentPlayer.splitHand) {
      const [card] = this.deck.draw({ count: 1 });
      this.currentPlayer.splitHand.push(card);
    }
    if (this.currentPlayer.score > 21) {
      throw new GameError('You have already busted');
    }
    const [card] = this.deck.draw({ count: 1 });
    this.currentPlayer.hand.push(card);
    return card;
  }

  /**
   * End the current player's turn
   */
  stand() {
    this._verifyGameState(GameState.STARTED);
    this.currentPlayer = this.players[++this._currentPlayerIndex];
    if (this._currentPlayerIndex >= this.players.length) {
      return;
    }
    if (this.currentPlayer === this.dealer) {
      this.dealerTurn();
      this._gameStatus = GameState.ENDED;
    }
  }

  split() {
    this._verifyGameState(GameState.STARTED);
    if (this.currentPlayer.hand.length !== 2) {
      throw new GameError('You can only split if you have two cards');
    }
    if (this.currentPlayer.hand[0].value !== this.currentPlayer.hand[1].value) {
      throw new GameError(
        'You can only split if you have two cards of the same value',
      );
    }
    this.currentPlayer.splitHand = [this.currentPlayer.hand.pop()];
  }

  /**
   * Get the valid actions for the current player
   */
  actions() {
    const actions = [];
    if (this._gameStatus !== GameState.STARTED) {
      return actions;
    }
    if (this.currentPlayer.hand.length === 2) {
      if (
        this.currentPlayer.hand[0].value === this.currentPlayer.hand[1].value
      ) {
        actions.push('split');
      }
    }
    if (this.currentPlayer.score < 21) {
      actions.push('hit');
    }
    actions.push('stand');

    return actions;
  }

  /**
   * Return the current state of the game
   */
  state() {
    return {
      id: this.id,
      players: this.players.map((p) => p.toJSON()),
      currentPlayerIndex: this._currentPlayerIndex,
      currentPlayerActions: this.actions(),
      gameStatus: this._gameStatus,
      winners: this._gameStatus === GameState.ENDED ? this.getWinners() : [],
    };
  }

  dealerTurn() {
    this.dealer.hand[0].flip(false);
    // Find the highest score that is less than or equal to 21
    const highestScore = Math.max(
      ...this.players
        .slice(0, -1)
        .map((p) => p.score)
        .filter((s) => s <= 21),
    );
    // If there are no players that are not over 21, the dealer wins
    if (highestScore === -Infinity) {
      return;
    }
    // Keep hitting until the dealer has a score of 17 or higher
    // or the dealer has a score higher than the highest score of the players
    while (this.dealer.score < 17 || this.dealer.score < highestScore) {
      this.hit();
    }
  }

  /**
   * Get the winner of the game
   * @returns The winner
   */
  getWinners() {
    this._verifyGameState(GameState.ENDED);
    // Find all the players that are not over 21
    const potentialWinners = this.players.filter(
      (player) => player.score <= 21,
    );

    // If there are no winners, the dealer wins
    if (potentialWinners.length === 0) {
      return [this.dealer];
    }

    // Find the player(s) with the highest score
    const winners = potentialWinners.reduce((acc, player) => {
      if (acc.length === 0) {
        return [player];
      }
      if (player.score > acc[0].score) {
        return [player];
      }
      if (player.score === acc[0].score) {
        return [...acc, player];
      }
      return acc;
    }, [] as GamePlayer[]);

    // If there is a tie, the dealer wins
    // Since we already know the dealer is not over 21 because we filtered
    // out all the players that are over 21, we can just check if the dealer
    // has the same score as the first winner
    if (this.dealer.score === winners[0].score) {
      return [this.dealer];
    }

    return winners;
  }

  /**
   * Verify that the game has started or not, throw an error if the game is not in the correct state
   * @param state Whether the game should have started or not
   */
  private _verifyGameState(state = GameState.STARTED, throwOnFail = true) {
    if (this._gameStatus !== state) {
      if (!throwOnFail) {
        return false;
      }
      switch (state) {
        case GameState.NOT_STARTED:
          throw new GameError('The game has already started');
        case GameState.STARTED:
          throw new GameError('The game has not started yet');
        case GameState.ENDED:
          throw new GameError('The game has already ended');
      }
    }
  }
}
