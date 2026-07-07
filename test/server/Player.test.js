import { expect } from 'chai';
import Player from '../../src/server/Player';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../../src/game-logic/board';

describe('server/Player', () => {
  it('starts alive, with an empty board and no piece', () => {
    const player = new Player('id1', 'alice');
    expect(player.alive).to.equal(true);
    expect(player.isHost).to.equal(false);
    expect(player.piece).to.equal(null);
    expect(player.board).to.have.lengthOf(BOARD_HEIGHT);
    expect(player.board[0]).to.have.lengthOf(BOARD_WIDTH);
  });

  it('reset clears score, piece progress and revives the player', () => {
    const player = new Player('id1', 'alice');
    player.score = 500;
    player.pieceIndex = 12;
    player.alive = false;
    player.reset();
    expect(player.score).to.equal(0);
    expect(player.pieceIndex).to.equal(0);
    expect(player.alive).to.equal(true);
  });

  it('toJSON exposes only public fields, not the board', () => {
    const player = new Player('id1', 'alice');
    const json = player.toJSON();
    expect(json).to.deep.equal({
      id: 'id1', name: 'alice', isHost: false, alive: true, score: 0,
    });
  });
});
