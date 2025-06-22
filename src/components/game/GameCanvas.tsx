import { useRef, useEffect } from 'react'

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

  useEffect(() => {
    // TODO: Initialize game engine
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Game initialization logic will go here
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`game-canvas ${className}`}
      tabIndex={0}
    />
  )
} 