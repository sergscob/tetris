import { expect } from 'chai';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Board from '../../../src/client/components/Board';
import { createBoard } from '../../../src/game-logic/board';

describe('client/components/Board', () => {
  afterEach(cleanup);

  it('renders one cell per board slot', () => {
    const board = createBoard(4, 3);
    const { container } = render(<Board board={board} />);
    expect(container.querySelectorAll('.board-cell')).to.have.lengthOf(12);
  });

  it('renders the falling piece merged on top of the board', () => {
    const board = createBoard(4, 3);
    const piece = {
      type: 'O', rotation: 0, x: 0, y: 0,
    };
    const { container } = render(<Board board={board} piece={piece} />);
    const cells = container.querySelectorAll('.board-cell');
    expect(cells[0].style.backgroundColor).to.not.equal('transparent');
  });

  it('hides the piece when hidePiece is true', () => {
    const board = createBoard(2, 1);
    const piece = {
      type: 'O', rotation: 0, x: 0, y: 0,
    };
    const { container } = render(<Board board={board} piece={piece} hidePiece />);
    const cells = container.querySelectorAll('.board-cell');
    expect(cells[0].style.backgroundColor).to.equal('');
  });

  it('renders penalty cells with their own color, distinct from empty', () => {
    const board = createBoard(2, 1);
    board[0][0] = 'P';
    const { container } = render(<Board board={board} />);
    const cells = container.querySelectorAll('.board-cell');
    expect(cells[0].style.backgroundColor).to.not.equal('transparent');
    expect(cells[1].style.backgroundColor).to.equal('');
  });
});
