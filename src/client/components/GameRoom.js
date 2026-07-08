import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { joinRoom } from '../actions/room'
import socket from '../socket'
import Lobby from './Lobby'
import GameView from './GameView'

const GameRoom = () => {
  const { room, playerName } = useParams()
  const dispatch = useDispatch()
  const status = useSelector(state => state.room.status)

  useEffect(() => {
    socket.connect()
    dispatch(joinRoom(room, playerName))
    
    return () => socket.disconnect()
  }, [room, playerName, dispatch])

  return (
    <div className="game-room">
      <h1>{`Red Tetris: ${room}`}</h1>
      {status === 'playing' ? <GameView /> : <Lobby />}
    </div>
  );
};

export default GameRoom;
