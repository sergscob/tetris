import { combineReducers } from 'redux';
import room from './room';
import game from './game';
import leaderboard from './leaderboard';

export default combineReducers({ room, game, leaderboard });
