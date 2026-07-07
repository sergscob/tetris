import { expect } from 'chai';
import RoomManager from '../../src/server/RoomManager';
import { RoomStateError } from '../../src/game-logic/errors';

describe('server/RoomManager', () => {
  it('creates a room on first join and reuses it afterwards', () => {
    const manager = new RoomManager();
    const first = manager.join('room1', 'p1', 'alice');
    const second = manager.join('room1', 'p2', 'bob');

    expect(first.isNewGame).to.equal(true);
    expect(second.isNewGame).to.equal(false);
    expect(second.game).to.equal(first.game);
    expect(manager.getGame('room1').players.size).to.equal(2);
  });

  it('keeps concurrent rooms isolated from each other', () => {
    const manager = new RoomManager();
    manager.join('room1', 'p1', 'alice');
    manager.join('room2', 'p2', 'bob');

    expect(manager.getGame('room1').players.has('p2')).to.equal(false);
    expect(manager.getGame('room2').players.has('p1')).to.equal(false);
  });

  it('deletes the room once the last player leaves', () => {
    const manager = new RoomManager();
    manager.join('room1', 'p1', 'alice');
    manager.leave('room1', 'p1');
    expect(manager.getGame('room1')).to.equal(undefined);
  });

  it('findRoomOf locates which room a player belongs to', () => {
    const manager = new RoomManager();
    manager.join('room1', 'p1', 'alice');
    expect(manager.findRoomOf('p1')).to.equal('room1');
    expect(manager.findRoomOf('unknown')).to.equal(null);
  });

  it('leave is a no-op for a room that does not exist', () => {
    const manager = new RoomManager();
    expect(() => manager.leave('ghost', 'p1')).to.not.throw();
  });

  it('propagates errors from Game (e.g. joining after start)', () => {
    const manager = new RoomManager();
    manager.join('room1', 'p1', 'alice');
    manager.getGame('room1').start('p1');
    expect(() => manager.join('room1', 'p2', 'bob')).to.throw(RoomStateError);
  });
});
