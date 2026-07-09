import fs from 'fs';
import path from 'path';

// Bonus 
class ScoreStore {
  constructor(filePath = path.join(__dirname, '..', '..', 'data', 'scores.json')) {
    this.filePath = filePath
  }

  load() {
    try {
      const raw = fs.readFileSync(this.filePath, 'utf8')
      return JSON.parse(raw)
    } catch (error) {
      return []
    }
  }

  save(scores) {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true })
    fs.writeFileSync(this.filePath, JSON.stringify(scores, null, 2))
  }

  record(name, score) {
    const scores = this.load()
    scores.push({ name, score, date: new Date().toISOString() })
    this.save(scores)
    return scores
  }

  top(limit = 10) {
    return this.load().slice().sort((a, b) => b.score - a.score).slice(0, limit)
  }
}

export default ScoreStore
