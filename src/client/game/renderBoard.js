import { getPieceCells } from '../../game-logic/pieces';
import { hardDropY } from '../../game-logic/collision';

export const GHOST_PREFIX = 'ghost:';

export const buildDisplayGrid = (board, piece, hidePiece, showGhost) => {
  const grid = board.map((row) => row.slice())
  if (!piece || hidePiece) return grid;
  
  const ghostY = piece.y + hardDropY(board, piece);
  if (showGhost && ghostY > piece.y + 2) {
    if (ghostY !== piece.y) {
      getPieceCells({ ...piece, y: ghostY }).forEach(({ x, y }) => {
        if (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length && grid[y][x] === null) 
          grid[y][x] = `${GHOST_PREFIX}${piece.type}`
      })
    }
  }
  
  getPieceCells(piece).forEach(({ x, y }) => {
    if (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) 
      grid[y][x] = piece.type
  })

  return grid
};
