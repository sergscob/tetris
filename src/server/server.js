import http from 'http'
import path from 'path'
import express from 'express'
import { Server } from 'socket.io'
import debug from 'debug'
import RoomManager from './RoomManager'
import ScoreStore from './ScoreStore'
import { computeSpectrum } from '../game-logic/spectrum'

const loginfo = debug('tetris:info')

const buildRoomState = game => ({
  room: game.room,
  status: game.status,
  hostId: game.hostId,
  winnerId: game.winnerId,
  players: [...game.players.values()].map(player => player.toJSON()),
});

const buildOpponents = (game, selfId) => [...game.players.values()]
  .filter(player => player.id !== selfId)
  .map(player => ({
    id: player.id,
    name: player.name,
    alive: player.alive,
    score: player.score,
    spectrum: computeSpectrum(player.board),
  }));

const buildTickPayload = (game, player, playerId) => {
  return {
    board: player.board,
    piece: player.piece ? player.piece.toJSON() : null,
    hidePiece: game.invisible,
    showGhost: game.showGhost,
    next: player.alive ? game.getPieceTypeAt(player.pieceIndex) : null,
    score: player.score,
    alive: player.alive,
    opponents: buildOpponents(game, playerId),
  }
}

const emitPlayerUpdate = (io, game, playerId) => {
  const player = game.players.get(playerId)
  if (!player) 
    return

  io.to(playerId).emit('game:tick', buildTickPayload(game, player, playerId))
}

const subscribeGame = (io, room, game, scoreStore) => {
  game.on('state', () => {
    io.to(room).emit('room:state', buildRoomState(game));
  });

  game.on('started', () => {
    io.to(room).emit('game:started');
  });

  game.on('tick', () => {
    game.players.forEach((player, playerId) => {
      io.to(playerId).emit('game:tick', buildTickPayload(game, player, playerId));
    });
  });

  game.on('gameover', ({ winnerId }) => {
    game.players.forEach(player => scoreStore.record(player.name, player.score));
    io.to(room).emit('game:over', { winnerId });
    io.to(room).emit('leaderboard:top', scoreStore.top());
  });
};

const emitError = (socket, error) => {
  console.error(error);
  socket.emit('error', { message: error.message });
};

export const createServer = (params, options = {}) => new Promise(resolve => {
  const scoreStore = options.scoreStore || new ScoreStore()
  const app = express()
  const buildDir = path.join(__dirname, '..', '..', 'build')
  app.use(express.static(buildDir));
  app.get('*', (req, res) => res.sendFile(path.join(buildDir, 'index.html')))


  const httpServer = http.createServer(app)
  const io = new Server(httpServer)
  const roomManager = new RoomManager()

  io.on('connection', socket => {
    loginfo(`Socket connected ${socket.id}`)
    let currentRoom = null

    socket.on('room:join', ({ room, playerName, mode }) => {
      try {
        const { game, isNewGame } = roomManager.join(room, socket.id, playerName, mode)
        if (isNewGame) 
          subscribeGame(io, room, game, scoreStore);

        currentRoom = room
        socket.join(room)
        io.to(room).emit('room:state', buildRoomState(game))
        socket.emit('leaderboard:top', scoreStore.top())
      } catch (error) {
        emitError(socket, error)
      }
    })

    socket.on('game:start', ({ mode } = {}) => {
      const game = currentRoom && roomManager.getGame(currentRoom)
      if (!game) 
        return
      try {
        game.start(socket.id, mode)
      } catch (error) {
        emitError(socket, error)
      }
    })

    socket.on('input:move', ({ dir }) => {
      const game = currentRoom && roomManager.getGame(currentRoom)
      if (!game) 
        return
      game.move(socket.id, dir)
      emitPlayerUpdate(io, game, socket.id)
    });

    socket.on('input:rotate', () => {
      const game = currentRoom && roomManager.getGame(currentRoom);
      if (!game) 
        return
      game.rotate(socket.id)
      emitPlayerUpdate(io, game, socket.id)
    });

    socket.on('input:softDrop', () => {
      const game = currentRoom && roomManager.getGame(currentRoom);
      if (!game) return;
      game.softDrop(socket.id);
      emitPlayerUpdate(io, game, socket.id);
    });

    socket.on('input:hardDrop', () => {
      const game = currentRoom && roomManager.getGame(currentRoom);
      if (!game) return;
      game.hardDrop(socket.id);
      game.players.forEach((_player, playerId) => emitPlayerUpdate(io, game, playerId));
    });

    socket.on('disconnect', () => {
      loginfo(`Socket disconnected: ${socket.id}`);
      if (currentRoom) 
        roomManager.leave(currentRoom, socket.id)
    });
  });

  httpServer.listen({ host: params.host, port: params.port }, () => {
    const stop = cb => {
      io.close();
      httpServer.close(() => { cb && cb() })
    }

    const { port } = httpServer.address();
    loginfo(`listen on ${params.host}:${port}`);
    resolve({ port, stop, io, roomManager });
  });
});
