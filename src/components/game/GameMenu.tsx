import React from 'react'
import { Button } from '@/components/ui/Button'

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

  // Handle keyboard events for accessibility
  const handleKeyDown = (event: React.KeyboardEvent, callback: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      callback()
    }
  }

  return (
    <div className="game-menu-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="game-menu bg-white rounded-lg shadow-xl p-6 min-w-[300px] max-w-md mx-4">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Game Menu</h2>
        <div className="space-y-3">
          <Button 
            onClick={onClose} 
            variant="primary"
            className="w-full"
            onKeyDown={(e) => handleKeyDown(e, onClose)}
          >
            Resume
          </Button>
          <Button 
            onClick={onRestart} 
            variant="secondary"
            className="w-full"
            onKeyDown={(e) => handleKeyDown(e, onRestart)}
          >
            Restart
          </Button>
          <Button 
            onClick={onSettings} 
            variant="secondary"
            className="w-full"
            onKeyDown={(e) => handleKeyDown(e, onSettings)}
          >
            Settings
          </Button>
        </div>
      </div>
    </div>
  )
} 