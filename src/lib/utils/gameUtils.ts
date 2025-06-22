import { Position, Direction, GameSession } from '@/types/game'

export function calculateScore(foodEaten: number, timeBonus: number): number {
  return foodEaten * 10 + timeBonus
}

export function isValidMove(
  newPosition: Position, 
  snake: Position[], 
  boardSize: { width: number; height: number }
): boolean {
  // Check wall collision
  if (
    newPosition.x < 0 || 
    newPosition.x >= boardSize.width ||
    newPosition.y < 0 || 
    newPosition.y >= boardSize.height
  ) {
    return false
  }

  // Check self collision
  return !snake.some(segment => 
    segment.x === newPosition.x && segment.y === newPosition.y
  )
}

export function detectCollision(
  position: Position,
  snake: Position[],
  boardSize: { width: number; height: number }
): boolean {
  return !isValidMove(position, snake, boardSize)
}

export function getNextPosition(currentPosition: Position, direction: Direction): Position {
  const moves = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
  }

  const move = moves[direction]
  return {
    x: currentPosition.x + move.x,
    y: currentPosition.y + move.y
  }
}

export function generateRandomPosition(
  boardSize: { width: number; height: number },
  excludePositions: Position[] = []
): Position {
  let position: Position
  let attempts = 0
  const maxAttempts = 100

  do {
    position = {
      x: Math.floor(Math.random() * boardSize.width),
      y: Math.floor(Math.random() * boardSize.height)
    }
    attempts++
  } while (
    attempts < maxAttempts &&
    excludePositions.some(pos => pos.x === position.x && pos.y === position.y)
  )

  return position
}

export function isOppositeDirection(current: Direction, next: Direction): boolean {
  const opposites: Record<Direction, Direction> = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left'
  }
  
  return opposites[current] === next
}

export function calculateGameSpeed(level: number, difficulty: string): number {
  const baseSpeed = 200
  const speedMultipliers = {
    easy: 0.8,
    medium: 1.0,
    hard: 1.3
  }
  
  const multiplier = speedMultipliers[difficulty as keyof typeof speedMultipliers] || 1.0
  return Math.max(50, baseSpeed - (level * 10)) * multiplier
} 