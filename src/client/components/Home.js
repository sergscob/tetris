import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [room, setRoom] = useState('')
  const [playerName, setPlayerName] = useState('')
  const navigate = useNavigate()

  const handleSubmit = event => {
    event.preventDefault()
    if (!room.trim() || !playerName.trim()) 
      return
    navigate(`/${encodeURIComponent(room.trim())}/${encodeURIComponent(playerName.trim())}`)
  };

  return (
    <form className="home-form" onSubmit={handleSubmit}>
      <h1>Red Tetris</h1>
      <input placeholder="Room name" value={room} onChange={(event) => setRoom(event.target.value)} />
      <input placeholder="Player name" value={playerName} onChange={(event) => setPlayerName(event.target.value)} />
      <button type="submit">Join</button>
    </form>
  )
}

export default Home;
