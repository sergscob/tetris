import { expect } from 'chai';
import {
  createBoard, canPlacePiece, mergePieceIntoBoard, clearFullLines,
  addPenaltyLines, isBoardOverflowing, isCellFree, BOARD_WIDTH, BOARD_HEIGHT,
} from '../../src/game-logic/board';
import { createPiece } from '../../src/game-logic/pieces';

describe('game-logic/board', () => {
  it('creates an empty board', () => {
    const board = createBoard();
    expect(board).to.have.lengthOf(BOARD_HEIGHT);
    expect(board[0]).to.have.lengthOf(BOARD_WIDTH);
    expect(board.every((row) => row.every((cell) => cell === null))).to.equal(true);
  });


  it('isCellFree: rows above the board are TRUE and outer columns are TRUE', () => {
    const board = createBoard();
    expect(isCellFree(board, 0, -1)).to.equal(true);
    expect(isCellFree(board, -1, 0)).to.equal(false);
    expect(isCellFree(board, BOARD_WIDTH, 0)).to.equal(false);
    expect(isCellFree(board, 0, BOARD_HEIGHT)).to.equal(false);
  });


  it('canPlacePiece is true on empty board and false quand occupied', () => {
    const board = createBoard();
    const piece = createPiece('O', { x: 4, y: 0 });
    expect(canPlacePiece(board, piece)).to.equal(true);

    const merged = mergePieceIntoBoard(board, piece);
    expect(canPlacePiece(merged, piece)).to.equal(false);
  });

  it('mergePieceIntoBoard does not change the original board', () => {
    const board = createBoard();
    const piece = createPiece('O', { x: 4, y: 0 });
    const merged = mergePieceIntoBoard(board, piece);
    expect(board[0][4]).to.equal(null);
    expect(merged[0][4]).to.equal('O');
  });

  it('mergePieceIntoBoard ignores cells above the visible board', () => {
    const board = createBoard();
    const piece = createPiece('I', { x: 3, y: -2 });
    expect(() => mergePieceIntoBoard(board, piece)).to.not.throw();
  });


  it('clearFullLines remove complete rows and place empty rows on top', () => {
    const board = createBoard(4, 3);
    board[2] = ['I', 'I', 'I', 'I'];
    const { board: next, linesCleared } = clearFullLines(board);
    expect(linesCleared).to.equal(1);
    expect(next).to.have.lengthOf(3);
    expect(next[0].every((cell) => cell === null)).to.equal(true);
  });


  it('clearFullLines when no line is full', () => {
    const board = createBoard(4, 3);
    const { board: next, linesCleared } = clearFullLines(board);
    expect(linesCleared).to.equal(0);
    expect(next).to.deep.equal(board);
  });


  it('addPenaltyLines pushes indestructible rows to the bottom', () => {
    const board = createBoard(4, 3);
    const withPenalty = addPenaltyLines(board, 1);
    expect(withPenalty).to.have.lengthOf(3);
    expect(withPenalty[2].every((cell) => cell === 'P')).to.equal(true);
  });

  it('addPenaltyLines(0) or (-3) returns the same board', () => {
    const board = createBoard(4, 3);
    expect(addPenaltyLines(board, 0)).to.equal(board);
    expect(addPenaltyLines(board, -3)).to.equal(board);
  });


  it('isBoardOverflowing detect a blocked top row', () => {
    const board = createBoard(4, 3);
    expect(isBoardOverflowing(board)).to.equal(false);
    board[0][0] = 'I';
    expect(isBoardOverflowing(board)).to.equal(true);
  });
});
