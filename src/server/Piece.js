import { createPiece, getPieceCells } from '../game-logic/pieces';
import { moveIfPossible, tryRotate, hardDropPiece, isResting } from '../game-logic/collision';

class Piece {
  constructor(type, overrides = {}) {
    this.state = createPiece(type, overrides);
  }

  get type() {
    return this.state.type;
  }

  cells() {
    return getPieceCells(this.state);
  }

  move(board, dx, dy) {
    this.state = moveIfPossible(board, this.state, dx, dy);
    return this;
  }

  rotate(board) {
    this.state = tryRotate(board, this.state);
    return this;
  }

  hardDrop(board) {
    this.state = hardDropPiece(board, this.state);
    return this;
  }

  isResting(board) {
    return isResting(board, this.state);
  }

  toJSON() {
    const { type, rotation, x, y } = this.state;
    return { type, rotation, x, y };
  }
}

export default Piece;
