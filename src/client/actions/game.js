export const MOVE = 'game/move';
export const ROTATE = 'game/rotate';
export const SOFT_DROP = 'game/softDrop';
export const HARD_DROP = 'game/hardDrop';

export const GAME_STARTED = 'game/started';
export const GAME_TICK = 'game/tick';
export const GAME_OVER = 'game/over';

export const move = dir => ({ type: MOVE, dir });
export const rotate = () => ({ type: ROTATE });
export const softDrop = () => ({ type: SOFT_DROP });
export const hardDrop = () => ({ type: HARD_DROP });

export const gameStarted = seed => ({ type: GAME_STARTED, seed });
export const gameTick = payload => ({ type: GAME_TICK, payload });
export const gameOver = winnerId => ({ type: GAME_OVER, winnerId });
