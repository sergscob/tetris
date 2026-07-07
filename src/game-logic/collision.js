import { canPlacePiece } from './board'
import { rotatePiece } from './pieces'

const TRY_MOVE_OFFSETS = [0, -1, 1, -2, 2]

export const canMove = (board, piece, dx, dy) => {
  return canPlacePiece(board, { ...piece, x: piece.x + dx, y: piece.y + dy })
}

export const moveIfPossible = (board, piece, dx, dy) => {
  if (!canMove(board, piece, dx, dy)) 
    return piece
  return { ...piece, x: piece.x + dx, y: piece.y + dy }
}

export const tryRotate = (board, piece) => {
  const rotated = rotatePiece(piece)
  const ret = TRY_MOVE_OFFSETS.find(offset => canPlacePiece(board, { ...rotated, x: rotated.x + offset }) );
  if (ret === undefined) 
    return piece
  return { ...rotated, x: rotated.x + ret }
}

export const hardDropY = (board, piece) => {
  let y = 0;
  while (canMove(board, piece, 0, y + 1)) 
    y += 1;
  
  return y;
}

export const hardDropPiece = (board, piece) => {
  return {...piece, y: piece.y + hardDropY(board, piece)}
}

export const isResting = (board, piece) => !canMove(board, piece, 0, 1);
