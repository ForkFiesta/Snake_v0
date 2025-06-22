import { useRef, useEffect, useCallback, useMemo } from 'react'
import { GameEngine } from '@/lib/game-engine/GameEngine'
import { useGameStore } from '@/lib/stores/gameStore'
import { Direction } from '@/types/game'
import { cn } from '@/lib/utils'

interface GameCanvasProps {
  width: number
  height: number
  onGameOver?: (score: number) => void
  className?: string
}

export function GameCanvas({ 
  width, 
  height, 
  onGameOver, 
  className = '' 
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameEngineRef = useRef<GameEngine | null>(null)
  const gameStore = useGameStore()

  // Memoize canvas dimensions to avoid unnecessary re-initializations
  const canvasDimensions = useMemo(() => ({ width, height }), [width, height])

  // Initialize game engine
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        console.error('Could not get 2D context from canvas')
        return
      }

      // Clean up previous game engine
      if (gameEngineRef.current) {
        gameEngineRef.current.endGame()
      }

      // Create new game engine
      gameEngineRef.current = new GameEngine(canvas, onGameOver)
    } catch (error) {
      console.error('Failed to initialize GameEngine:', error)
    }

    // Cleanup on unmount or dimension change
    return () => {
      if (gameEngineRef.current) {
        gameEngineRef.current.endGame()
        gameEngineRef.current = null
      }
    }
  }, [canvasDimensions, onGameOver])

  // Handle game state changes
  useEffect(() => {
    const gameEngine = gameEngineRef.current
    if (!gameEngine) return

    switch (gameStore.gameStatus) {
      case 'playing':
        gameEngine.startGame()
        break
      case 'paused':
        gameEngine.pauseGame()
        break
      case 'gameOver':
        gameEngine.endGame()
        // Call onGameOver callback with current score
        if (onGameOver) {
          onGameOver(gameStore.score)
        }
        break
    }
  }, [gameStore.gameStatus, gameStore.score, onGameOver])

  // Handle keyboard controls
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const gameEngine = gameEngineRef.current
    if (!gameEngine) return

    let direction: Direction | null = null

    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        direction = 'up'
        break
      case 'ArrowDown':
      case 's':
      case 'S':
        direction = 'down'
        break
      case 'ArrowLeft':
      case 'a':
      case 'A':
        direction = 'left'
        break
      case 'ArrowRight':
      case 'd':
      case 'D':
        direction = 'right'
        break
    }

    if (direction) {
      event.preventDefault()
      gameEngine.changeDirection(direction)
    }
  }, [])

  // Set up keyboard event listeners
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.addEventListener('keydown', handleKeyDown)
    
    return () => {
      canvas.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={cn('game-canvas', className)}
      tabIndex={0}
      role="img"
      aria-label="Snake game canvas"
    />
  )
} 