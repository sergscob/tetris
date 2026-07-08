import { expect } from 'chai';
import fs from 'fs';
import os from 'os';
import path from 'path';
import ScoreStore from '../../src/server/ScoreStore';

describe('server/ScoreStore', () => {
  let filePath;
  let store;

  beforeEach(() => {
    filePath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'red-tetris-')), 'scores.json');
    store = new ScoreStore(filePath);
  });

  afterEach(() => {
    fs.rmSync(path.dirname(filePath), { recursive: true, force: true });
  });

  it('returns an empty list before anything was recorded, then persists scores across instances', () => {
    expect(store.top()).to.deep.equal([]);

    store.record('alice', 300);
    const reopened = new ScoreStore(filePath);
    expect(reopened.top()).to.have.lengthOf(1);
    expect(reopened.top()[0]).to.include({ name: 'alice', score: 300 });
  });

  it('ranks top() by score, highest first, and respects the limit', () => {
    store.record('alice', 100);
    store.record('bob', 500);
    store.record('carol', 300);

    expect(store.top(2).map((entry) => entry.name)).to.deep.equal(['bob', 'carol']);
  });
});
