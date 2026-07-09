import { expect } from 'chai';
import { createBoard, mergePieceIntoBoard } from '../../src/game-logic/board';
import { createPiece } from '../../src/game-logic/pieces'
import { canMove, moveIfPossible, tryRotate, hardDropY, hardDropPiece, isResting } from '../../src/game-logic/collision'


describe('game-logic/collision', () => {
  it('canMove is true in open space and false on walls', () => {
    const board = createBoard( )
    const piece = createPiece('O', { x: 4, y: 0 })

    expect(canMove(board, piece, -1, 0)).to.equal(true)
    expect(canMove(board, piece, -10, 0)).to.equal(false)

    const origin = createPiece('O', { x: 0, y: 0 })
    const blocked = moveIfPossible(board, origin, -1, 0)
    expect(blocked).to.deep.equal(origin)

    const moved = moveIfPossible(board, origin, 1, 0)
    expect(moved.x).to.equal(1)
  });

  it('tryRotate rotate when space allows', () => {
    const board = createBoard( )
    const piece = createPiece('T', { x: 4, y: 5 });
    const rotated = tryRotate(board, piece);
    expect(rotated.rotation).to.equal(1);

    const nearWall = createPiece('I', { x: 0, y: 5, rotation: 0 });
    const kicked = tryRotate(board, nearWall);
    expect(kicked.rotation).to.equal(1);
    expect(kicked.x).to.be.at.least(0)

    const solidBoard = createBoard(4, 20).map((row) => row.map(() => 'I'));
    const stuck = createPiece('I', { x: 0, y: 5, rotation: 0 });
    const notRotated = tryRotate(solidBoard, stuck);
    expect(notRotated).to.deep.equal(stuck);
  });

  
  it('hardDropY stops right above the floor or on top of the pile', () => {
    const board = createBoard()
    const piece = createPiece('O', { x: 4, y: 0 })
    const y = hardDropY(board, piece)
    const dropped = hardDropPiece(board, piece)

    expect(dropped.y).to.equal(piece.y + y)
    expect(canMove(board, dropped, 0, 1)).to.equal(false)

    const stackedBoard = mergePieceIntoBoard(createBoard(), createPiece('O', { x: 4, y: 18 }))
    const droppedOnPile = hardDropPiece(stackedBoard, createPiece('O', { x: 4, y: 0 }))
    expect(droppedOnPile.y).to.equal(16)
  })


  it('isResting show if the piece can still fall', () => {
    const board = createBoard()
    const falling = createPiece('O', { x: 4, y: 0 })
    expect(isResting(board, falling)).to.equal(false)
    const resting = hardDropPiece(board, falling)
    expect(isResting(board, resting)).to.equal(true)
  })
})
