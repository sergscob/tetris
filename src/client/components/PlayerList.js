import React from 'react';

const PlayerList = ({ players, hostId = null }) => (
  <ul className="player-list">
    {players.map((player) => (
      <li key={player.id}>
        {player.name}
        {player.id === hostId && ' (host)'}
        {!player.alive && ' (out)'}
      </li>
    ))}
  </ul>
);

export default PlayerList;
