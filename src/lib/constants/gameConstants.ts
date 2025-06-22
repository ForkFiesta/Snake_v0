import { GameMode, Difficulty, Theme } from '@/types/game'

export const GAME_MODES: readonly GameMode[] = Object.freeze(['classic', 'timed', 'survival', 'zen'] as const)

export const DIFFICULTIES: readonly Difficulty[] = Object.freeze(['easy', 'medium', 'hard'] as const)

export const THEMES: readonly Theme[] = Object.freeze(['classic', 'dark', 'neon', 'retro'] as const)

export const BOARD_SIZES = Object.freeze({
  small: Object.freeze({ width: 15, height: 15 }),
  medium: Object.freeze({ width: 20, height: 20 }),
  large: Object.freeze({ width: 25, height: 25 })
} as const)

export const GAME_SPEEDS = Object.freeze({
  easy: 200,
  medium: 150,
  hard: 100
} as const)

export const POINTS = Object.freeze({
  FOOD: 10,
  POWERUP: 25,
  BONUS: 50,
  TIME_BONUS: 1
} as const)

export const POWERUP_DURATION = 5000 // 5 seconds

export const INITIAL_SNAKE_LENGTH = 3

export const FOOD_SPAWN_DELAY = 100 // ms

export const MAX_LEVEL = 20

export const LEVEL_UP_THRESHOLD = 100 // points needed to level up 