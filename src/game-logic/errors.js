export class InvalidMoveError extends Error {
  constructor(message) {
    super(message)
    this.name = 'InvalidMoveError'
  }
}

export class GameOverError extends Error {
  constructor(message) {
    super(message)
    this.name = 'GameOverError'
  }
}

export class RoomStateError extends Error {
  constructor(message) {
    super(message)
    this.name = 'RoomStateError'
  }
}
