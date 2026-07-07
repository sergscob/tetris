import { createBoard } from '../game-logic/board';

class Player {
  constructor(id, name) {
    this.id = id
    this.name = name
    this.isHost = false
    this.reset()
  }

  reset() {
    this.board = createBoard()
    this.piece = null
    this.pieceIndex = 0
    this.score = 0
    this.alive = true
    this.wasResting = false
  }

  toJSON() {
    const {id, name, isHost, alive, score } = this
    return {id, name, isHost, alive, score }
  }
}

export default Player;
