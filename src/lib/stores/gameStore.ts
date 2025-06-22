import { create } from 'zustand'
import { GameState, Direction, GameMode, Difficulty, Position } from '@/types/game'
import { 
  generateRandomPosition, 
  getNextPosition, 
  detectCollision, 
  isOppositeDirection 
} from '@/lib/utils/gameUtils'

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
  
  resetGame: () => set((state) => ({
    ...initialState,
    highScore: state.highScore // Preserve high score across resets
  })),
  
  updateScore: (points: number) => set((state) => ({
    score: Math.max(0, state.score + points) // Prevent negative scores
  })),
  
  changeDirection: (direction: Direction) => set((state) => {
    // Don't allow opposite direction if snake has more than one segment
    if (state.snake.length > 1 && isOppositeDirection(state.direction, direction)) {
      return state
    }
    return { nextDirection: direction }
  }),
  
  moveSnake: () => {
    const state = get()
    
    // Update direction to next direction first
    const newDirection = state.nextDirection
    const head = state.snake[0]
    const newHead = getNextPosition(head, newDirection)
    
    // Check for collisions
    if (detectCollision(newHead, state.snake, state.boardSize!)) {
      set({ gameStatus: 'gameOver', highScore: Math.max(state.score, state.highScore) })
      return
    }
    
    // Check if food is eaten
    const foodEaten = newHead.x === state.food.x && newHead.y === state.food.y
    
    // Create new snake
    const newSnake = [newHead, ...state.snake]
    if (!foodEaten) {
      newSnake.pop() // Remove tail if no food eaten
    }
    
    // Update state
    set((currentState) => ({
      direction: newDirection,
      snake: newSnake,
      score: foodEaten ? currentState.score + 10 : currentState.score,
      food: foodEaten ? generateRandomPosition(currentState.boardSize!, newSnake) : currentState.food
    }))
  },
  
  generateFood: () => {
    const { boardSize, snake } = get()
    const newFood = generateRandomPosition(boardSize!, snake)
    set({ food: newFood })
  },
  
  setGameMode: (gameMode: GameMode) => set({ gameMode }),
  
  setDifficulty: (difficulty: Difficulty) => set({ difficulty })
})) 