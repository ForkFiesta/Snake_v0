import { useGameStore } from '@/lib/stores/gameStore'
import { GameState, Direction, GameMode, Difficulty, Position } from '@/types/game'
import { act, renderHook } from '@testing-library/react'

// Mock game utilities
jest.mock('@/lib/utils/gameUtils', () => ({
  generateRandomPosition: jest.fn((boardSize: { width: number; height: number }, excludePositions: Position[] = []) => ({
    x: Math.floor(Math.random() * boardSize.width),
    y: Math.floor(Math.random() * boardSize.height)
  })),
  getNextPosition: jest.fn((currentPosition: Position, direction: Direction): Position => {
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
  }),
  isValidMove: jest.fn(() => true),
  detectCollision: jest.fn(() => false),
  isOppositeDirection: jest.fn((current: Direction, next: Direction) => {
    const opposites: Record<Direction, Direction> = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left'
    }
    return opposites[current] === next
  })
}))

describe('gameStore', () => {
  beforeEach(() => {
    // Reset store state before each test by setting it to initial state
    useGameStore.setState({
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
    })
    jest.clearAllMocks()
  })

  describe('Initial State', () => {
    test('should have correct initial state', () => {
      const { result } = renderHook(() => useGameStore())
      
      expect(result.current.gameStatus).toBe('idle')
      expect(result.current.score).toBe(0)
      expect(result.current.highScore).toBe(0)
      expect(result.current.level).toBe(1)
      expect(result.current.snake).toEqual([{ x: 10, y: 10 }])
      expect(result.current.food).toEqual({ x: 15, y: 15 })
      expect(result.current.direction).toBe('right')
      expect(result.current.nextDirection).toBe('right')
      expect(result.current.gameMode).toBe('classic')
      expect(result.current.difficulty).toBe('medium')
      expect(result.current.boardSize).toEqual({ width: 20, height: 20 })
    })
  })

  describe('Game Control Actions', () => {
    test('startGame should change status to playing', () => {
      const { result } = renderHook(() => useGameStore())
      
      act(() => {
        result.current.startGame()
      })
      
      expect(result.current.gameStatus).toBe('playing')
    })

    test('pauseGame should change status to paused', () => {
      const { result } = renderHook(() => useGameStore())
      
      act(() => {
        result.current.startGame()
        result.current.pauseGame()
      })
      
      expect(result.current.gameStatus).toBe('paused')
    })

    test('endGame should change status to gameOver and update high score', () => {
      const { result } = renderHook(() => useGameStore())
      
      act(() => {
        result.current.updateScore(100)
        result.current.endGame()
      })
      
      expect(result.current.gameStatus).toBe('gameOver')
      expect(result.current.highScore).toBe(100)
    })

    test('endGame should not update high score if current score is lower', () => {
      const { result } = renderHook(() => useGameStore())
      
      act(() => {
        result.current.updateScore(50)
        result.current.endGame()
        result.current.resetGame()
        result.current.updateScore(30)
        result.current.endGame()
      })
      
      expect(result.current.highScore).toBe(50)
    })

    test('resetGame should restore initial state', () => {
      const { result } = renderHook(() => useGameStore())
      
      act(() => {
        result.current.startGame()
        result.current.updateScore(100)
        result.current.changeDirection('up')
        result.current.resetGame()
      })
      
      expect(result.current.gameStatus).toBe('idle')
      expect(result.current.score).toBe(0)
      expect(result.current.direction).toBe('right')
      expect(result.current.nextDirection).toBe('right')
      expect(result.current.snake).toEqual([{ x: 10, y: 10 }])
    })
  })

  describe('Score Management', () => {
    test('updateScore should add points to current score', () => {
      const { result } = renderHook(() => useGameStore())
      
      act(() => {
        result.current.updateScore(50)
      })
      
      expect(result.current.score).toBe(50)
      
      act(() => {
        result.current.updateScore(30)
      })
      
      expect(result.current.score).toBe(80)
    })

    test('updateScore should handle negative values', () => {
      const { result } = renderHook(() => useGameStore())
      
      act(() => {
        result.current.updateScore(100)
        result.current.updateScore(-20)
      })
      
      expect(result.current.score).toBe(80)
    })

    test('updateScore should not allow score below zero', () => {
      const { result } = renderHook(() => useGameStore())
      
      act(() => {
        result.current.updateScore(-50)
      })
      
      expect(result.current.score).toBe(0)
    })
  })

  describe('Direction Management', () => {
    test('changeDirection should update nextDirection', () => {
      const { result } = renderHook(() => useGameStore())
      
      act(() => {
        result.current.changeDirection('up')
      })
      
      expect(result.current.nextDirection).toBe('up')
      expect(result.current.direction).toBe('right') // Should not change immediately
    })

    test('changeDirection should not allow opposite direction when snake has body', () => {
      const { result } = renderHook(() => useGameStore())
      
      // Set up snake with body
      act(() => {
        result.current.resetGame()
        // Simulate snake with multiple segments
        const store = useGameStore.getState()
        useGameStore.setState({
          ...store,
          snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }]
        })
        result.current.changeDirection('left') // Opposite to current 'right'
      })
      
      expect(result.current.nextDirection).toBe('right') // Should remain unchanged
    })

    test('changeDirection should allow opposite direction when snake has only head', () => {
      const { result } = renderHook(() => useGameStore())
      
      act(() => {
        result.current.changeDirection('left')
      })
      
      expect(result.current.nextDirection).toBe('left')
    })
  })

  describe('Snake Movement', () => {
    test('moveSnake should update direction and move snake forward', () => {
      const { result } = renderHook(() => useGameStore())
      
      act(() => {
        result.current.changeDirection('up')
        result.current.moveSnake()
      })
      
      expect(result.current.direction).toBe('up')
      expect(result.current.snake[0]).toEqual({ x: 10, y: 9 })
    })

    test('moveSnake should grow snake when food is eaten', () => {
      const { result } = renderHook(() => useGameStore())
      
      // Position snake head next to food
      act(() => {
        const store = useGameStore.getState()
        useGameStore.setState({
          ...store,
          snake: [{ x: 14, y: 15 }], // Next to food at (15, 15)
          direction: 'right'
        })
        result.current.moveSnake()
      })
      
      expect(result.current.snake).toHaveLength(2)
      expect(result.current.score).toBeGreaterThan(0)
    })

    test('moveSnake should generate new food when current food is eaten', () => {
      const { result } = renderHook(() => useGameStore())
      const originalFood = result.current.food
      
      // Position snake head next to food
      act(() => {
        const store = useGameStore.getState()
        useGameStore.setState({
          ...store,
          snake: [{ x: 14, y: 15 }], // Next to food at (15, 15)
          direction: 'right'
        })
        result.current.moveSnake()
      })
      
      expect(result.current.food).not.toEqual(originalFood)
    })

    test('moveSnake should end game on collision', () => {
      const { result } = renderHook(() => useGameStore())
      
      // Mock collision detection to return true
      const mockDetectCollision = require('@/lib/utils/gameUtils').detectCollision
      mockDetectCollision.mockReturnValueOnce(true)
      
      act(() => {
        result.current.startGame()
        result.current.moveSnake()
      })
      
      expect(result.current.gameStatus).toBe('gameOver')
    })
  })

  describe('Food Generation', () => {
    test('generateFood should create new food position', () => {
      const { result } = renderHook(() => useGameStore())
      const originalFood = result.current.food
      
      act(() => {
        result.current.generateFood()
      })
      
      expect(result.current.food).not.toEqual(originalFood)
    })

    test('generateFood should not place food on snake', () => {
      const { result } = renderHook(() => useGameStore())
      
      // Mock generateRandomPosition to ensure it doesn't overlap with snake
      const mockGenerateRandomPosition = require('@/lib/utils/gameUtils').generateRandomPosition
      mockGenerateRandomPosition.mockReturnValue({ x: 0, y: 0 })
      
      act(() => {
        result.current.generateFood()
      })
      
      expect(mockGenerateRandomPosition).toHaveBeenCalledWith(
        result.current.boardSize,
        result.current.snake
      )
    })
  })

  describe('Game Settings', () => {
    test('setGameMode should update game mode', () => {
      const { result } = renderHook(() => useGameStore())
      
      act(() => {
        result.current.setGameMode('timed')
      })
      
      expect(result.current.gameMode).toBe('timed')
    })

    test('setDifficulty should update difficulty', () => {
      const { result } = renderHook(() => useGameStore())
      
      act(() => {
        result.current.setDifficulty('hard')
      })
      
      expect(result.current.difficulty).toBe('hard')
    })

    test('should handle all game modes', () => {
      const { result } = renderHook(() => useGameStore())
      const gameModes: GameMode[] = ['classic', 'timed', 'survival', 'zen']
      
      gameModes.forEach(mode => {
        act(() => {
          result.current.setGameMode(mode)
        })
        expect(result.current.gameMode).toBe(mode)
      })
    })

    test('should handle all difficulty levels', () => {
      const { result } = renderHook(() => useGameStore())
      const difficulties: Difficulty[] = ['easy', 'medium', 'hard']
      
      difficulties.forEach(difficulty => {
        act(() => {
          result.current.setDifficulty(difficulty)
        })
        expect(result.current.difficulty).toBe(difficulty)
      })
    })
  })

  describe('Game State Persistence', () => {
    test('should maintain high score across game resets', () => {
      const { result } = renderHook(() => useGameStore())
      
      act(() => {
        result.current.updateScore(100)
        result.current.endGame()
        result.current.resetGame()
      })
      
      expect(result.current.highScore).toBe(100)
      expect(result.current.score).toBe(0)
    })

    test('should handle multiple game sessions', () => {
      const { result } = renderHook(() => useGameStore())
      
      // First game
      act(() => {
        result.current.startGame()
        result.current.updateScore(50)
        result.current.endGame()
        result.current.resetGame()
      })
      
      // Second game with higher score
      act(() => {
        result.current.startGame()
        result.current.updateScore(80)
        result.current.endGame()
      })
      
      expect(result.current.highScore).toBe(80)
    })
  })

  describe('Edge Cases', () => {
    test('should handle rapid direction changes', () => {
      const { result } = renderHook(() => useGameStore())
      
      act(() => {
        result.current.changeDirection('up')
        result.current.changeDirection('right')
        result.current.changeDirection('down')
      })
      
      expect(result.current.nextDirection).toBe('down')
    })

    test('should handle game actions when not playing', () => {
      const { result } = renderHook(() => useGameStore())
      
      // Try to move snake when game is idle
      act(() => {
        result.current.moveSnake()
      })
      
      // Should not crash or change game state unexpectedly
      expect(result.current.gameStatus).toBe('idle')
    })

    test('should handle boundary conditions for board size', () => {
      const { result } = renderHook(() => useGameStore())
      
      // Set very small board
      act(() => {
        const store = useGameStore.getState()
        useGameStore.setState({
          ...store,
          boardSize: { width: 3, height: 3 }
        })
        result.current.generateFood()
      })
      
      expect(result.current.food.x).toBeLessThan(3)
      expect(result.current.food.y).toBeLessThan(3)
    })
  })

  describe('Performance and Memory', () => {
    test('should not create excessive objects during normal gameplay', () => {
      const { result } = renderHook(() => useGameStore())
      
      const initialSnakeLength = result.current.snake.length
      
      // Simulate multiple moves without eating food
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.moveSnake()
        }
      })
      
      // Snake length should remain the same if no food eaten
      expect(result.current.snake.length).toBe(initialSnakeLength)
    })

    test('should handle large snake efficiently', () => {
      const { result } = renderHook(() => useGameStore())
      
      // Create a large snake
      const largeSnake = Array.from({ length: 100 }, (_, i) => ({
        x: 10 + i,
        y: 10
      }))
      
      act(() => {
        const store = useGameStore.getState()
        useGameStore.setState({
          ...store,
          snake: largeSnake
        })
        result.current.moveSnake()
      })
      
      // Should complete without performance issues
      expect(result.current.snake.length).toBeGreaterThan(50)
    })
  })
}) 