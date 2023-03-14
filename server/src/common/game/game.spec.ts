import { Test, TestingModule } from '@nestjs/testing';
import { Game } from './game';

describe('Game', () => {
  let provider: Game;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Game],
    }).compile();

    provider = module.get<Game>(Game);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
