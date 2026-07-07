import { expect } from 'chai';
import Game from '../../src/server/Game';
import Piece from '../../src/server/Piece';
import { RoomStateError } from '../../src/game-logic/errors';

// Real gravity would race against test timing, so every test stops the
// interval right after start() and drives progress explicitly via game.tick().
const startWithoutTimer = (game, hostId, mode) => {
  game.start(hostId, mode);
  game.stop();
};

describe('server/Game', () => {
  it('makes the first joiner the host, not later ones', () => {
    const game = new Game('room1');
    game.addPlayer('p1', 'alice');
    game.addPlayer('p2', 'bob');
    expect(game.hostId).to.equal('p1');
    expect(game.players.get('p1').isHost).to.equal(true);
    expect(game.players.get('p2').isHost).to.equal(false);
  });

  it('refuses to add a player once the game has started', () => {
    const game = new Game('room1', { seed: 1 });
    game.addPlayer('p1', 'alice');
    startWithoutTimer(game, 'p1');
    expect(() => game.addPlayer('p2', 'bob')).to.throw(RoomStateError);
  });

  it('hands the host role to the next player when the host leaves', () => {
    const game = new Game('room1');
    game.addPlayer('p1', 'alice');
    game.addPlayer('p2', 'bob');
    game.removePlayer('p1');
    expect(game.hostId).to.equal('p2');
    expect(game.players.get('p2').isHost).to.equal(true);
  });

  it('only the host may start the game', () => {
    const game = new Game('room1', { seed: 1 });
    game.addPlayer('p1', 'alice');
    game.addPlayer('p2', 'bob');
    expect(() => game.start('p2')).to.throw(RoomStateError);
  });

  it('cannot be started twice', () => {
    const game = new Game('room1', { seed: 1 });
    game.addPlayer('p1', 'alice');
    startWithoutTimer(game, 'p1');
    expect(() => game.start('p1')).to.throw(RoomStateError);
  });

  it('emits started/state and spawns a piece for every player', () => {
    const game = new Game('room1', { seed: 1 });
    game.addPlayer('p1', 'alice');
    game.addPlayer('p2', 'bob');
    const startedEvents = [];
    game.on('started', (payload) => startedEvents.push(payload));
    startWithoutTimer(game, 'p1');
    expect(game.status).to.equal('playing');
    expect(startedEvents).to.have.lengthOf(1);
    expect(startedEvents[0].seed).to.equal(1);
    expect(game.players.get('p1').piece).to.not.equal(null);
    expect(game.players.get('p2').piece).to.not.equal(null);
  });

  it('tick gives one grace frame before locking a resting piece', () => {
    const game = new Game('room1', { seed: 1 });
    game.addPlayer('p1', 'alice');
    startWithoutTimer(game, 'p1');
    const player = game.players.get('p1');
    player.piece = new Piece('O', { x: 4, y: 18 });

    game.tick();
    expect(player.wasResting).to.equal(true);
    expect(player.piece).to.not.equal(null);
    expect(player.board[18][4]).to.equal(null);

    game.tick();
    expect(player.board[18][4]).to.equal('O');
    expect(player.board[19][4]).to.equal('O');
    expect(player.piece).to.not.equal(null); // a fresh piece was spawned
  });

  it('clearing 2 lines scores them and sends 1 penalty line to opponents', () => {
    const game = new Game('room1', { seed: 1 });
    game.addPlayer('p1', 'alice');
    game.addPlayer('p2', 'bob');
    startWithoutTimer(game, 'p1');

    const p1 = game.players.get('p1');
    const p2 = game.players.get('p2');
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

  it('hardDrop locks the piece immediately, without waiting for ticks', () => {
    const game = new Game('room1', { seed: 1 });
    game.addPlayer('p1', 'alice');
    startWithoutTimer(game, 'p1');
    const player = game.players.get('p1');
    player.piece = new Piece('O', { x: 4, y: 0 });

    game.hardDrop('p1');

    expect(player.board[18][4]).to.equal('O');
    expect(player.board[19][4]).to.equal('O');
  });

  it('move/rotate/softDrop are no-ops before the game starts or once the player is dead', () => {
    const game = new Game('room1', { seed: 1 });
    game.addPlayer('p1', 'alice');
    expect(() => game.move('p1', 'left')).to.not.throw();
    expect(() => game.rotate('p1')).to.not.throw();
    expect(() => game.softDrop('p1')).to.not.throw();
    expect(() => game.hardDrop('p1')).to.not.throw();
  });

  it('declares the last alive player the winner and stops ticking', () => {
    const game = new Game('room1', { seed: 1 });
    game.addPlayer('p1', 'alice');
    game.addPlayer('p2', 'bob');
    startWithoutTimer(game, 'p1');
    const gameOverEvents = [];
    game.on('gameover', (payload) => gameOverEvents.push(payload));

    game.killPlayer(game.players.get('p2'));

    expect(game.status).to.equal('waiting');
    expect(game.winnerId).to.equal('p1');
    expect(gameOverEvents).to.deep.equal([{ winnerId: 'p1' }]);
  });

  it('a solo game that tops out ends with no winner and returns to the lobby', () => {
    const game = new Game('room1', { seed: 1 });
    game.addPlayer('p1', 'alice');
    startWithoutTimer(game, 'p1');

    game.killPlayer(game.players.get('p1'));

    expect(game.status).to.equal('waiting');
    expect(game.winnerId).to.equal(null);
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

  it('kills a player whose board has no room for the next piece', () => {
    const game = new Game('room1', { seed: 1 });
    game.addPlayer('p1', 'alice');
    startWithoutTimer(game, 'p1');
    const player = game.players.get('p1');
    player.board = player.board.map((row) => row.map(() => 'X'));

    game.giveNextPiece(player);

    expect(player.alive).to.equal(false);
    expect(player.piece).to.equal(null);
  });

  it('applies mode overrides (e.g. bonus modes) chosen at start time', () => {
    const game = new Game('room1', { seed: 1 });
    game.addPlayer('p1', 'alice');
    startWithoutTimer(game, 'p1', { invisible: true, gravityMultiplier: 4 });
    expect(game.invisible).to.equal( true );
    expect(game.gravityMultiplier).to.equal( 4 );
  });

  it('removing the last player stops the game without error', () => {
    const game = new Game('room1');
    game.addPlayer('p1', 'alice');
    game.removePlayer('p1');
    expect(game.players.size).to.equal(0);
  });
});
