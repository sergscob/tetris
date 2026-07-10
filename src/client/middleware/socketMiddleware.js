
import { JOIN_ROOM, START_GAME, roomStateReceived, socketErrorReceived, selfConnected } from '../actions/room';
import { MOVE, ROTATE, SOFT_DROP, HARD_DROP, gameStarted, gameTick, gameOver } from '../actions/game';
import { leaderboardReceived } from '../actions/leaderboard';


const OUT_EVENTS = 
{
  [JOIN_ROOM]: action => ['room:join', { room: action.room, playerName: action.playerName, mode: action.mode }],
  [START_GAME]: action => ['game:start', { mode: action.mode }],
  [MOVE]: action => ['input:move', { dir: action.dir }],
  [ROTATE]: () => ['input:rotate', undefined],
  [SOFT_DROP]: () => ['input:softDrop', undefined],
  [HARD_DROP]: () => ['input:hardDrop', undefined],
};

const createSocketMiddleware = socket => store => {
  socket.on('connect', () => store.dispatch(selfConnected(socket.id)));
  socket.on('room:state', payload => store.dispatch(roomStateReceived(payload)));
  socket.on('game:started', () => store.dispatch(gameStarted()));
  socket.on('game:tick', payload => store.dispatch(gameTick(payload)));
  socket.on('game:over', ({ winnerId }) => store.dispatch(gameOver(winnerId)));
  socket.on('error', ({ message }) => store.dispatch(socketErrorReceived(message)));
  socket.on('leaderboard:top', (entries) => store.dispatch(leaderboardReceived(entries)));

  return next => (action) => {
    const toEvent = OUT_EVENTS[action.type]
    if (toEvent) {
      const [event, payload] = toEvent(action)
      socket.emit(event, payload)
    }
    return next(action)
  };
};

export default createSocketMiddleware;
