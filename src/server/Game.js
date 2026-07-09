import { EventEmitter } from 'events';
import { canPlacePiece, mergePieceIntoBoard, clearFullLines, addPenaltyLines, isBoardOverflowing} from '../game-logic/board'
import { canMove } from '../game-logic/collision';
import { generatePieceSequence, createSeed } from '../game-logic/rng';
import { RoomStateError } from '../game-logic/errors';
import Player from './Player';
import Piece from './Piece';

const SCORE_TABLE = { 1: 100, 2: 300, 3: 500, 4: 800 };

const PIECE_TO_GENERATE = 50;
const DEFAULT_TICK_MS = 800;
const MAX_PAYERS = 5;

class Game extends EventEmitter {
  constructor(room, options = {}) {
    super();
    this.room = room;
    this.players = new Map();
    this.hostId = null;
    this.status = 'waiting';
    this.seed = null;
    this.winnerId = null;
    this.pieceCache = [];
    this.timer = null
    this.invisible = Boolean(options.invisible)
    this.gravityMultiplier = options.gravityMultiplier || 1
    this.showGhost = Boolean(options.showGhost)
    this.acceleration = Boolean(options.acceleration)
    this.tickCount = 0;
    // for tests
    this.forcedSeed = options.seed;
  }

  addPlayer(id, name) {
    if (this.players.size >= MAX_PAYERS) 
      throw new RoomStateError(`Room "${this.room}" is full, cannot join`);
    
    if (this.status !== 'waiting') 
      throw new RoomStateError(`Room "${this.room}" already started, cannot join until next round`)
    
    const player = new Player(id, name);
    if (this.players.size === 0) {
      player.isHost = true
      this.hostId = id
    }
    this.players.set(id, player)
    this.emit('state')
    return player
  }

  removePlayer(id) {
    if (!this.players.has(id)) 
      return
    const wasHost = this.hostId === id
    this.players.delete(id)

    if (this.players.size === 0) {
      this.stop()
      return
    }

    if (wasHost) {
      const [nextHostId, nextHost] = this.players.entries().next().value
      nextHost.isHost = true
      this.hostId = nextHostId
    }

    if (this.status === 'playing') 
      this.checkWinCondition()
    this.emit('state')
  }

  start(requesterId, modeOverrides = {}) {
    if (requesterId !== this.hostId) {
      throw new RoomStateError('Only the host can start the game')
    }
    if (this.status !== 'waiting') {
      throw new RoomStateError(`Room "${this.room}" already started`)
    }
    
    this.invisible = modeOverrides.invisible ?? this.invisible,
    this.showGhost = modeOverrides.showGhost ?? this.showGhost,
    this.gravityMultiplier = modeOverrides.gravityMultiplier || this.gravityMultiplier
    this.acceleration = modeOverrides.acceleration ?? this.acceleration
    this.seed = this.forcedSeed !== undefined ? this.forcedSeed : createSeed()
    this.pieceCache = generatePieceSequence(this.seed, PIECE_TO_GENERATE)
    this.status = 'playing'
    this.winnerId = null
    this.players.forEach((player) => {
      player.reset();
      this.giveNextPiece(player)
    })
    
    const intervalMs = DEFAULT_TICK_MS / this.gravityMultiplier
    this.timer = setInterval(() => this.tick(), intervalMs)
    this.emit('started', { seed: this.seed })
    this.emit('state')
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  getPieceTypeAt(index) {
    if (index >= this.pieceCache.length) 
      this.pieceCache = generatePieceSequence(this.seed, index + PIECE_TO_GENERATE);
    
    return this.pieceCache[index];
  }

  giveNextPiece(player) {
    const type = this.getPieceTypeAt(player.pieceIndex);
    player.pieceIndex += 1
    const piece = new Piece(type)
    if (!canPlacePiece(player.board, piece.state)) {
      this.killPlayer(player);
      return
    }
    player.piece = piece
    player.wasResting = false
  }

  killPlayer(player) {
    player.alive = false
    player.piece = null
    this.checkWinCondition();
  }

  checkWinCondition() {
    if (this.status !== 'playing') 
      return

    const alive = [...this.players.values()].filter(player => player.alive)

    if (this.players.size > 1 && alive.length <= 1) 
      this.endGame(alive[0] ? alive[0].id : null);
    else if (this.players.size === 1 && alive.length === 0) 
      this.endGame(null);
    
  }

  endGame(winnerId) {
    if (this.timer) 
      clearInterval(this.timer);
    this.status = 'waiting';
    this.winnerId = winnerId;
    this.stop();
    this.emit('gameover', { winnerId });
    this.emit('state');
  }

  lockPieceSurTerre(player) {
    player.board = mergePieceIntoBoard(player.board, player.piece.state)
    const { board, linesCleared } = clearFullLines(player.board)
    player.board = board
    player.piece = null

    if (linesCleared > 0) {
      player.score += SCORE_TABLE[linesCleared] || linesCleared * 100;
      this.distributePenalty(player.id, linesCleared - 1);
    }

    if (player.alive) 
      this.giveNextPiece(player)
  }

  distributePenalty(fromId, count) {
    if (count <= 0) 
      return

    this.players.forEach((player) => {
      if (player.id === fromId || !player.alive) 
        return
      player.board = addPenaltyLines(player.board, count)
      if (isBoardOverflowing(player.board)) 
        this.killPlayer(player)
    })
  }

  withActivePlayer(playerId, fn) {
    const player = this.players.get(playerId)
    if (!player || !player.alive || !player.piece || this.status !== 'playing') 
      return
    fn(player)
  }

  refreshRestingState(player) {
    player.wasResting = !canMove(player.board, player.piece.state, 0, 1)
  }

  move(playerId, dir) {
    this.withActivePlayer(playerId, player => {
      const dx = dir === 'left' ? -1 : 1
      player.piece.move(player.board, dx, 0)
      this.refreshRestingState(player)
    })
  }

  rotate(playerId) {
    this.withActivePlayer(playerId, player => {
      player.piece.rotate(player.board)
      this.refreshRestingState(player)
    })
  }

  softDrop(playerId) {
    this.withActivePlayer(playerId, player => {
      if (canMove(player.board, player.piece.state, 0, 1)) {
        player.piece.move(player.board, 0, 1)
        player.wasResting = false
      }
    })
  }

  hardDrop(playerId) {
    this.withActivePlayer(playerId, player => {
      player.piece.hardDrop(player.board)
      this.lockPieceSurTerre(player)
    })
  }

  tick() {
    this.tickCount++;
    this.players.forEach(player => {
      if (!player.alive || !player.piece) 
        return

      if (canMove(player.board, player.piece.state, 0, 1)) {
        player.piece.move(player.board, 0, 1)
        player.wasResting = false
      } else if (!player.wasResting) 
        player.wasResting = true;
      else 
        this.lockPieceSurTerre(player)
    
      if (this.acceleration && this.tickCount % 10 === 0) {
        this.gravityMultiplier *= 1.05;
        const intervalMs = DEFAULT_TICK_MS / this.gravityMultiplier;
        if (this.timer) 
          clearInterval(this.timer);
        this.timer = setInterval(() => this.tick(), intervalMs);
      }        

    });
    this.emit('tick');
  }
}

export default Game;
