import { expect } from 'chai';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import PlayerList from '../../../src/client/components/PlayerList';

describe('client/components/PlayerList', () => {
  afterEach(cleanup)

  it('lists every player', () => {
    const players = [
      { id: 'p1', name: 'alice', alive: true },
      { id: 'p2', name: 'bob', alive: false },
    ];
    const { getByText } = render(<PlayerList players={players} hostId="p1" />);
    expect(getByText('alice (host)')).to.exist;
    expect(getByText('bob (out)')).to.exist;

    const noHost = render(<PlayerList players={[{ id: 'p1', name: 'alice', alive: true }]} />);
    expect(noHost.getByText('alice')).to.exist;
  });
});
