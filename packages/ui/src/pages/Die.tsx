import { useState } from 'react';
import { Die as DieClass, DieType } from '@platonic-dice/dice';
import type { RollRecord } from '@platonic-dice/dice';
import './Die.css';

export function Die() {
  const [d20] = useState(() => new DieClass(DieType.D20));
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);

  const handleRoll = () => {
    const roll = d20.roll();
    setResult(roll);
    const rollHistory = d20.history() as RollRecord[];
    setHistory(rollHistory.map(r => r.roll));
  };

  return (
    <div className="page-container">
      <h1>Die Class Demo</h1>
      <p>Interactive demonstration of the Die class from @platonic-dice/dice</p>

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
    </div>
  );
}
