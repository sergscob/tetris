import { expect } from 'chai';
import { generatePieceSequence, createSeed } from '../../src/game-logic/rng';
import { PIECE_TYPES } from '../../src/game-logic/pieces';


describe('game-logic/rng', () => {
  it('same seed always generates same sequence, and different seeds make different sequences', () => {
    const a = generatePieceSequence(42, 50);
    const b = generatePieceSequence(42, 50);
    expect(a).to.deep.equal(b);

    const c = generatePieceSequence(1, 50);
    const d = generatePieceSequence(2, 50);
    expect(c).to.not.deep.equal(d);
  });

  it('every bag of 7 contains each piece type exactly once', () => {
    const sequence = generatePieceSequence(7, 14);
    const firstBag = sequence.slice(0, 7);
    const secondBag = sequence.slice(7, 14);
    expect(firstBag.slice().sort()).to.deep.equal(PIECE_TYPES.slice().sort());
    expect(secondBag.slice().sort()).to.deep.equal(PIECE_TYPES.slice().sort());
  });

});
