import { expect } from 'chai';
import Game from '../../src/server/Game';
import Piece from '../../src/server/Piece';
import { RoomStateError } from '../../src/game-logic/errors';


const startWithoutTimer = (game, hostId, mode) => {
  game.start(hostId, mode);
  game.stop();
};

describe('server/Game', () => {

  it('make the first player the host', () => {
    const game = new Game('room1');
    game.addPlayer('p1', 'alice');
    game.addPlayer('p2', 'bob');
    expect(game.hostId).to.equal('p1');
    expect(game.players.get('p1').isHost).to.equal(true);
    expect(game.players.get('p2').isHost).to.equal(false);

    startWithoutTimer(game, 'p1');
    expect(() => game.addPlayer('p3', 'carol')).to.throw(RoomStateError);
  });

  it('next player becomes host when the host leaves', () => {
    const game = new Game('room1');
    game.addPlayer('p1', 'alice');
    game.addPlayer('p2', 'bob');
    game.removePlayer('p1');
    expect(game.hostId).to.equal('p2');
    expect(game.players.get('p2').isHost).to.equal(true);

    game.removePlayer('p2');
    expect(game.players.size).to.equal(0);
  });

  it('clearing 2 lines scores them and sends 1 penalty line to opponents', () => {
    const game = new Game('room1', { seed: 1 });
    game.addPlayer('p1', 'alice');
    game.addPlayer('p2', 'bob');
    startWithoutTimer(game, 'p1');

    const p1 = game.players.get('p1');
    const p2 = game.players.get('p2');

    p1.piece = new Piece('O', { x: 4, y: 0 });
    game.hardDrop('p1');
    expect(p1.board[18][4]).to.equal('O');
    expect(p1.board[19][4]).to.equal('O');

    for (let y = 18; y <= 19; y += 1) {
      for (let x = 0; x < 10; x += 1) {
        p1.board[y][x] = x === 4 || x === 5 ? null : 'X';
      }
    }
    p1.piece = new Piece('O', { x: 4, y: 18 });

    game.tick();
    game.tick();

    expect(p1.score).to.equal(300);
    expect(p2.board[19].every((cell) => cell === 'P')).to.equal(true);
  });

  it('move/rotate/softDrop are no-ops before the game starts or when player is dead', () => {
    const game = new Game('room1', { seed: 1 });
    game.addPlayer('p1', 'alice');
    expect(() => game.move('p1', 'left')).to.not.throw();
    expect(() => game.rotate('p1')).to.not.throw();
    expect(() => game.softDrop('p1')).to.not.throw();
    expect(() => game.hardDrop('p1')).to.not.throw();
  });


  it('allows the host to restart a new round once the previous one is over', () => {
    const game = new Game('room1', { seed: 1 });
    game.addPlayer('p1', 'alice');
    game.addPlayer('p2', 'bob');
    startWithoutTimer(game, 'p1');
    game.killPlayer(game.players.get('p2'));

    expect(() => { startWithoutTimer(game, 'p1'); }).to.not.throw();
    expect(game.status).to.equal('playing');
    expect(game.winnerId).to.equal(null);
    expect(game.players.get('p2').alive).to.equal(true);
  });

  it('kills player when board has no room for next piece', () => {
    const game = new Game('room1', { seed: 1 });
    game.addPlayer('p1', 'alice');
    startWithoutTimer(game, 'p1');
    const player = game.players.get('p1');
    player.board = player.board.map((row) => row.map(() => 'X'));

    game.giveNextPiece(player);

    expect(player.alive).to.equal(false);
    expect(player.piece).to.equal(null);
    expect(game.status).to.equal('waiting');
    expect(game.winnerId).to.equal(null);
  });
});
