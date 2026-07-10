import { GAME_STARTED, GAME_TICK, GAME_OVER } from '../actions/game';

const initialState = {
  board: null,
  piece: null,
  hidePiece: false,
  showGhost: false,
  next: null,
  score: 0,
  alive: true,
  opponents: [],
  lastWinnerId: null,
};

const game = (state = initialState, action) => {
  switch (action.type) {
    case GAME_STARTED:
      return { ...initialState, lastWinnerId: null };
    case GAME_TICK:
      return { ...state, ...action.payload };
    case GAME_OVER:
      return { ...state, lastWinnerId: action.winnerId };
    default:
      return state;
  }
};

export default game;
