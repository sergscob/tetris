import { expect } from 'chai';
import { createBoard, mergePieceIntoBoard } from '../../src/game-logic/board';
import { createPiece } from '../../src/game-logic/pieces';
import { computeSpectrum } from '../../src/game-logic/spectrum';




describe('game-logic/spectrum', () => {

  it('is all zero for empty board, and height of the highest block per column', () => {
    const board = createBoard(4, 5)
    expect(computeSpectrum(board)).to.deep.equal([0, 0, 0, 0])

    const stacked = mergePieceIntoBoard(board, createPiece('O', { x: 0, y: 3 }))
    expect(computeSpectrum(stacked)).to.deep.equal([2, 2, 0, 0])
  })

})
