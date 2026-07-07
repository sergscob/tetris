export const JOIN_ROOM = 'room/join'
export const ROOM_STATE = 'room/state'
export const START_GAME = 'room/start'
export const SOCKET_ERROR = 'room/error'
export const SELF_CONNECTED = 'room/selfConnected'

export const joinRoom = (room, playerName, mode) => ({ type: JOIN_ROOM, room, playerName, mode })

export const startGame = (mode) => ({ type: START_GAME, mode })

export const roomStateReceived = (payload) => ({ type: ROOM_STATE, payload })

export const socketErrorReceived = (message) => ({ type: SOCKET_ERROR, message })

export const selfConnected = (selfId) => ({ type: SELF_CONNECTED, selfId })
