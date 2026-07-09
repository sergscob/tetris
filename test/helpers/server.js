import * as server from '../../src/server/index';



export const createInMemoryScoreStore = () => {
  const scores = []
  return {
    record: (name, score) => { scores.push({ name, score, date: new Date().toISOString() }); },
    top: (limit = 10) => scores.slice().sort((a, b) => b.score - a.score).slice(0, limit),
  }
}

export const startServer = (overrides = {}) => server.createServer(
  { host: '127.0.0.1', port: 0, ...overrides },
  { scoreStore: createInMemoryScoreStore() },
)
