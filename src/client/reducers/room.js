import { ROOM_STATE, SOCKET_ERROR, JOIN_ROOM, SELF_CONNECTED } from '../actions/room';

const initialState = {
  selfId: null,
  room: null,
  playerName: null,
  players: [],
  status: 'idle',
  hostId: null,
  winnerId: null,
  error: null,
};

const room = (state = initialState, action) => {
  switch (action.type) {
    case SELF_CONNECTED:
      return { ...state, selfId: action.selfId };
    case JOIN_ROOM:
      return { ...state, room: action.room, playerName: action.playerName, error: null };
    case ROOM_STATE:
      return { ...state, ...action.payload, error: null };
    case SOCKET_ERROR:
      return { ...state, error: action.message };
    default:
      return state;
  }
};

export default room;
