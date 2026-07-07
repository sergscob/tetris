import Game from './Game';

class RoomManager {
  constructor() {
    this.games = new Map()
  }

  getGame(room) {
    return this.games.get(room)
  }

  join(room, playerId, playerName, options) {
    let game = this.games.get(room)
    let isNewGame = false

    if (!game) {
      game = new Game(room, options)
      this.games.set(room, game)
      isNewGame = true
    }

    const player = game.addPlayer(playerId, playerName)
    return { game, player, isNewGame }
  }

  leave(room, playerId) {
    const game = this.games.get(room)
    if (!game) 
      return
    game.removePlayer(playerId)
    if (game.players.size === 0) {
      game.stop()
      this.games.delete(room)
    }
  }

  findRoomOf(playerId) {
    const entry = [...this.games.entries()].find(([, game]) => game.players.has(playerId))
    return entry ? entry[0] : null;
  }
}

export default RoomManager;
