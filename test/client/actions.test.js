import { expect } from 'chai';
import {
  joinRoom, startGame, roomStateReceived, socketErrorReceived, JOIN_ROOM, START_GAME,
} from '../../src/client/actions/room';
import {
  move, rotate, softDrop, hardDrop, gameStarted, gameTick, gameOver,
} from '../../src/client/actions/game';

describe('client/actions', () => {
  it('room actions build plain action objects', () => {
    expect(joinRoom('r1', 'alice', { invisible: true })).to.deep.equal({
      type: JOIN_ROOM, room: 'r1', playerName: 'alice', mode: { invisible: true },
    });
    expect(startGame({ invisible: true })).to.deep.equal({
      type: START_GAME, mode: { invisible: true },
    });
    expect(roomStateReceived({ status: 'waiting' })).to.deep.equal({
      type: 'room/state', payload: { status: 'waiting' },
    });
    expect(socketErrorReceived('boom')).to.deep.equal({ type: 'room/error', message: 'boom' });
  });

  it('game input actions carry their type and (when relevant) direction', () => {
    expect(move('left')).to.deep.equal({ type: 'game/move', dir: 'left' });
    expect(rotate()).to.deep.equal({ type: 'game/rotate' });
    expect(softDrop()).to.deep.equal({ type: 'game/softDrop' });
    expect(hardDrop()).to.deep.equal({ type: 'game/hardDrop' });
  });

  it('game server-originated actions build plain action objects', () => {
    expect(gameStarted(42)).to.deep.equal({ type: 'game/started', seed: 42 });
    expect(gameTick({ score: 1 })).to.deep.equal({ type: 'game/tick', payload: { score: 1 } });
    expect(gameOver('p1')).to.deep.equal({ type: 'game/over', winnerId: 'p1' });
  });
});
