import { expect } from 'chai';
import {
  PIECE_TYPES, createPiece, getPieceCells, rotatePiece,
} from '../../src/game-logic/pieces';

describe('game-logic/pieces', () => {
  it('exposes all 7 tetromino types', () => {
    expect(PIECE_TYPES).to.have.lengthOf(7);
    expect(PIECE_TYPES).to.include.members(['I', 'J', 'L', 'O', 'S', 'T', 'Z']);
  });

  it('createPiece spawns at the top with rotation 0', () => {
    const piece = createPiece('T');
    expect(piece.type).to.equal('T');
    expect(piece.rotation).to.equal(0);
    expect(piece.y).to.be.below(0);
  });

  it('createPiece accepts overrides', () => {
    const piece = createPiece('O', { x: 5, y: 10 });
    expect(piece.x).to.equal(5);
    expect(piece.y).to.equal(10);
  });

  PIECE_TYPES.forEach((type) => {
    it(`getPieceCells returns 4 cells for ${type} at every rotation`, () => {
      [0, 1, 2, 3].forEach((rotation) => {
        const cells = getPieceCells({
          type, rotation, x: 0, y: 0,
        });
        expect(cells).to.have.lengthOf(4);
      });
    });
  });

  it('rotatePiece cycles rotation forward and wraps at 4', () => {
    const piece = createPiece('L');
    expect(rotatePiece(piece).rotation).to.equal(1);
    expect(rotatePiece({ ...piece, rotation: 3 }).rotation).to.equal(0);
  });

  it('does not mutate the input piece', () => {
    const piece = createPiece('S');
    const frozen = { ...piece };
    rotatePiece(piece);
    expect(piece).to.deep.equal(frozen);
  });
});
