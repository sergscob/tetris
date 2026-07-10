import { PIECE_TYPES } from './pieces'

const createRandomFn = seed => {
  let state = (seed % 0x7FFFFFFF) || 1
  return () => {
    state = (state * 16807) % 0x7FFFFFFF
    return (state - 1) / (0x7FFFFFFF-1)
  };
}

const shuffleBag = (random) => {
  const bag = [...PIECE_TYPES]
  for (let i = bag.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]]
  }
  return bag
}

export const generatePieceSequence = (seed, count) => {
  const random = createRandomFn(seed)
  const sequence = []
  while (sequence.length < count) 
    sequence.push(...shuffleBag(random))
  
  return sequence.slice(0, count)
}

export const createSeed = () => Math.floor(Math.random() * 0xffffffff);
