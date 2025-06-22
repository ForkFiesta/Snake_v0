export interface Position {
  x: number
  y: number
}

export interface SnakeSegment extends Position {
  id?: string
}

export interface Food extends Position {
  type?: 'normal' | 'powerup' | 'bonus'
  value?: number
  effect?: PowerUpEffect
}

export interface PowerUpEffect {
  type: 'slow' | 'fast' | 'invincible' | 'double_points'
  duration: number
}

export type Direction = 'up' | 'down' | 'left' | 'right'

export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameOver'

export type GameMode = 'classic' | 'timed' | 'survival' | 'zen'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type Theme = 'classic' | 'dark' | 'neon' | 'retro'

export interface GameState {
  gameStatus: GameStatus
  score: number
  highScore: number
  level: number
  snake: Position[]
  food: Position
  direction: Direction
  nextDirection: Direction
  gameMode?: GameMode
  difficulty?: Difficulty
  boardSize?: { width: number; height: number }
}

export interface GameSession {
  id: string
  userId?: string
  score: number
  duration: number
  gameMode: GameMode
  difficulty: Difficulty
  startTime: Date
  endTime: Date
  moves: number
  foodConsumed: number
}

export interface BoardSize {
  width: number
  height: number
} 