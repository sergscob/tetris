export const computeSpectrum = board => {
  const w = board[0].length
  const h = board.length
  const cols = new Array(w).fill(0)

  for (let x = 0; x < w; x++) {
    let y = 0
    while (y < h && board[y][x] === null) 
      y++
    
    cols[x] = h - y
  }

  return cols
}
