// Mock implementation of game utilities for testing
// This shows the expected API for the game utilities
const mockGameUtils = {
  calculateScore: (foodEaten: number, timeBonus: number, multiplier: number = 1): number => {
    if (foodEaten < 0 || timeBonus < 0) return 0
    return (foodEaten * 10 + timeBonus) * multiplier
  },
  
  isValidMove: (position: { x: number; y: number }, boardSize: { width: number; height: number }): boolean => {
    return position.x >= 0 && position.x < boardSize.width && 
           position.y >= 0 && position.y < boardSize.height
  },
  
  detectCollision: (
    position: { x: number; y: number }, 
    snake: Array<{ x: number; y: number }>, 
    boardSize: { width: number; height: number }
  ): boolean => {
    // Wall collision
    if (!mockGameUtils.isValidMove(position, boardSize)) return true
    
    // Self collision
    return snake.some(segment => segment.x === position.x && segment.y === position.y)
  },
  
  generateFood: (
    snake: Array<{ x: number; y: number }>, 
    boardSize: { width: number; height: number }
  ): { x: number; y: number } => {
    let food: { x: number; y: number }
    let attempts = 0
    const maxAttempts = 100
    
    do {
      food = {
        x: Math.floor(Math.random() * boardSize.width),
        y: Math.floor(Math.random() * boardSize.height)
      }
      attempts++
    } while (
      attempts < maxAttempts && 
      snake.some(segment => segment.x === food.x && segment.y === food.y)
    )
    
    return food
  },
  
  getNextSnakePosition: (
    snake: Array<{ x: number; y: number }>, 
    direction: 'up' | 'down' | 'left' | 'right'
  ): { x: number; y: number } => {
    const head = snake[0]
    switch (direction) {
      case 'up': return { x: head.x, y: head.y - 1 }
      case 'down': return { x: head.x, y: head.y + 1 }
      case 'left': return { x: head.x - 1, y: head.y }
      case 'right': return { x: head.x + 1, y: head.y }
      default: return head
    }
  },
  
  isOppositeDirection: (
    current: 'up' | 'down' | 'left' | 'right', 
    next: 'up' | 'down' | 'left' | 'right'
  ): boolean => {
    const opposites = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left'
    }
    return opposites[current] === next
  }
}

// This file demonstrates comprehensive unit testing patterns

describe('gameUtils', () => {
  describe('calculateScore', () => {
    test('should calculate basic score correctly', () => {
      const result = mockGameUtils.calculateScore(5, 100)
      expect(result).toBe(150) // 5 food * 10 + 100 time bonus
    })
    
    test('should apply multiplier correctly', () => {
      const result = mockGameUtils.calculateScore(5, 100, 2)
      expect(result).toBe(300) // (5 * 10 + 100) * 2
    })
    
    test('should handle zero values', () => {
      expect(mockGameUtils.calculateScore(0, 0)).toBe(0)
      expect(mockGameUtils.calculateScore(0, 50)).toBe(50)
      expect(mockGameUtils.calculateScore(3, 0)).toBe(30)
    })
    
    test('should handle negative values by returning 0', () => {
      expect(mockGameUtils.calculateScore(-1, 50)).toBe(0)
      expect(mockGameUtils.calculateScore(5, -10)).toBe(0)
      expect(mockGameUtils.calculateScore(-1, -10)).toBe(0)
    })
    
    test('should handle large numbers', () => {
      const result = mockGameUtils.calculateScore(100, 1000)
      expect(result).toBe(2000)
    })
  })
  
  describe('isValidMove', () => {
    const boardSize = { width: 20, height: 20 }
    
    test('should return true for valid positions', () => {
      expect(mockGameUtils.isValidMove({ x: 0, y: 0 }, boardSize)).toBe(true)
      expect(mockGameUtils.isValidMove({ x: 10, y: 10 }, boardSize)).toBe(true)
      expect(mockGameUtils.isValidMove({ x: 19, y: 19 }, boardSize)).toBe(true)
    })
    
    test('should return false for positions outside board', () => {
      expect(mockGameUtils.isValidMove({ x: -1, y: 10 }, boardSize)).toBe(false)
      expect(mockGameUtils.isValidMove({ x: 10, y: -1 }, boardSize)).toBe(false)
      expect(mockGameUtils.isValidMove({ x: 20, y: 10 }, boardSize)).toBe(false)
      expect(mockGameUtils.isValidMove({ x: 10, y: 20 }, boardSize)).toBe(false)
    })
    
    test('should handle edge cases', () => {
      const smallBoard = { width: 1, height: 1 }
      expect(mockGameUtils.isValidMove({ x: 0, y: 0 }, smallBoard)).toBe(true)
      expect(mockGameUtils.isValidMove({ x: 1, y: 0 }, smallBoard)).toBe(false)
    })
  })
  
  describe('detectCollision', () => {
    const boardSize = { width: 20, height: 20 }
    const snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }]
    
    test('should detect wall collision', () => {
      expect(mockGameUtils.detectCollision({ x: -1, y: 5 }, snake, boardSize)).toBe(true)
      expect(mockGameUtils.detectCollision({ x: 20, y: 5 }, snake, boardSize)).toBe(true)
      expect(mockGameUtils.detectCollision({ x: 5, y: -1 }, snake, boardSize)).toBe(true)
      expect(mockGameUtils.detectCollision({ x: 5, y: 20 }, snake, boardSize)).toBe(true)
    })
    
    test('should detect self collision', () => {
      expect(mockGameUtils.detectCollision({ x: 4, y: 5 }, snake, boardSize)).toBe(true)
      expect(mockGameUtils.detectCollision({ x: 3, y: 5 }, snake, boardSize)).toBe(true)
      expect(mockGameUtils.detectCollision({ x: 5, y: 5 }, snake, boardSize)).toBe(true)
    })
    
    test('should return false for valid positions', () => {
      expect(mockGameUtils.detectCollision({ x: 6, y: 5 }, snake, boardSize)).toBe(false)
      expect(mockGameUtils.detectCollision({ x: 5, y: 4 }, snake, boardSize)).toBe(false)
      expect(mockGameUtils.detectCollision({ x: 10, y: 10 }, snake, boardSize)).toBe(false)
    })
    
    test('should handle empty snake', () => {
      expect(mockGameUtils.detectCollision({ x: 10, y: 10 }, [], boardSize)).toBe(false)
    })
  })
  
  describe('generateFood', () => {
    const boardSize = { width: 5, height: 5 }
    
    test('should generate food within board boundaries', () => {
      const snake = [{ x: 0, y: 0 }]
      const food = mockGameUtils.generateFood(snake, boardSize)
      
      expect(food.x).toBeGreaterThanOrEqual(0)
      expect(food.x).toBeLessThan(boardSize.width)
      expect(food.y).toBeGreaterThanOrEqual(0)
      expect(food.y).toBeLessThan(boardSize.height)
    })
    
    test('should not generate food on snake position', () => {
      const snake = [{ x: 2, y: 2 }, { x: 1, y: 2 }]
      const food = mockGameUtils.generateFood(snake, boardSize)
      
      const isOnSnake = snake.some(segment => 
        segment.x === food.x && segment.y === food.y
      )
      expect(isOnSnake).toBe(false)
    })
    
    test('should handle full board scenario', () => {
      // Create a snake that fills most of the board
      const snake = []
      for (let x = 0; x < boardSize.width; x++) {
        for (let y = 0; y < boardSize.height - 1; y++) {
          snake.push({ x, y })
        }
      }
      
      const food = mockGameUtils.generateFood(snake, boardSize)
      expect(food.y).toBe(boardSize.height - 1) // Should be in the last row
    })
  })
  
  describe('getNextSnakePosition', () => {
    const snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }]
    
    test('should calculate next position for each direction', () => {
      expect(mockGameUtils.getNextSnakePosition(snake, 'up')).toEqual({ x: 5, y: 4 })
      expect(mockGameUtils.getNextSnakePosition(snake, 'down')).toEqual({ x: 5, y: 6 })
      expect(mockGameUtils.getNextSnakePosition(snake, 'left')).toEqual({ x: 4, y: 5 })
      expect(mockGameUtils.getNextSnakePosition(snake, 'right')).toEqual({ x: 6, y: 5 })
    })
    
    test('should handle single segment snake', () => {
      const singleSnake = [{ x: 10, y: 10 }]
      expect(mockGameUtils.getNextSnakePosition(singleSnake, 'up')).toEqual({ x: 10, y: 9 })
    })
  })
  
  describe('isOppositeDirection', () => {
    test('should detect opposite directions', () => {
      expect(mockGameUtils.isOppositeDirection('up', 'down')).toBe(true)
      expect(mockGameUtils.isOppositeDirection('down', 'up')).toBe(true)
      expect(mockGameUtils.isOppositeDirection('left', 'right')).toBe(true)
      expect(mockGameUtils.isOppositeDirection('right', 'left')).toBe(true)
    })
    
    test('should return false for non-opposite directions', () => {
      expect(mockGameUtils.isOppositeDirection('up', 'left')).toBe(false)
      expect(mockGameUtils.isOppositeDirection('up', 'right')).toBe(false)
      expect(mockGameUtils.isOppositeDirection('down', 'left')).toBe(false)
      expect(mockGameUtils.isOppositeDirection('down', 'right')).toBe(false)
    })
    
    test('should return false for same direction', () => {
      expect(mockGameUtils.isOppositeDirection('up', 'up')).toBe(false)
      expect(mockGameUtils.isOppositeDirection('down', 'down')).toBe(false)
      expect(mockGameUtils.isOppositeDirection('left', 'left')).toBe(false)
      expect(mockGameUtils.isOppositeDirection('right', 'right')).toBe(false)
    })
  })
  
  describe('performance tests', () => {
    test('generateFood should complete within reasonable time', () => {
      const boardSize = { width: 50, height: 50 }
      const snake = [{ x: 0, y: 0 }]
      
      const startTime = performance.now()
      mockGameUtils.generateFood(snake, boardSize)
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(10) // Should complete in less than 10ms
    })
    
    test('detectCollision should handle large snake efficiently', () => {
      const boardSize = { width: 100, height: 100 }
      const largeSnake = Array.from({ length: 1000 }, (_, i) => ({ 
        x: i % boardSize.width, 
        y: Math.floor(i / boardSize.width) 
      }))
      
      const startTime = performance.now()
      mockGameUtils.detectCollision({ x: 50, y: 50 }, largeSnake, boardSize)
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(5) // Should complete in less than 5ms
    })
  })
}) 