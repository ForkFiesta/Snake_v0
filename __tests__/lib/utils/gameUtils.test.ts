import { 
  calculateScore, 
  isValidMove, 
  detectCollision, 
  getNextPosition, 
  generateRandomPosition, 
  isOppositeDirection, 
  calculateGameSpeed 
} from '@/lib/utils/gameUtils'
import { Position, Direction } from '@/types/game'

describe('gameUtils', () => {
  describe('calculateScore', () => {
    test('should calculate basic score correctly', () => {
      const result = calculateScore(5, 100)
      expect(result).toBe(150) // 5 food * 10 + 100 time bonus
    })
    
    test('should handle zero values', () => {
      expect(calculateScore(0, 0)).toBe(0)
      expect(calculateScore(0, 50)).toBe(50)
      expect(calculateScore(3, 0)).toBe(30)
    })
    
    test('should handle negative values correctly', () => {
      expect(calculateScore(-1, 50)).toBe(40) // -10 + 50
      expect(calculateScore(5, -10)).toBe(40) // 50 + (-10)
      expect(calculateScore(-1, -10)).toBe(-20) // -10 + (-10)
    })
    
    test('should handle large numbers', () => {
      const result = calculateScore(100, 1000)
      expect(result).toBe(2000)
    })
    
    test('should handle decimal inputs', () => {
      const result = calculateScore(2.5, 25.5)
      expect(result).toBe(50.5) // 2.5 * 10 + 25.5
    })
  })
  
  describe('isValidMove', () => {
    const boardSize = { width: 20, height: 20 }
    const snake: Position[] = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }]
    
    test('should return true for valid positions', () => {
      expect(isValidMove({ x: 0, y: 0 }, snake, boardSize)).toBe(true)
      expect(isValidMove({ x: 10, y: 10 }, snake, boardSize)).toBe(true)
      expect(isValidMove({ x: 19, y: 19 }, snake, boardSize)).toBe(true)
    })
    
    test('should return false for positions outside board', () => {
      expect(isValidMove({ x: -1, y: 10 }, snake, boardSize)).toBe(false)
      expect(isValidMove({ x: 10, y: -1 }, snake, boardSize)).toBe(false)
      expect(isValidMove({ x: 20, y: 10 }, snake, boardSize)).toBe(false)
      expect(isValidMove({ x: 10, y: 20 }, snake, boardSize)).toBe(false)
    })
    
    test('should return false for positions on snake', () => {
      expect(isValidMove({ x: 5, y: 5 }, snake, boardSize)).toBe(false)
      expect(isValidMove({ x: 4, y: 5 }, snake, boardSize)).toBe(false)
      expect(isValidMove({ x: 3, y: 5 }, snake, boardSize)).toBe(false)
    })
    
    test('should handle edge cases', () => {
      const smallBoard = { width: 1, height: 1 }
      const emptySnake: Position[] = []
      expect(isValidMove({ x: 0, y: 0 }, emptySnake, smallBoard)).toBe(true)
      expect(isValidMove({ x: 1, y: 0 }, emptySnake, smallBoard)).toBe(false)
    })
    
    test('should handle empty snake', () => {
      const emptySnake: Position[] = []
      expect(isValidMove({ x: 10, y: 10 }, emptySnake, boardSize)).toBe(true)
    })
  })
  
  describe('detectCollision', () => {
    const boardSize = { width: 20, height: 20 }
    const snake: Position[] = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }]
    
    test('should detect wall collision', () => {
      expect(detectCollision({ x: -1, y: 5 }, snake, boardSize)).toBe(true)
      expect(detectCollision({ x: 20, y: 5 }, snake, boardSize)).toBe(true)
      expect(detectCollision({ x: 5, y: -1 }, snake, boardSize)).toBe(true)
      expect(detectCollision({ x: 5, y: 20 }, snake, boardSize)).toBe(true)
    })
    
    test('should detect self collision', () => {
      expect(detectCollision({ x: 4, y: 5 }, snake, boardSize)).toBe(true)
      expect(detectCollision({ x: 3, y: 5 }, snake, boardSize)).toBe(true)
      expect(detectCollision({ x: 5, y: 5 }, snake, boardSize)).toBe(true)
    })
    
    test('should return false for valid positions', () => {
      expect(detectCollision({ x: 6, y: 5 }, snake, boardSize)).toBe(false)
      expect(detectCollision({ x: 5, y: 4 }, snake, boardSize)).toBe(false)
      expect(detectCollision({ x: 10, y: 10 }, snake, boardSize)).toBe(false)
    })
    
    test('should handle empty snake', () => {
      const emptySnake: Position[] = []
      expect(detectCollision({ x: 10, y: 10 }, emptySnake, boardSize)).toBe(false)
      expect(detectCollision({ x: -1, y: 10 }, emptySnake, boardSize)).toBe(true) // Still wall collision
    })
  })
  
  describe('getNextPosition', () => {
    const currentPosition: Position = { x: 5, y: 5 }
    
    test('should calculate next position for each direction', () => {
      expect(getNextPosition(currentPosition, 'up')).toEqual({ x: 5, y: 4 })
      expect(getNextPosition(currentPosition, 'down')).toEqual({ x: 5, y: 6 })
      expect(getNextPosition(currentPosition, 'left')).toEqual({ x: 4, y: 5 })
      expect(getNextPosition(currentPosition, 'right')).toEqual({ x: 6, y: 5 })
    })
    
    test('should handle edge positions', () => {
      const edgePosition: Position = { x: 0, y: 0 }
      expect(getNextPosition(edgePosition, 'up')).toEqual({ x: 0, y: -1 })
      expect(getNextPosition(edgePosition, 'left')).toEqual({ x: -1, y: 0 })
    })
    
    test('should not mutate original position', () => {
      const originalPosition: Position = { x: 5, y: 5 }
      const nextPosition = getNextPosition(originalPosition, 'up')
      
      expect(originalPosition).toEqual({ x: 5, y: 5 })
      expect(nextPosition).not.toBe(originalPosition)
    })
  })
  
  describe('generateRandomPosition', () => {
    const boardSize = { width: 10, height: 10 }
    
    test('should generate position within board boundaries', () => {
      const position = generateRandomPosition(boardSize)
      
      expect(position.x).toBeGreaterThanOrEqual(0)
      expect(position.x).toBeLessThan(boardSize.width)
      expect(position.y).toBeGreaterThanOrEqual(0)
      expect(position.y).toBeLessThan(boardSize.height)
    })
    
    test('should avoid excluded positions', () => {
      const excludePositions: Position[] = [
        { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }
      ]
      
      // Run multiple times to ensure exclusion works
      for (let i = 0; i < 10; i++) {
        const position = generateRandomPosition(boardSize, excludePositions)
        const isExcluded = excludePositions.some(pos => 
          pos.x === position.x && pos.y === position.y
        )
        expect(isExcluded).toBe(false)
      }
    })
    
    test('should handle empty exclude list', () => {
      const position = generateRandomPosition(boardSize, [])
      
      expect(position.x).toBeGreaterThanOrEqual(0)
      expect(position.x).toBeLessThan(boardSize.width)
      expect(position.y).toBeGreaterThanOrEqual(0)
      expect(position.y).toBeLessThan(boardSize.height)
    })
    
    test('should handle small board with many exclusions', () => {
      const smallBoard = { width: 3, height: 3 }
      const excludePositions: Position[] = [
        { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },
        { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 },
        { x: 0, y: 2 }, { x: 1, y: 2 }
        // Leave { x: 2, y: 2 } available
      ]
      
      const position = generateRandomPosition(smallBoard, excludePositions)
      expect(position).toEqual({ x: 2, y: 2 })
    })
    
    test('should handle max attempts scenario', () => {
      const tinyBoard = { width: 1, height: 1 }
      const excludePositions: Position[] = [{ x: 0, y: 0 }]
      
      // Should return a position even if all positions are excluded (after max attempts)
      const position = generateRandomPosition(tinyBoard, excludePositions)
      expect(position.x).toBeGreaterThanOrEqual(0)
      expect(position.x).toBeLessThan(tinyBoard.width)
      expect(position.y).toBeGreaterThanOrEqual(0)
      expect(position.y).toBeLessThan(tinyBoard.height)
    })
  })
  
  describe('isOppositeDirection', () => {
    test('should detect opposite directions', () => {
      expect(isOppositeDirection('up', 'down')).toBe(true)
      expect(isOppositeDirection('down', 'up')).toBe(true)
      expect(isOppositeDirection('left', 'right')).toBe(true)
      expect(isOppositeDirection('right', 'left')).toBe(true)
    })
    
    test('should return false for non-opposite directions', () => {
      expect(isOppositeDirection('up', 'left')).toBe(false)
      expect(isOppositeDirection('up', 'right')).toBe(false)
      expect(isOppositeDirection('down', 'left')).toBe(false)
      expect(isOppositeDirection('down', 'right')).toBe(false)
      expect(isOppositeDirection('left', 'up')).toBe(false)
      expect(isOppositeDirection('left', 'down')).toBe(false)
      expect(isOppositeDirection('right', 'up')).toBe(false)
      expect(isOppositeDirection('right', 'down')).toBe(false)
    })
    
    test('should return false for same direction', () => {
      expect(isOppositeDirection('up', 'up')).toBe(false)
      expect(isOppositeDirection('down', 'down')).toBe(false)
      expect(isOppositeDirection('left', 'left')).toBe(false)
      expect(isOppositeDirection('right', 'right')).toBe(false)
    })
  })
  
  describe('calculateGameSpeed', () => {
    test('should calculate speed for different difficulties', () => {
      expect(calculateGameSpeed(1, 'easy')).toBe(152) // (200 - 10) * 0.8
      expect(calculateGameSpeed(1, 'medium')).toBe(190) // (200 - 10) * 1.0
      expect(calculateGameSpeed(1, 'hard')).toBe(247) // (200 - 10) * 1.3
    })
    
    test('should decrease speed with higher levels', () => {
      const level1Speed = calculateGameSpeed(1, 'medium')
      const level5Speed = calculateGameSpeed(5, 'medium')
      const level10Speed = calculateGameSpeed(10, 'medium')
      
      expect(level5Speed).toBeLessThan(level1Speed)
      expect(level10Speed).toBeLessThan(level5Speed)
    })
    
    test('should not go below minimum speed', () => {
      // Test with very high level
      const highLevelSpeed = calculateGameSpeed(100, 'medium')
      expect(highLevelSpeed).toBeGreaterThanOrEqual(50)
    })
    
    test('should handle unknown difficulty', () => {
      const speed = calculateGameSpeed(1, 'unknown')
      expect(speed).toBe(190) // Should default to medium (1.0 multiplier)
    })
    
    test('should handle edge cases', () => {
      expect(calculateGameSpeed(0, 'medium')).toBe(200)
      expect(calculateGameSpeed(-1, 'medium')).toBe(210) // Negative level increases speed
    })
    
    test('should apply difficulty multipliers correctly', () => {
      const baseSpeed = 200 - (5 * 10) // Level 5, so 150
      
      expect(calculateGameSpeed(5, 'easy')).toBe(Math.max(50, baseSpeed * 0.8))
      expect(calculateGameSpeed(5, 'medium')).toBe(Math.max(50, baseSpeed * 1.0))
      expect(calculateGameSpeed(5, 'hard')).toBe(Math.max(50, baseSpeed * 1.3))
    })
  })
  
  describe('performance tests', () => {
    test('generateRandomPosition should complete within reasonable time', () => {
      const boardSize = { width: 50, height: 50 }
      const excludePositions: Position[] = [{ x: 0, y: 0 }]
      
      const startTime = performance.now()
      generateRandomPosition(boardSize, excludePositions)
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(10) // Should complete in less than 10ms
    })
    
    test('detectCollision should handle large snake efficiently', () => {
      const boardSize = { width: 100, height: 100 }
      const largeSnake: Position[] = Array.from({ length: 1000 }, (_, i) => ({ 
        x: i % boardSize.width, 
        y: Math.floor(i / boardSize.width) 
      }))
      
      const startTime = performance.now()
      detectCollision({ x: 50, y: 50 }, largeSnake, boardSize)
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(5) // Should complete in less than 5ms
    })
    
    test('isValidMove should handle large snake efficiently', () => {
      const boardSize = { width: 100, height: 100 }
      const largeSnake: Position[] = Array.from({ length: 1000 }, (_, i) => ({ 
        x: i % boardSize.width, 
        y: Math.floor(i / boardSize.width) 
      }))
      
      const startTime = performance.now()
      isValidMove({ x: 99, y: 99 }, largeSnake, boardSize)
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(5) // Should complete in less than 5ms
    })
  })
  
  describe('integration tests', () => {
    test('should work together for game simulation', () => {
      const boardSize = { width: 10, height: 10 }
      let snake: Position[] = [{ x: 5, y: 5 }]
      let direction: Direction = 'right'
      let score = 0
      
      // Simulate a few moves
      for (let i = 0; i < 3; i++) {
        const head = snake[0]
        const nextPosition = getNextPosition(head, direction)
        
        if (!detectCollision(nextPosition, snake, boardSize)) {
          snake.unshift(nextPosition)
          score = calculateScore(i + 1, 50)
        }
      }
      
      expect(snake.length).toBe(4) // Original + 3 moves
      expect(snake[0]).toEqual({ x: 8, y: 5 }) // Moved right 3 times
      expect(score).toBe(80) // 3 food * 10 + 50 time bonus
    })
    
    test('should handle direction changes properly', () => {
      const currentDirection: Direction = 'up'
      const attemptedDirection: Direction = 'down'
      
      expect(isOppositeDirection(currentDirection, attemptedDirection)).toBe(true)
      
      // Should not allow opposite direction
      const validDirection = isOppositeDirection(currentDirection, attemptedDirection) 
        ? currentDirection 
        : attemptedDirection
        
      expect(validDirection).toBe('up')
    })
  })
}) 