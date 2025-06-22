import { cn } from '@/lib/utils'

interface GameControlsProps {
  onStart: () => void
  onPause: () => void
  onRestart: () => void
  gameStatus: 'idle' | 'playing' | 'paused' | 'gameOver'
  className?: string
  'data-testid'?: string
}

export function GameControls({ 
  onStart, 
  onPause, 
  onRestart, 
  gameStatus,
  className,
  'data-testid': dataTestId
}: GameControlsProps) {
  // Safe callback wrapper to handle potential errors gracefully
  const safeCallback = (callback: (() => void) | undefined) => {
    return () => {
      if (typeof callback === 'function') {
        try {
          callback()
        } catch (error) {
          console.error('GameControls callback error:', error)
          // Log error but don't crash the component
          // In production, we want graceful degradation
        }
      }
    }
  }

  return (
    <div 
      className={cn('game-controls', className)}
      data-testid={dataTestId}
    >
      {gameStatus === 'idle' && (
        <button 
          type="button"
          onClick={safeCallback(onStart)} 
          className="btn btn-primary"
        >
          Start Game
        </button>
      )}
      {gameStatus === 'playing' && (
        <button 
          type="button"
          onClick={safeCallback(onPause)} 
          className="btn btn-secondary"
        >
          Pause
        </button>
      )}
      {gameStatus === 'paused' && (
        <button 
          type="button"
          onClick={safeCallback(onStart)} 
          className="btn btn-primary"
        >
          Resume
        </button>
      )}
      {(gameStatus === 'gameOver' || gameStatus === 'paused') && (
        <button 
          type="button"
          onClick={safeCallback(onRestart)} 
          className="btn btn-danger"
        >
          Restart
        </button>
      )}
    </div>
  )
} 