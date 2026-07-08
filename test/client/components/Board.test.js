import { expect } from 'chai';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Board from '../../../src/client/components/Board';
import { createBoard } from '../../../src/game-logic/board';

describe('client/components/Board', () => {
  afterEach(cleanup)


  it('render cell per board slot', () => {
    const board = createBoard(4, 3)
    const { container } = render(<Board board={board} />)
    expect(container.querySelectorAll('.board-cell')).to.have.lengthOf(12)

    const penaltyBoard = createBoard(2, 1)
    penaltyBoard[0][0] = 'P'
    const penaltyRender = render(<Board board={penaltyBoard} />)
    const cells = penaltyRender.container.querySelectorAll('.board-cell')
    expect(cells[0].style.backgroundColor).to.not.equal('transparent')
    expect(cells[1].style.backgroundColor).to.equal('')
  })


  it('renders the falling piece', () => {
    const board = createBoard(4, 3);
    const piece = { type: 'O', rotation: 0, x: 0, y: 0 };
    const { container } = render(<Board board={board} piece={piece} />);
    const cells = container.querySelectorAll('.board-cell');
    expect(cells[0].style.backgroundColor).to.not.equal('transparent');

    const hiddenBoard = createBoard(2, 1);
    const hiddenRender = render(<Board board={hiddenBoard} piece={piece} hidePiece />);
    const hiddenCells = hiddenRender.container.querySelectorAll('.board-cell');
    expect(hiddenCells[0].style.backgroundColor).to.equal('');
  })
})
