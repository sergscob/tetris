import { expect } from 'chai';
import Piece from '../../src/server/Piece';
import { createBoard, mergePieceIntoBoard } from '../../src/game-logic/board';

describe('server/Piece', () => {
  it('wraps a fresh piece state for its type', () => {
    const piece = new Piece('T');
    expect(piece.type).to.equal('T');
    expect(piece.cells()).to.have.lengthOf(4);

    const placed = new Piece('L', { x: 2, y: -2 });
    expect(placed.toJSON()).to.deep.equal({
      type: 'L', rotation: 0, x: 2, y: -2,
    });
  });

  it('move mutates internal state only when the move is legal', () => {
    const board = createBoard();
    const piece = new Piece('O', { x: 4, y: 0 });
    piece.move(board, -10, 0);
    expect(piece.state.x).to.equal(4);
    piece.move(board, 1, 0);
    expect(piece.state.x).to.equal(5);
  });

  it('rotate updates the rotation state', () => {
    const board = createBoard();
    const piece = new Piece('T', { x: 4, y: 5 });
    piece.rotate(board);
    expect(piece.state.rotation).to.equal(1);
  });

  it('hardDrop drops the piece onto the pile', () => {
    let board = createBoard();
    board = mergePieceIntoBoard(board, new Piece('O', { x: 4, y: 18 }).state);
    const piece = new Piece('O', { x: 4, y: 0 });
    piece.hardDrop(board);
    expect(piece.state.y).to.equal(16);

    const openBoard = createBoard();
    const falling = new Piece('O', { x: 4, y: 0 });
    expect(falling.isResting(openBoard)).to.equal(false);
    falling.hardDrop(openBoard);
    expect(falling.isResting(openBoard)).to.equal(true);
  });
});
