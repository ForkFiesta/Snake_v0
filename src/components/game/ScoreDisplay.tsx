interface ScoreDisplayProps {
  currentScore: number
  highScore: number
  level?: number
}

export function ScoreDisplay({ 
  currentScore, 
  highScore, 
  level = 1 
}: ScoreDisplayProps) {
  return (
    <div className="score-display">
      <div className="score-item">
        <span className="score-label">Score:</span>
        <span className="score-value">{currentScore}</span>
      </div>
      <div className="score-item">
        <span className="score-label">High Score:</span>
        <span className="score-value">{highScore}</span>
      </div>
      <div className="score-item">
        <span className="score-label">Level:</span>
        <span className="score-value">{level}</span>
      </div>
    </div>
  )
} 