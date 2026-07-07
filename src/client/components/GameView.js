import React from 'react';
import { useSelector } from 'react-redux';
import Board from './Board';
import Spectrum from './Spectrum';
import useKeyboard from '../hooks/useKeyboard';

const GameView = () => {
  const { board, piece, hidePiece, showGhost, score, alive, opponents, next } = useSelector(state => state.game)

  useKeyboard(alive);

  if (!board) 
    return <p>Starting...</p>;

  return (
    <div className="game-layout">
      <div>
        <div>{`Score: ${score}`}</div>
        {!alive && <div className="error-banner">You finished. View mode until the round ends.</div>}
        <Board board={board} piece={piece} hidePiece={hidePiece} showGhost={showGhost} />
      </div>
      <div className="side-panel">
        <div>{`Next: ${next || '-'}`}</div>
        <div className="opponents">
          {opponents.map(opponent => (
            <Spectrum key={opponent.id} {...opponent} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameView;
