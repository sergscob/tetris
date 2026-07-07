import { expect } from 'chai';
import SocketMock from 'socket.io-mock';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../../src/client/reducers';
import createSocketMiddleware from '../../src/client/middleware/socketMiddleware';
import { joinRoom, startGame } from '../../src/client/actions/room';
import { move, rotate, hardDrop } from '../../src/client/actions/game';

const buildStore = () => {
  const socket = new SocketMock();
  const store = createStore(rootReducer, applyMiddleware(createSocketMiddleware(socket)));
  return { socket, store };
};

describe('client/middleware/socketMiddleware', () => {
  it('forwards room/join as a room:join socket emit', (done) => {
    const { socket, store } = buildStore();
    socket.socketClient.on('room:join', (payload) => {
      expect(payload).to.deep.equal({ room: 'r1', playerName: 'alice', mode: undefined });
      done();
    });
    store.dispatch(joinRoom('r1', 'alice'));
  });

  it('forwards room/start as a bare game:start socket emit', (done) => {
    const { socket, store } = buildStore();
    socket.socketClient.on('game:start', () => done());
    store.dispatch(startGame());
  });

  it('forwards move/rotate/hardDrop to their respective input:* events', () => {
    const { socket, store } = buildStore();
    const received = [];
    ['input:move', 'input:rotate', 'input:hardDrop'].forEach((evt) => {
      socket.socketClient.on(evt, (payload) => received.push([evt, payload]));
    });

    store.dispatch(move('left'));
    store.dispatch(rotate());
    store.dispatch(hardDrop());

    expect(received).to.deep.equal([
      ['input:move', { dir: 'left' }],
      ['input:rotate', undefined],
      ['input:hardDrop', undefined],
    ]);
  });

  // socket.io-mock's `socket.socketClient` stands in for "the server side":
  // calling .emit() on it delivers the event to our socket's .on() handlers.
  it('records our own socket id when the connection is (re)established', () => {
    const { socket, store } = buildStore();
    socket.id = 'mock-socket-id';
    socket.socketClient.emit('connect');
    expect(store.getState().room.selfId).to.equal('mock-socket-id');
  });

  it('dispatches room/state when the server emits room:state', () => {
    const { socket, store } = buildStore();
    socket.socketClient.emit('room:state', { status: 'playing', hostId: 'p1', players: [] });
    expect(store.getState().room.status).to.equal('playing');
  });

  it('dispatches game/tick and game/over from the matching server events', () => {
    const { socket, store } = buildStore();
    socket.socketClient.emit('game:tick', { score: 250 });
    expect(store.getState().game.score).to.equal(250);

    socket.socketClient.emit('game:over', { winnerId: 'p9' });
    expect(store.getState().game.lastWinnerId).to.equal('p9');
  });

  it('dispatches room/error from the server error event', () => {
    const { socket, store } = buildStore();
    socket.socketClient.emit('error', { message: 'nope' });
    expect(store.getState().room.error).to.equal('nope');
  });

  it('dispatches the leaderboard when the server broadcasts leaderboard:top', () => {
    const { socket, store } = buildStore();
    const entries = [{ name: 'alice', score: 900, date: '2026-01-01' }];
    socket.socketClient.emit('leaderboard:top', entries);
    expect(store.getState().leaderboard).to.deep.equal(entries);
  });

  it('does not forward unrelated action types to the socket', () => {
    const { socket, store } = buildStore();
    const received = [];
    ['room:join', 'game:start', 'input:move', 'input:rotate', 'input:softDrop', 'input:hardDrop'].forEach(
      (evt) => socket.socketClient.on(evt, () => received.push(evt)),
    );
    store.dispatch({ type: 'some/unrelated/action' });
    expect(received).to.deep.equal([]);
  });
});
