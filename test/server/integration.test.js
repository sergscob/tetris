import { expect } from 'chai';
import io from 'socket.io-client';
import { startServer } from '../helpers/server';

describe('server integration (socket.io)', function suite() {
  this.timeout(5000);

  let handle;
  let url;

  beforeEach(async () => {
    handle = await startServer();
    url = `http://127.0.0.1:${handle.port}`;
  });

  afterEach((done) => handle.stop(done));

  const connect = () => io(url, { reconnection: false, forceNew: true });

  it('assigns host to the first joiner and broadcasts room:state', (done) => {
    const socket = connect();
    socket.on('connect', () => {
      socket.emit('room:join', { room: 'r1', playerName: 'alice' });
    });
    socket.on('room:state', (state) => {
      expect(state.players).to.have.lengthOf(1);
      expect(state.hostId).to.equal(socket.id);
      socket.close();
      done();
    });
  });

  // it('rejects a non-host game:start with an error event', (done) => {
  //   const hostSocket = connect();
  //   const guestSocket = connect();
  //   let hostReady = false;
  //   let guestReady = false;

  //   const maybeStart = () => {
  //     if (hostReady && guestReady) guestSocket.emit('game:start');
  //   };

  //   hostSocket.on('connect', () => hostSocket.emit('room:join', { room: 'r2', playerName: 'alice' }));
  //   guestSocket.on('connect', () => guestSocket.emit('room:join', { room: 'r2', playerName: 'bob' }));

  //   hostSocket.on('room:state', (state) => {
  //     if (state.players.length === 2) {
  //       hostReady = true;
  //       maybeStart();
  //     }
  //   });
  //   guestSocket.on('room:state', (state) => {
  //     if (state.players.length === 2) {
  //       guestReady = true;
  //       maybeStart();
  //     }
  //   });

  //   guestSocket.on('error', (payload) => {
  //     expect(payload.message).to.match(/host/i);
  //     hostSocket.close();
  //     guestSocket.close();
  //     done();
  //   });
  // });

  // it('starts the game and streams a per-player game:tick with a full board', (done) => {
  //   const hostSocket = connect();
  //   const guestSocket = connect();
  //   let checks = 0;
  //   const finish = () => {
  //     checks += 1;
  //     if (checks === 2) {
  //       hostSocket.close();
  //       guestSocket.close();
  //       done();
  //     }
  //   };

  //   hostSocket.on('connect', () => hostSocket.emit('room:join', {
  //     room: 'r3', playerName: 'alice', mode: { gravityMultiplier: 20 },
  //   }));
  //   guestSocket.on('connect', () => guestSocket.emit('room:join', { room: 'r3', playerName: 'bob' }));

  //   hostSocket.on('room:state', (state) => {
  //     if (state.players.length === 2) hostSocket.emit('game:start');
  //   });

  //   hostSocket.on('game:tick', (payload) => {
  //     expect(payload.board).to.have.lengthOf(20);
  //     expect(payload.board[0]).to.have.lengthOf(10);
  //     finish();
  //   });

  //   guestSocket.on('game:tick', (payload) => {
  //     expect(payload.opponents).to.have.lengthOf(1);
  //     expect(payload.opponents[0].name).to.equal('alice');
  //     expect(payload.opponents[0].spectrum).to.have.lengthOf(10);
  //     finish();
  //   });
  // });

  it('persists and rebroadcasts scores once a round ends', (done) => {
    const socket = connect();
    let started = false;

    socket.on('connect', () => socket.emit('room:join', { room: 'r6', playerName: 'alice' }));
    socket.on('room:state', () => {
      if (!started) {
        started = true;
        socket.emit('game:start');
      }
    });
    socket.on('game:started', () => {
      const game = handle.roomManager.getGame('r6');
      const player = game.players.get(socket.id);
      player.score = 777;
      game.killPlayer(player);
    });
    socket.on('leaderboard:top', (entries) => {
      if (entries.length > 0) {
        expect(entries[0]).to.include({ name: 'alice', score: 777 });
        socket.close();
        done();
      }
    });
  });

  it('cleans up the room once every player disconnects', (done) => {
    const socket = connect();
    socket.on('connect', () => socket.emit('room:join', { room: 'r5', playerName: 'alice' }));
    socket.on('room:state', () => {
      socket.close();
      setTimeout(() => {
        expect(handle.roomManager.getGame('r5')).to.equal(undefined);
        done();
      }, 50);
    });
  });
});
