interface GameMenuProps {
  isVisible: boolean
  onClose: () => void
  onRestart: () => void
  onSettings: () => void
}

export function GameMenu({ 
  isVisible, 
  onClose, 
  onRestart, 
  onSettings 
}: GameMenuProps) {
  if (!isVisible) return null

  return (
    <div className="game-menu-overlay">
      <div className="game-menu">
        <h2>Game Menu</h2>
        <button onClick={onClose} className="btn btn-primary">
          Resume
        </button>
        <button onClick={onRestart} className="btn btn-secondary">
          Restart
        </button>
        <button onClick={onSettings} className="btn btn-secondary">
          Settings
        </button>
      </div>
    </div>
  )
} 