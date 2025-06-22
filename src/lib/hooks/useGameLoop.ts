import { useEffect, useRef, useCallback } from 'react'
import { useGameStore } from '@/lib/stores/gameStore'

export function useGameLoop() {
  const animationRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  const gameStore = useGameStore()

  const gameLoop = useCallback((currentTime: number) => {
    const deltaTime = currentTime - lastTimeRef.current

    if (deltaTime >= 150) { // Game speed: ~150ms per frame
      // Update game state
      if (gameStore.gameStatus === 'playing') {
        try {
          gameStore.moveSnake()
        } catch (error) {
          // Handle errors gracefully to prevent loop crashes
          console.error('Game loop error:', error)
        }
      }
      lastTimeRef.current = currentTime
    }

    if (gameStore.gameStatus === 'playing') {
      animationRef.current = requestAnimationFrame(gameLoop)
    }
  }, [gameStore])

  const startLoop = useCallback(() => {
    if (animationRef.current) {
      if (typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(animationRef.current)
      }
    }
    lastTimeRef.current = performance.now()
    animationRef.current = requestAnimationFrame(gameLoop)
  }, [gameLoop])

  const stopLoop = useCallback(() => {
    if (animationRef.current) {
      if (typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(animationRef.current)
      }
      animationRef.current = undefined
    }
  }, [])

  useEffect(() => {
    if (gameStore.gameStatus === 'playing') {
      startLoop()
    } else {
      stopLoop()
    }

    return stopLoop
  }, [gameStore.gameStatus, startLoop, stopLoop])

  return { startLoop, stopLoop }
} 