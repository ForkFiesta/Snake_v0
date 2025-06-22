import { useEffect } from 'react'
import { Direction } from '@/types/game'

interface UseKeyboardControlsProps {
  onDirectionChange: (direction: Direction) => void
  enabled?: boolean
}

export function useKeyboardControls({ 
  onDirectionChange, 
  enabled = true 
}: UseKeyboardControlsProps) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          event.preventDefault()
          onDirectionChange('up')
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          event.preventDefault()
          onDirectionChange('down')
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          event.preventDefault()
          onDirectionChange('left')
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          event.preventDefault()
          onDirectionChange('right')
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onDirectionChange, enabled])
} 