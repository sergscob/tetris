import { expect } from 'chai';
import { createBoard, mergePieceIntoBoard } from '../../src/game-logic/board';
import { createPiece } from '../../src/game-logic/pieces';
import { computeSpectrum } from '../../src/game-logic/spectrum';

describe('game-logic/spectrum', () => {
  it('is all zeroes for an empty board', () => {
    const board = createBoard(4, 5);
    expect(computeSpectrum(board)).to.deep.equal([0, 0, 0, 0]);
  });

  it('reports the height of the highest block per column', () => {
    let board = createBoard(4, 5);
    board = mergePieceIntoBoard(board, createPiece('O', { x: 0, y: 3 }));
    expect(computeSpectrum(board)).to.deep.equal([2, 2, 0, 0]);
  });

  it('measures from the topmost filled cell even with holes beneath', () => {
    const board = createBoard(3, 4);
    board[0][1] = 'I';
    board[3][1] = null;
    expect(computeSpectrum(board)).to.deep.equal([0, 4, 0]);
  });
});
