import { expect } from 'chai';
import room from '../../src/client/reducers/room';
import game from '../../src/client/reducers/game';
import { joinRoom, roomStateReceived, socketErrorReceived } from '../../src/client/actions/room';
import { gameStarted, gameTick, gameOver } from '../../src/client/actions/game';


describe('client/reducers/room', () => {
  it('returns the initial state by default', () => {
    const state = room(undefined, { type: '@@INIT' })
    expect(state.status).to.equal('idle')
    expect(state.players).to.deep.equal([])

    const connected = room(undefined, { type: 'room/selfConnected', selfId: 'abc123' })
    expect(connected.selfId).to.equal('abc123')
  })


  it('records room/playerName on join and clears any previous error', () => {
    const state = room({ room: null, playerName: null, error: 'oops' }, joinRoom('r1', 'alice'));
    expect(state.room).to.equal('r1')
    expect(state.playerName).to.equal('alice')
    expect(state.error).to.equal(null)

    const merged = room(undefined, roomStateReceived({ status: 'playing', hostId: 'p1', players: [{ id: 'p1' }] }));
    expect(merged.status).to.equal('playing');
    expect(merged.hostId).to.equal('p1');
    expect(merged.players).to.deep.equal([{ id: 'p1' }]);

    const errored = room(undefined, socketErrorReceived('room already started'));
    expect(errored.error).to.equal('room already started');
  });
});


describe('client/reducers/game', () => {
  it('reset to fresh state when the game starts', () => {
    const previous = { score: 999, opponents: [{ id: 'p2' }] }
    const state = game(previous, gameStarted(7))
    expect(state.seed).to.equal(7)
    expect(state.score).to.equal(0)
    expect(state.opponents).to.deep.equal([])
  })


  it('merges game/tick payloads (board, piece, score, opponents...) into state', () => {
    const state = game(undefined, gameTick({ score: 400, board: [[null]] }))
    expect(state.score).to.equal(400)
    expect(state.board).to.deep.equal([[null]])

    const overState = game({ score: 100 }, gameOver('p1'))
    expect(overState.lastWinnerId).to.equal('p1')
    expect(overState.score).to.equal(100)
  })
})
