import { useState } from 'react'
import { Die, DieType } from '@platonic-dice/dice'
import type { RollRecord } from '@platonic-dice/dice'
import './styles/App.css'

function App() {
  const [d20] = useState(() => new Die(DieType.D20))
  const [result, setResult] = useState<number | null>(null)
  const [history, setHistory] = useState<number[]>([])

  const handleRoll = () => {
    const roll = d20.roll()
    setResult(roll)
    const rollHistory = d20.history() as RollRecord[]
    setHistory(rollHistory.map(r => r.roll))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎲 Platonic Dice</h1>
        <p>Interactive Dice Rolling Demo</p>
        <div className="version-badge">v0.0.1 - PREVIEW</div>
      </header>

      <main className="app-main">
        <section className="demo-section">
          <h2>Roll a D20</h2>
          <button onClick={handleRoll} className="roll-button">
            Roll D20
          </button>
          
          {result !== null && (
            <div className="result">
              <span className="result-label">Result:</span>
              <span className="result-value">{result}</span>
            </div>
          )}

          {history.length > 0 && (
            <div className="history">
              <h3>Roll History</h3>
              <div className="history-list">
                {history.map((roll, i) => (
                  <span key={i} className="history-item">
                    {roll}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>
          Built with{' '}
          <a
            href="https://github.com/sjs2k20/platonic-dice"
            target="_blank"
            rel="noopener noreferrer"
          >
            @platonic-dice
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App
