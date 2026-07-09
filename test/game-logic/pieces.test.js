import { expect } from 'chai';
import { PIECE_TYPES, createPiece, getPieceCells, rotatePiece } from '../../src/game-logic/pieces';

describe('game-logic/pieces', () => {

  it('all 7 types', () => {
    expect(PIECE_TYPES).to.have.lengthOf(7);
    expect(PIECE_TYPES).to.include.members(['I', 'J', 'L', 'O', 'S', 'T', 'Z']);

    const piece = createPiece('T');
    expect(piece.type).to.equal('T');
    expect(piece.rotation).to.equal(0);
    expect(piece.y).to.be.below(0);
  });

  
  it('getPieceCells return 4 cells for every type at every rotation', () => {
    
    PIECE_TYPES.forEach((type) => {
      [0, 1, 2, 3].forEach((rotation) => {
        const cells = getPieceCells({ type, rotation, x: 0, y: 0 });
        expect(cells).to.have.lengthOf(4);
      })
    })
  })

  it('rotatePiece not change input piece', () => {
    const piece = createPiece('S');
    const frozen = { ...piece };
    rotatePiece(piece);
    expect(piece).to.deep.equal(frozen);
  });
});
