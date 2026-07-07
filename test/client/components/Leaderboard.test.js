import { expect } from 'chai';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Leaderboard from '../../../src/client/components/Leaderboard';

describe('client/components/Leaderboard', () => {
  afterEach(cleanup);

  it('renders nothing when there are no scores yet', () => {
    const { container } = render(<Leaderboard entries={[]} />);
    expect(container.innerHTML).to.equal('');
  });

  it('lists each entry with its name and score', () => {
    const { getByText } = render(<Leaderboard entries={[
      { name: 'alice', score: 300, date: '2026-01-01' },
      { name: 'bob', score: 100, date: '2026-01-02' },
    ]}
    />);
    expect(getByText('alice — 300')).to.exist;
    expect(getByText('bob — 100')).to.exist;
  });
});
