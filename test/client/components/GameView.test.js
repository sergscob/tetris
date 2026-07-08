import { expect } from 'chai';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import GameView from '../../../src/client/components/GameView';
import rootReducer from '../../../src/client/reducers';
import { createBoard } from '../../../src/game-logic/board';

const renderWithStore = (gameState) => {
  const store = createStore(rootReducer, { game: gameState });
  return render(<Provider store={store}><GameView /></Provider>);
};

describe('client/components/GameView', () => {
  afterEach(cleanup)


  it('starting placeholder', () => {
    const { getByText } = renderWithStore({ board: null, opponents: [] });
    expect(getByText('Starting...')).to.exist;

    const board = createBoard(2, 1);
    const eliminated = renderWithStore({
      board,
      piece: null,
      hidePiece: false,
      score: 0,
      alive: false,
      next: null,
      opponents: [],
    });
    expect(eliminated.getByText(/View mode until the round ends/)).to.exist;
  });

  it('renders the board, score, next piece and opponents once ticking', () => {
    const board = createBoard(4, 2);
    const { getByText, container } = renderWithStore({
      board,
      piece: null,
      hidePiece: false,
      score: 250,
      alive: true,
      next: 'I',
      opponents: [{
        id: 'p2', name: 'bob', alive: true, score: 10, spectrum: [0, 0, 0, 0],
      }],
    });
    expect(getByText('Score: 250')).to.exist;
    expect(getByText('Next: I')).to.exist;
    expect(container.querySelectorAll('.board-cell')).to.have.lengthOf(8);
    expect(getByText('bob')).to.exist;
  });
});
