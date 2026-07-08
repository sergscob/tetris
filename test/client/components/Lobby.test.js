import { expect } from 'chai';
import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Lobby from '../../../src/client/components/Lobby';
import rootReducer from '../../../src/client/reducers';

const renderWithStore = (roomState, leaderboardState = []) => {
  const store = createStore(rootReducer, { room: roomState, leaderboard: leaderboardState });
  return render(<Provider store={store}><Lobby /></Provider>);
};

describe('client/components/Lobby', () => {
  afterEach(cleanup);

  it('shows a waiting message for non-host players', () => {
    const { getByText, queryByText } = renderWithStore({
      selfId: 'p2',
      hostId: 'p1',
      players: [{ id: 'p1', name: 'alice' }, { id: 'p2', name: 'bob' }],
      error: null,
      winnerId: null,
    });
    expect(getByText(/WAITING/)).to.exist;
    expect(queryByText('Start game')).to.equal(null);
  });

  it('shows a start button for the host ', () => {
    const { getByText, queryByText } = renderWithStore({
      selfId: 'p1',
      hostId: 'p1',
      players: [{ id: 'p1', name: 'alice' }],
      error: null,
      winnerId: null,
    });
    expect(getByText('Start game')).to.exist;
    expect(queryByText('Invisible pieces')).to.equal(null);
  })

  it('show last error ', () => {
    const { getByText } = renderWithStore({
      selfId: 'p2',
      hostId: 'p1',
      players: [{ id: 'p1', name: 'alice' }, { id: 'p2', name: 'bob' }],
      error: 'room already started',
      winnerId: 'p1',
    });
    expect(getByText('room already started')).to.exist;
    expect(getByText('alice won the last round!')).to.exist;
  });


  it('hide the leaderboard by default even when scores have been recorded', () => {
    const { queryByText } = renderWithStore(
      { selfId: 'p1', hostId: 'p1', players: [{ id: 'p1', name: 'alice' }], error: null, winnerId: null },
      [{ name: 'alice', score: 900, date: '2026-01-01' }],
    );
    expect(queryByText('alice — 900')).to.equal(null);
  })

});
