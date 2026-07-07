import { expect } from 'chai';
import room from '../../src/client/reducers/room';
import game from '../../src/client/reducers/game';
import { joinRoom, roomStateReceived, socketErrorReceived } from '../../src/client/actions/room';
import { gameStarted, gameTick, gameOver } from '../../src/client/actions/game';

describe('client/reducers/room', () => {
  it('returns the initial state by default', () => {
    const state = room(undefined, { type: '@@INIT' });
    expect(state.status).to.equal('idle');
    expect(state.players).to.deep.equal([]);
  });

  it('records room/playerName on join and clears any previous error', () => {
    const state = room({ room: null, playerName: null, error: 'oops' }, joinRoom('r1', 'alice'));
    expect(state.room).to.equal('r1');
    expect(state.playerName).to.equal('alice');
    expect(state.error).to.equal(null);
  });

  it('merges server room:state payloads into state', () => {
    const state = room(undefined, roomStateReceived({ status: 'playing', hostId: 'p1', players: [{ id: 'p1' }] }));
    expect(state.status).to.equal('playing');
    expect(state.hostId).to.equal('p1');
    expect(state.players).to.deep.equal([{ id: 'p1' }]);
  });

  it('stores the last socket error message', () => {
    const state = room(undefined, socketErrorReceived('room already started'));
    expect(state.error).to.equal('room already started');
  });

  it('records our own socket id on connect', () => {
    const state = room(undefined, { type: 'room/selfConnected', selfId: 'abc123' });
    expect(state.selfId).to.equal('abc123');
  });
});

describe('client/reducers/game', () => {
  it('resets to a fresh state (keeping the seed) when the game starts', () => {
    const previous = { score: 999, opponents: [{ id: 'p2' }] };
    const state = game(previous, gameStarted(7));
    expect(state.seed).to.equal(7);
    expect(state.score).to.equal(0);
    expect(state.opponents).to.deep.equal([]);
  });

  it('merges game/tick payloads (board, piece, score, opponents...) into state', () => {
    const state = game(undefined, gameTick({ score: 400, board: [[null]] }));
    expect(state.score).to.equal(400);
    expect(state.board).to.deep.equal([[null]]);
  });

  it('records the last winner on game/over without touching the rest', () => {
    const state = game({ score: 100 }, gameOver('p1'));
    expect(state.lastWinnerId).to.equal('p1');
    expect(state.score).to.equal(100);
  });
});
