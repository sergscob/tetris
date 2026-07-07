import { expect } from 'chai';
import { createBoard, mergePieceIntoBoard } from '../../src/game-logic/board';
import { createPiece } from '../../src/game-logic/pieces';
import {
  canMove, moveIfPossible, tryRotate, hardDropY, hardDropPiece, isResting,
} from '../../src/game-logic/collision';

describe('game-logic/collision', () => {
  it('canMove is true in open space and false through walls', () => {
    const board = createBoard();
    const piece = createPiece('O', { x: 4, y: 0 });
    expect(canMove(board, piece, -1, 0)).to.equal(true);
    expect(canMove(board, piece, -10, 0)).to.equal(false);
  });

  it('moveIfPossible moves when valid and stays put when blocked', () => {
    const board = createBoard();
    const piece = createPiece('O', { x: 0, y: 0 });
    const blocked = moveIfPossible(board, piece, -1, 0);
    expect(blocked).to.deep.equal(piece);

    const moved = moveIfPossible(board, piece, 1, 0);
    expect(moved.x).to.equal(1);
  });

  it('tryRotate rotates when space allows', () => {
    const board = createBoard();
    const piece = createPiece('T', { x: 4, y: 5 });
    const rotated = tryRotate(board, piece);
    expect(rotated.rotation).to.equal(1);
  });

  it('tryRotate wall-kicks away from the edge instead of failing', () => {
    const board = createBoard();
    const piece = createPiece('I', { x: 0, y: 5, rotation: 0 });
    const rotated = tryRotate(board, piece);
    expect(rotated.rotation).to.equal(1);
    expect(rotated.x).to.be.at.least(0);
  });

  it('tryRotate returns the original piece when no kick offset works', () => {
    const solidBoard = createBoard(4, 20).map((row) => row.map(() => 'I'));
    const piece = createPiece('I', { x: 0, y: 5, rotation: 0 });
    const rotated = tryRotate(solidBoard, piece);
    expect(rotated).to.deep.equal(piece);
  });

  it('hardDropY stops right above the floor', () => {
    const board = createBoard();
    const piece = createPiece('O', { x: 4, y: 0 });
    const y = hardDropY(board, piece);
    const dropped = hardDropPiece(board, piece);
    expect(dropped.y).to.equal(piece.y + y);
    expect(canMove(board, dropped, 0, 1)).to.equal(false);
  });

  it('hardDropY stops on top of the pile', () => {
    let board = createBoard();
    board = mergePieceIntoBoard(board, createPiece('O', { x: 4, y: 18 }));
    const piece = createPiece('O', { x: 4, y: 0 });
    const dropped = hardDropPiece(board, piece);
    expect(dropped.y).to.equal(16);
  });

  it('isResting reflects whether the piece can still fall', () => {
    const board = createBoard();
    const falling = createPiece('O', { x: 4, y: 0 });
    expect(isResting(board, falling)).to.equal(false);
    const resting = hardDropPiece(board, falling);
    expect(isResting(board, resting)).to.equal(true);
  });
});
