import { expect } from 'chai';
import { generatePieceSequence, createSeed } from '../../src/game-logic/rng';
import { PIECE_TYPES } from '../../src/game-logic/pieces';

describe('game-logic/rng', () => {
  it('is deterministic: the same seed always yields the same sequence', () => {
    const a = generatePieceSequence(42, 50);
    const b = generatePieceSequence(42, 50);
    expect(a).to.deep.equal(b);
  });

  it('different seeds produce different sequences', () => {
    const a = generatePieceSequence(1, 50);
    const b = generatePieceSequence(2, 50);
    expect(a).to.not.deep.equal(b);
  });

  it('every bag of 7 contains each piece type exactly once', () => {
    const sequence = generatePieceSequence(7, 14);
    const firstBag = sequence.slice(0, 7);
    const secondBag = sequence.slice(7, 14);
    expect(firstBag.slice().sort()).to.deep.equal(PIECE_TYPES.slice().sort());
    expect(secondBag.slice().sort()).to.deep.equal(PIECE_TYPES.slice().sort());
  });

  it('returns exactly the requested count', () => {
    expect(generatePieceSequence(5, 3)).to.have.lengthOf(3);
    expect(generatePieceSequence(5, 100)).to.have.lengthOf(100);
  });

  it('a longer sequence for the same seed starts with the shorter one (stable prefix)', () => {
    const short = generatePieceSequence(99, 7);
    const long = generatePieceSequence(99, 21);
    expect(long.slice(0, 7)).to.deep.equal(short);
  });

  it('createSeed returns a number within 32-bit unsigned range', () => {
    const seed = createSeed();
    expect(seed).to.be.a('number');
    expect(seed).to.be.at.least(0);
    expect(seed).to.be.at.most(0xffffffff);
  });
});
