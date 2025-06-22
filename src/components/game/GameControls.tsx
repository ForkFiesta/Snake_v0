interface GameControlsProps {
  onStart: () => void
  onPause: () => void
  onRestart: () => void
  gameStatus: 'idle' | 'playing' | 'paused' | 'gameOver'
}

export function GameControls({ 
  onStart, 
  onPause, 
  onRestart, 
  gameStatus 
}: GameControlsProps) {
  return (
    <div className="game-controls">
      {gameStatus === 'idle' && (
        <button onClick={onStart} className="btn btn-primary">
          Start Game
        </button>
      )}
      {gameStatus === 'playing' && (
        <button onClick={onPause} className="btn btn-secondary">
          Pause
        </button>
      )}
      {gameStatus === 'paused' && (
        <button onClick={onStart} className="btn btn-primary">
          Resume
        </button>
      )}
      {(gameStatus === 'gameOver' || gameStatus === 'paused') && (
        <button onClick={onRestart} className="btn btn-danger">
          Restart
        </button>
      )}
    </div>
  )
} 