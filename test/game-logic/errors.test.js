import { expect } from 'chai';
import { InvalidMoveError, GameOverError, RoomStateError } from '../../src/game-logic/errors';


describe('game-logic/errors', () => {
  [InvalidMoveError, GameOverError, RoomStateError].forEach((ErrorClass) => {
    it(`${ErrorClass.name} is an Error subclass carrying its name and message`, () => {
      const error = new ErrorClass('boom');
      
      expect(error).to.be.instanceOf(Error)
      expect(error).to.be.instanceOf(ErrorClass)
      expect(error.name).to.equal(ErrorClass.name);
      expect(error.message).to.equal('boom');
    });
  });
});
