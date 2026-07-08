import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startGame } from '../actions/room';
import PlayerList from './PlayerList';
import Leaderboard from './Leaderboard';

const Lobby = () => {
  const dispatch = useDispatch();
  const { players, hostId, selfId, error, winnerId } = useSelector((state) => state.room)
  const leaderboard = useSelector((state) => state.leaderboard);
  const [invisible, setInvisible] = useState(false);
  const [showGhost, setShowGhost] = useState(false);
  const [gravityMultiplier, setGravityMultiplier] = useState(1);
  const [acceleration, setAcceleration] = useState(false);

  const isHost = selfId !== null && selfId === hostId;
  const winner = players.find((player) => player.id === winnerId);

  const handleStart = () => dispatch(startGame({ invisible, showGhost, gravityMultiplier, acceleration }));

  return (
    <div className="game-room">
      <h2>{`Room lobby (${players.length} player${players.length === 1 ? '' : 's'})`}</h2>
      {error && <div className="error-banner">{error}</div>}
      {winner && (
        <div className="game-over-banner">
          {`${winner.name} won the last round!`}
        </div>
      )}
      <PlayerList players={players} hostId={hostId} />
      {isHost ? (
        <div className="mode-options">
          <label htmlFor="invisible-mode">
            <input
              id="invisible-mode"
              type="checkbox"
              checked={invisible}
              onChange={(event) => setInvisible(event.target.checked)}
            />
            Invisible pieces
          </label>
          <label htmlFor="gravity-mode">
            <input
              id="gravity-mode"
              type="checkbox"
              checked={gravityMultiplier > 1}
              onChange={(event) => setGravityMultiplier(event.target.checked ? 2 : 1)}
            />
            Increased gravity
          </label>
          <label htmlFor="show-ghosts">
            <input
              id="show-ghosts"
              type="checkbox"
              checked={showGhost}
              onChange={(event) => setShowGhost(event.target.checked)}
            />
            Show ghost pieces
          </label>
          <label htmlFor="acceleration">
            <input
              id="acceleration"
              type="checkbox"
              checked={acceleration}
              onChange={(event) => setAcceleration(event.target.checked)}
            />
            Acceleration
          </label>
          <button type="button" onClick={handleStart}>Start game</button>
        </div>
      ) : (
        <h2>WAITING WHEN THE HOST STARTS THE GAME... </h2>
      )}
      <Leaderboard entries={leaderboard} />
    </div>
  );
};

export default Lobby;
