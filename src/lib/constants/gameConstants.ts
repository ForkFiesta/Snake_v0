import { GameMode, Difficulty, Theme } from '@/types/game'

export const GAME_MODES: GameMode[] = ['classic', 'timed', 'survival', 'zen']

export const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']

export const THEMES: Theme[] = ['classic', 'dark', 'neon', 'retro']

export const BOARD_SIZES = {
  small: { width: 15, height: 15 },
  medium: { width: 20, height: 20 },
  large: { width: 25, height: 25 }
}

export const GAME_SPEEDS = {
  easy: 200,
  medium: 150,
  hard: 100
}

export const POINTS = {
  FOOD: 10,
  POWERUP: 25,
  BONUS: 50,
  TIME_BONUS: 1
}

export const POWERUP_DURATION = 5000 // 5 seconds

export const INITIAL_SNAKE_LENGTH = 3

export const FOOD_SPAWN_DELAY = 100 // ms

export const MAX_LEVEL = 20

export const LEVEL_UP_THRESHOLD = 100 // points needed to level up 