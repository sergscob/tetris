import { LEADERBOARD_RECEIVED } from '../actions/leaderboard';

const leaderboard = (state = [], action) => {
  switch (action.type) {
    case LEADERBOARD_RECEIVED:
      return action.entries;
    default:
      return state;
  }
};

export default leaderboard;
