import { expect } from 'chai';
import leaderboard from '../../src/client/reducers/leaderboard';
import { leaderboardReceived } from '../../src/client/actions/leaderboard';


describe('client/reducers/leaderboard', () => {
  it('defaults to an empty list', () => {
    expect(leaderboard(undefined, { type: '@@INIT' })).to.deep.equal([])

    const entries = [{ name: 'alice', score: 500, date: '2026-01-01' }]
    expect(leaderboard([], leaderboardReceived(entries))).to.deep.equal(entries)
  })
})
