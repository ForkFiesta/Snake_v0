import { create } from 'zustand'
import { GameState, Direction, GameMode, Difficulty, Position } from '@/types/game'

interface GameStore extends GameState {
  // Actions
  startGame: () => void
  pauseGame: () => void
  endGame: () => void
  resetGame: () => void
  updateScore: (points: number) => void
  changeDirection: (direction: Direction) => void
  moveSnake: () => void
  generateFood: () => void
  setGameMode: (mode: GameMode) => void
  setDifficulty: (difficulty: Difficulty) => void
}

const initialState: GameState = {
  gameStatus: 'idle',
  score: 0,
  highScore: 0,
  level: 1,
  snake: [{ x: 10, y: 10 }],
  food: { x: 15, y: 15 },
  direction: 'right',
  nextDirection: 'right',
  gameMode: 'classic',
  difficulty: 'medium',
  boardSize: { width: 20, height: 20 }
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  startGame: () => set({ gameStatus: 'playing' }),
  
  pauseGame: () => set({ gameStatus: 'paused' }),
  
  endGame: () => set((state) => ({
    gameStatus: 'gameOver',
    highScore: Math.max(state.score, state.highScore)
  })),
  
  resetGame: () => set(initialState),
  
  updateScore: (points: number) => set((state) => ({
    score: state.score + points
  })),
  
  changeDirection: (direction: Direction) => set({ nextDirection: direction }),
  
  moveSnake: () => {
    // TODO: Implement snake movement logic
    set((state) => ({
      direction: state.nextDirection,
      // Snake movement logic will be implemented here
    }))
  },
  
  generateFood: () => {
    // TODO: Implement food generation logic
    const { boardSize } = get()
    const newFood: Position = {
      x: Math.floor(Math.random() * (boardSize?.width || 20)),
      y: Math.floor(Math.random() * (boardSize?.height || 20))
    }
    set({ food: newFood })
  },
  
  setGameMode: (gameMode: GameMode) => set({ gameMode }),
  
  setDifficulty: (difficulty: Difficulty) => set({ difficulty })
})) 