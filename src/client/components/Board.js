import React from 'react'
import { PIECE_COLORS } from '../../game-logic/pieces'
import { buildDisplayGrid, GHOST_PREFIX } from '../game/renderBoard'

const CELL_SIZE = 22

const cellStyle = cell => {
  if (cell === null) 
    return { backgroundColor: 'transparent' }
  if (cell === 'P') 
    return { backgroundColor: '#4b5563' }

  if (cell.startsWith(GHOST_PREFIX)) {
    const color = PIECE_COLORS[cell.slice(GHOST_PREFIX.length)] || 'transparent';
    return { backgroundColor: 'transparent', boxShadow: `inset 0 0 3px 1px ${color}` };
  }

  return { backgroundColor: PIECE_COLORS[cell] || 'transparent' };
}


const Board = ({ board, piece = null, hidePiece = false, showGhost = false }) => {
  const grid = buildDisplayGrid(board, piece, hidePiece, showGhost)
  const h = grid.length;
  const w = grid[0].length;

  return (
    <div
      className="board"
      style={{
        gridTemplateColumns: `repeat(${w}, ${CELL_SIZE}px)`,
        gridTemplateRows: `repeat(${h}, ${CELL_SIZE}px)`,
      }}
    >
      {grid.flatMap((row, y) => row.map((cell, x) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={`${y}-${x}`} className="board-cell" style={cellStyle(cell)} />
      )))}
    </div>
  );
};

export default Board;
