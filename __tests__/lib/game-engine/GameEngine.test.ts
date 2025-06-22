import { GameEngine } from '@/lib/game-engine/GameEngine'
import { GameState, Direction, Position } from '@/types/game'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
})

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => {
  setTimeout(cb, 16)
  return 1
})
global.cancelAnimationFrame = jest.fn()

// Mock performance.now
global.performance = {
  ...global.performance,
  now: jest.fn(() => Date.now())
}

describe('GameEngine', () => {
  let canvas: HTMLCanvasElement
  let mockContext: CanvasRenderingContext2D
  let gameEngine: GameEngine
  let onGameOverMock: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Reset localStorage mock
    localStorageMock.getItem.mockReturnValue('0')
    
    // Create canvas and mock context
    canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 400
    
    mockContext = {
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      clearRect: jest.fn(),
      fillRect: jest.fn(),
      strokeRect: jest.fn(),
      beginPath: jest.fn(),
      closePath: jest.fn(),
      stroke: jest.fn(),
      fill: jest.fn(),
      arc: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
    } as any

    canvas.getContext = jest.fn().mockReturnValue(mockContext)
    
    onGameOverMock = jest.fn()
    gameEngine = new GameEngine(canvas, onGameOverMock)
  })

  describe('Constructor', () => {
    test('should initialize with canvas and callback', () => {
      expect(canvas.getContext).toHaveBeenCalledWith('2d')
      expect(gameEngine).toBeInstanceOf(GameEngine)
    })

    test('should throw error if canvas context is not available', () => {
      const badCanvas = document.createElement('canvas')
      badCanvas.getContext = jest.fn().mockReturnValue(null)
      
      expect(() => new GameEngine(badCanvas)).toThrow('Could not get 2D context from canvas')
    })

    test('should initialize game state correctly', () => {
      const gameState = gameEngine.getGameState()
      
      expect(gameState.gameStatus).toBe('idle')
      expect(gameState.score).toBe(0)
      expect(gameState.level).toBe(1)
      expect(gameState.direction).toBe('right')
      expect(gameState.nextDirection).toBe('right')
      expect(gameState.gameMode).toBe('classic')
      expect(gameState.difficulty).toBe('medium')
      expect(gameState.snake).toHaveLength(3)
      expect(gameState.food).toBeDefined()
      expect(gameState.boardSize).toEqual({ width: 20, height: 20 })
    })

    test('should load high score from localStorage', () => {
      // Clear previous mocks and set up the mock before creating the engine
      jest.clearAllMocks()
      localStorageMock.getItem.mockReturnValue('150')
      
      // Create a new canvas for this test
      const testCanvas = document.createElement('canvas')
      testCanvas.width = 400
      testCanvas.height = 400
      testCanvas.getContext = jest.fn().mockReturnValue(mockContext)
      
      const newGameEngine = new GameEngine(testCanvas)
      const gameState = newGameEngine.getGameState()
      
      expect(gameState.highScore).toBe(150)
      expect(localStorageMock.getItem).toHaveBeenCalledWith('snake-high-score')
    })

    test('should initialize snake in center of board', () => {
      const gameState = gameEngine.getGameState()
      const expectedCenterX = Math.floor(20 / 2)
      const expectedCenterY = Math.floor(20 / 2)
      
      expect(gameState.snake[0]).toEqual({ x: expectedCenterX, y: expectedCenterY })
      expect(gameState.snake[1]).toEqual({ x: expectedCenterX - 1, y: expectedCenterY })
      expect(gameState.snake[2]).toEqual({ x: expectedCenterX - 2, y: expectedCenterY })
    })

    test('should generate food not on snake', () => {
      const gameState = gameEngine.getGameState()
      
      const foodOnSnake = gameState.snake.some(segment => 
        segment.x === gameState.food.x && segment.y === gameState.food.y
      )
      
      expect(foodOnSnake).toBe(false)
    })
  })

  describe('Game Control Methods', () => {
    describe('startGame', () => {
      test('should start game from idle state', () => {
        gameEngine.startGame()
        
        const gameState = gameEngine.getGameState()
        expect(gameState.gameStatus).toBe('playing')
      })

      test('should start game loop when starting', () => {
        gameEngine.startGame()
        
        expect(requestAnimationFrame).toHaveBeenCalled()
      })
    })

    describe('pauseGame', () => {
      test('should pause running game', () => {
        gameEngine.startGame()
        gameEngine.pauseGame()
        
        const gameState = gameEngine.getGameState()
        expect(gameState.gameStatus).toBe('paused')
      })

      test('should cancel animation frame when pausing', () => {
        gameEngine.startGame()
        gameEngine.pauseGame()
        
        expect(cancelAnimationFrame).toHaveBeenCalled()
      })
    })

    describe('endGame', () => {
      test('should end running game', () => {
        gameEngine.startGame()
        gameEngine.endGame()
        
        const gameState = gameEngine.getGameState()
        expect(gameState.gameStatus).toBe('gameOver')
      })

      test('should cancel animation frame when ending', () => {
        gameEngine.startGame()
        gameEngine.endGame()
        
        expect(cancelAnimationFrame).toHaveBeenCalled()
      })

      test('should call onGameOver callback with current score', () => {
        gameEngine.startGame()
        
        // Set a score by simulating eating food
        gameEngine.setScore(100)
        
        gameEngine.endGame()
        
        expect(onGameOverMock).toHaveBeenCalledWith(100)
      })

      test('should update high score if current score is higher', () => {
        localStorageMock.getItem.mockReturnValue('50')
        const newGameEngine = new GameEngine(canvas, onGameOverMock)
        
        newGameEngine.startGame()
        newGameEngine.setScore(100)
        
        newGameEngine.endGame()
        
        expect(localStorageMock.setItem).toHaveBeenCalledWith('snake-high-score', '100')
        expect(newGameEngine.getGameState().highScore).toBe(100)
      })

      test('should not update high score if current score is lower', () => {
        localStorageMock.getItem.mockReturnValue('150')
        const newGameEngine = new GameEngine(canvas, onGameOverMock)
        
        newGameEngine.startGame()
        newGameEngine.setScore(50)
        
        newGameEngine.endGame()
        
        expect(localStorageMock.setItem).not.toHaveBeenCalled()
        expect(newGameEngine.getGameState().highScore).toBe(150)
      })
    })

    describe('resetGame', () => {
      test('should reset game to initial state', () => {
        gameEngine.startGame()
        gameEngine.setScore(100)
        gameEngine.setLevel(5)
        
        gameEngine.resetGame()
        
        const newGameState = gameEngine.getGameState()
        expect(newGameState.gameStatus).toBe('idle')
        expect(newGameState.score).toBe(0)
        expect(newGameState.level).toBe(1)
        expect(newGameState.snake).toHaveLength(3)
      })
    })
  })

  describe('Direction Control', () => {
    test('should change direction', () => {
      gameEngine.changeDirection('up')
      
      const gameState = gameEngine.getGameState()
      expect(gameState.nextDirection).toBe('up')
    })

    test('should prevent reversing into opposite direction', () => {
      gameEngine.startGame()
      gameEngine.changeDirection('right')
      gameEngine.update(16) // Apply direction change
      
      gameEngine.changeDirection('left') // Opposite direction - should be ignored
      gameEngine.update(16)
      
      const gameState = gameEngine.getGameState()
      expect(gameState.direction).toBe('right') // Should remain right
    })

    test('should allow perpendicular direction changes', () => {
      gameEngine.startGame()
      gameEngine.changeDirection('up')
      gameEngine.update(16)
      
      const gameState = gameEngine.getGameState()
      expect(gameState.direction).toBe('up')
    })
  })

  describe('Snake Movement', () => {
    test('should move snake right', () => {
      const initialState = gameEngine.getGameState()
      const initialHead = { ...initialState.snake[0] }
      
      gameEngine.startGame()
      gameEngine.changeDirection('right')
      gameEngine.update(16)
      
      const newState = gameEngine.getGameState()
      expect(newState.snake[0].x).toBe(initialHead.x + 1)
      expect(newState.snake[0].y).toBe(initialHead.y)
    })

    test('should move snake left', () => {
      const initialState = gameEngine.getGameState()
      const initialHead = { ...initialState.snake[0] }
      
      gameEngine.startGame()
      // First change to up, then to left to avoid opposite direction blocking
      gameEngine.changeDirection('up')
      gameEngine.update(16)
      gameEngine.changeDirection('left')
      gameEngine.update(16)
      
      const newState = gameEngine.getGameState()
      expect(newState.snake[0].x).toBe(initialHead.x - 1)
      expect(newState.snake[0].y).toBe(initialHead.y - 1) // Also moved up once
    })

    test('should move snake up', () => {
      const initialState = gameEngine.getGameState()
      const initialHead = { ...initialState.snake[0] }
      
      gameEngine.startGame()
      gameEngine.changeDirection('up')
      gameEngine.update(16)
      
      const newState = gameEngine.getGameState()
      expect(newState.snake[0].x).toBe(initialHead.x)
      expect(newState.snake[0].y).toBe(initialHead.y - 1)
    })

    test('should move snake down', () => {
      const initialState = gameEngine.getGameState()
      const initialHead = { ...initialState.snake[0] }
      
      gameEngine.startGame()
      gameEngine.changeDirection('down')
      gameEngine.update(16)
      
      const newState = gameEngine.getGameState()
      expect(newState.snake[0].x).toBe(initialHead.x)
      expect(newState.snake[0].y).toBe(initialHead.y + 1)
    })

    test('should grow snake when eating food', () => {
      const initialState = gameEngine.getGameState()
      const initialLength = initialState.snake.length
      
      gameEngine.startGame()
      
      // Position food in front of snake
      gameEngine.setFoodPosition({ x: initialState.snake[0].x + 1, y: initialState.snake[0].y })
      gameEngine.changeDirection('right')
      gameEngine.update(16)
      
      const newState = gameEngine.getGameState()
      expect(newState.snake.length).toBe(initialLength + 1)
      expect(newState.score).toBe(10)
    })

    test('should not grow snake when not eating food', () => {
      const initialState = gameEngine.getGameState()
      const initialLength = initialState.snake.length
      
      gameEngine.startGame()
      gameEngine.changeDirection('right')
      gameEngine.update(16)
      
      const newState = gameEngine.getGameState()
      expect(newState.snake.length).toBe(initialLength)
      expect(newState.score).toBe(0)
    })
  })

  describe('Collision Detection', () => {
    test('should detect wall collision - left wall', () => {
      gameEngine.startGame()
      // Set snake at left edge with body extending to the right
      gameEngine.setSnakePosition([
        { x: 0, y: 10 }, // Head at left edge
        { x: 1, y: 10 }, // Body
        { x: 2, y: 10 }  // Tail
      ])
      gameEngine.changeDirection('left')
      gameEngine.update(16)
      
      const gameState = gameEngine.getGameState()
      expect(gameState.gameStatus).toBe('gameOver')
    })

    test('should detect wall collision - right wall', () => {
      gameEngine.startGame()
      gameEngine.setSnakePosition([{ x: 19, y: 10 }])
      gameEngine.changeDirection('right')
      gameEngine.update(16)
      
      const gameState = gameEngine.getGameState()
      expect(gameState.gameStatus).toBe('gameOver')
    })

    test('should detect wall collision - top wall', () => {
      gameEngine.startGame()
      gameEngine.setSnakePosition([{ x: 10, y: 0 }])
      gameEngine.changeDirection('up')
      gameEngine.update(16)
      
      const gameState = gameEngine.getGameState()
      expect(gameState.gameStatus).toBe('gameOver')
    })

    test('should detect wall collision - bottom wall', () => {
      gameEngine.startGame()
      gameEngine.setSnakePosition([{ x: 10, y: 19 }])
      gameEngine.changeDirection('down')
      gameEngine.update(16)
      
      const gameState = gameEngine.getGameState()
      expect(gameState.gameStatus).toBe('gameOver')
    })

    test('should detect self collision', () => {
      gameEngine.startGame()
      // Create a simple L-shaped snake where head will hit body
      gameEngine.setSnakePosition([
        { x: 5, y: 5 }, // Head
        { x: 4, y: 5 }, // Body
        { x: 3, y: 5 }, // Body
        { x: 3, y: 6 }, // Body
        { x: 4, y: 6 }, // Body
        { x: 5, y: 6 }, // Body - head will hit this when moving down
      ])
      gameEngine.changeDirection('down')
      gameEngine.update(16)
      
      const gameState = gameEngine.getGameState()
      expect(gameState.gameStatus).toBe('gameOver')
    })

    test('should not detect collision in valid move', () => {
      gameEngine.startGame()
      gameEngine.setSnakePosition([{ x: 10, y: 10 }])
      gameEngine.changeDirection('right')
      gameEngine.update(16)
      
      const gameState = gameEngine.getGameState()
      expect(gameState.gameStatus).toBe('playing')
    })
  })

  describe('Food Generation', () => {
    test('should generate food not on snake', () => {
      const gameState = gameEngine.getGameState()
      
      const foodOnSnake = gameState.snake.some(segment => 
        segment.x === gameState.food.x && segment.y === gameState.food.y
      )
      
      expect(foodOnSnake).toBe(false)
    })

    test('should generate food within board bounds', () => {
      const gameState = gameEngine.getGameState()
      
      expect(gameState.food.x).toBeGreaterThanOrEqual(0)
      expect(gameState.food.x).toBeLessThan(20)
      expect(gameState.food.y).toBeGreaterThanOrEqual(0)
      expect(gameState.food.y).toBeLessThan(20)
    })
  })

  describe('Level System', () => {
    test('should increase level based on score', () => {
      gameEngine.startGame()
      gameEngine.setScore(150) // Should be level 2
      gameEngine.update(16)
      
      const gameState = gameEngine.getGameState()
      expect(gameState.level).toBe(2)
    })

    test('should increase game speed with level', () => {
      const initialSpeed = gameEngine.getGameSpeed()
      
      gameEngine.startGame()
      gameEngine.setScore(200) // Level 3
      gameEngine.update(16)
      
      const newSpeed = gameEngine.getGameSpeed()
      expect(newSpeed).toBeLessThan(initialSpeed)
      expect(newSpeed).toBe(130) // 150 - (3-1) * 10
    })

    test('should not decrease game speed below minimum', () => {
      gameEngine.startGame()
      gameEngine.setScore(2000) // Very high level
      gameEngine.update(16)
      
      const speed = gameEngine.getGameSpeed()
      expect(speed).toBeGreaterThanOrEqual(50)
    })
  })

  describe('Rendering', () => {
    test('should call all rendering methods', () => {
      const clearCanvasSpy = jest.spyOn(gameEngine as any, 'clearCanvas')
      const drawBoardSpy = jest.spyOn(gameEngine as any, 'drawBoard')
      const drawSnakeSpy = jest.spyOn(gameEngine as any, 'drawSnake')
      const drawFoodSpy = jest.spyOn(gameEngine as any, 'drawFood')
      
      gameEngine.render()
      
      expect(clearCanvasSpy).toHaveBeenCalled()
      expect(drawBoardSpy).toHaveBeenCalled()
      expect(drawSnakeSpy).toHaveBeenCalled()
      expect(drawFoodSpy).toHaveBeenCalled()
    })

    test('should clear canvas with black background', () => {
      ;(gameEngine as any).clearCanvas()
      
      expect(mockContext.fillStyle).toBe('#000000')
      expect(mockContext.fillRect).toHaveBeenCalledWith(0, 0, 400, 400)
    })

    test('should draw grid lines', () => {
      ;(gameEngine as any).drawBoard()
      
      expect(mockContext.strokeStyle).toBe('#333333')
      expect(mockContext.lineWidth).toBe(1)
      expect(mockContext.beginPath).toHaveBeenCalled()
      expect(mockContext.stroke).toHaveBeenCalled()
    })

    test('should draw food as circle', () => {
      ;(gameEngine as any).drawFood()
      
      expect(mockContext.fillStyle).toBe('#ef4444')
      expect(mockContext.beginPath).toHaveBeenCalled()
      expect(mockContext.arc).toHaveBeenCalled()
      expect(mockContext.fill).toHaveBeenCalled()
    })
  })

  describe('Game State Management', () => {
    test('should return copy of game state', () => {
      const gameState1 = gameEngine.getGameState()
      const gameState2 = gameEngine.getGameState()
      
      expect(gameState1).not.toBe(gameState2) // Different objects
      expect(gameState1).toEqual(gameState2)  // Same content
    })

    test('should not allow external modification of internal state', () => {
      const gameState = gameEngine.getGameState()
      gameState.score = 999
      
      const newGameState = gameEngine.getGameState()
      expect(newGameState.score).toBe(0) // Should remain unchanged
    })
  })

  describe('Edge Cases and Error Handling', () => {
    test('should handle canvas with different dimensions', () => {
      const smallCanvas = document.createElement('canvas')
      smallCanvas.width = 200
      smallCanvas.height = 300
      smallCanvas.getContext = jest.fn().mockReturnValue(mockContext)
      
      const smallGameEngine = new GameEngine(smallCanvas)
      const gameState = smallGameEngine.getGameState()
      
      expect(gameState.boardSize).toEqual({ width: 10, height: 15 })
    })

    test('should handle missing localStorage gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage not available')
      })
      
      expect(() => new GameEngine(canvas)).not.toThrow()
    })

    test('should handle invalid localStorage values', () => {
      localStorageMock.getItem.mockReturnValue('invalid-number')
      
      const newGameEngine = new GameEngine(canvas)
      const gameState = newGameEngine.getGameState()
      
      expect(gameState.highScore).toBe(0) // Should default to 0 for NaN
    })

    test('should handle rapid direction changes', () => {
      gameEngine.startGame()
      
      // Rapid direction changes
      gameEngine.changeDirection('up')
      gameEngine.changeDirection('right')
      gameEngine.changeDirection('down')
      gameEngine.changeDirection('left')
      
      const gameState = gameEngine.getGameState()
      expect(gameState.nextDirection).toBe('left') // Should be the last one
    })

    test('should handle missing onGameOver callback', () => {
      const gameEngineWithoutCallback = new GameEngine(canvas)
      
      expect(() => {
        gameEngineWithoutCallback.endGame()
      }).not.toThrow()
    })
  })
}) 