import { getPieceCells } from './pieces'

export const BOARD_WIDTH = 10
export const BOARD_HEIGHT = 20
export const PENALTY_CELL = 'P'

export const createBoard = (w = BOARD_WIDTH, h = BOARD_HEIGHT) => Array.from(
  { length: h },
  () => Array.from({ length: w }, () => null),
)

export const isInsideColumns = (board, x) => x >= 0 && x < board[0].length

export const isCellFree = (board, x, y) => {
  if (y < 0)
    return true
  if (y >= board.length) 
    return false
  if (!isInsideColumns(board, x)) 
    return false
  return board[y][x] === null
}

export const canPlacePiece = (board, piece) => {
  return getPieceCells(piece).every(({ x, y }) => isInsideColumns(board, x) && y < board.length && isCellFree(board, x, y))
}

export const mergePieceIntoBoard = (board, piece) => {
  const next = structuredClone(board);
  getPieceCells(piece).forEach(({ x, y }) => {
    if (y >= 0 && y < next.length && isInsideColumns(board, x)) {
      next[y][x] = piece.type;
    }
  })
  return next;
}

export const clearFullLines = (board) => {
  const w = board[0].length
  const remaining = board.filter(row => row.some(cell => cell === null || cell === PENALTY_CELL))
  const linesCleared = board.length - remaining.length
  const emptyRows = Array.from(
    { length: linesCleared },
    () => Array.from({ length: w }, () => null),
  );
  return { board: [...emptyRows, ...remaining], linesCleared };
};

export const addPenaltyLines = (board, count) => {
  if (count <= 0) 
    return board
  const w = board[0].length
  const penaltyRows = Array.from(
    { length: count },
    () => Array.from({ length: w }, () => PENALTY_CELL),
  )
  return [...board.slice(count), ...penaltyRows]
}

export const isBoardOverflowing = board => board[0].some(cell => cell !== null)
