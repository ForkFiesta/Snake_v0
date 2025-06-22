import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import { GameCanvas } from '@/components/game/GameCanvas'
import { useGameStore } from '@/lib/stores/gameStore'
import { GameEngine } from '@/lib/game-engine/GameEngine'

// Mock the game store
jest.mock('@/lib/stores/gameStore')
const mockUseGameStore = useGameStore as jest.MockedFunction<typeof useGameStore>

// Mock the GameEngine
jest.mock('@/lib/game-engine/GameEngine')
const MockGameEngine = GameEngine as jest.MockedClass<typeof GameEngine>

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => {
  setTimeout(cb, 16)
  return 1
})
global.cancelAnimationFrame = jest.fn()

describe('GameCanvas', () => {
  const defaultProps = {
    width: 400,
    height: 400,
    onGameOver: jest.fn()
  }

  const mockGameStore = {
    gameStatus: 'idle' as const,
    score: 0,
    highScore: 0,
    level: 1,
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    direction: 'right' as const,
    nextDirection: 'right' as const,
    gameMode: 'classic' as const,
    difficulty: 'medium' as const,
    boardSize: { width: 20, height: 20 },
    startGame: jest.fn(),
    pauseGame: jest.fn(),
    endGame: jest.fn(),
    resetGame: jest.fn(),
    updateScore: jest.fn(),
    changeDirection: jest.fn(),
    moveSnake: jest.fn(),
    generateFood: jest.fn(),
    setGameMode: jest.fn(),
    setDifficulty: jest.fn()
  }

  const mockGameEngine = {
    startGame: jest.fn(),
    pauseGame: jest.fn(),
    endGame: jest.fn(),
    changeDirection: jest.fn(),
    getGameState: jest.fn().mockReturnValue(mockGameStore),
    render: jest.fn(),
    update: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseGameStore.mockReturnValue(mockGameStore)
    MockGameEngine.mockImplementation(() => mockGameEngine as any)
    
    // Mock canvas context
    HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
      clearRect: jest.fn(),
      fillRect: jest.fn(),
      strokeRect: jest.fn(),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      beginPath: jest.fn(),
      closePath: jest.fn(),
      stroke: jest.fn(),
      fill: jest.fn(),
      arc: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn()
    })
  })

  describe('Rendering', () => {
    test('should render canvas with correct dimensions', () => {
      render(<GameCanvas {...defaultProps} />)
      
      const canvas = screen.getByRole('img') // Canvas has img role in ARIA
      expect(canvas).toBeInTheDocument()
      expect(canvas).toHaveAttribute('width', '400')
      expect(canvas).toHaveAttribute('height', '400')
    })

    test('should apply custom className', () => {
      const customClass = 'custom-game-canvas'
      render(<GameCanvas {...defaultProps} className={customClass} />)
      
      const canvas = screen.getByRole('img')
      expect(canvas).toHaveClass('game-canvas', customClass)
    })

    test('should have tabIndex for keyboard focus', () => {
      render(<GameCanvas {...defaultProps} />)
      
      const canvas = screen.getByRole('img')
      expect(canvas).toHaveAttribute('tabIndex', '0')
    })

    test('should initialize GameEngine on mount', () => {
      render(<GameCanvas {...defaultProps} />)
      
      expect(MockGameEngine).toHaveBeenCalledTimes(1)
      expect(MockGameEngine).toHaveBeenCalledWith(expect.any(HTMLCanvasElement), defaultProps.onGameOver)
    })
  })

  describe('Game Integration', () => {
    test('should start game when gameStatus changes to playing', async () => {
      const { rerender } = render(<GameCanvas {...defaultProps} />)
      
      // Update game store to playing state
      mockUseGameStore.mockReturnValue({
        ...mockGameStore,
        gameStatus: 'playing'
      })
      
      rerender(<GameCanvas {...defaultProps} />)
      
      await waitFor(() => {
        expect(mockGameEngine.startGame).toHaveBeenCalled()
      })
    })

    test('should pause game when gameStatus changes to paused', async () => {
      // Start with playing state
      mockUseGameStore.mockReturnValue({
        ...mockGameStore,
        gameStatus: 'playing'
      })
      
      const { rerender } = render(<GameCanvas {...defaultProps} />)
      
      // Change to paused state
      mockUseGameStore.mockReturnValue({
        ...mockGameStore,
        gameStatus: 'paused'
      })
      
      rerender(<GameCanvas {...defaultProps} />)
      
      await waitFor(() => {
        expect(mockGameEngine.pauseGame).toHaveBeenCalled()
      })
    })

    test('should end game when gameStatus changes to gameOver', async () => {
      const { rerender } = render(<GameCanvas {...defaultProps} />)
      
      // Update game store to game over state
      mockUseGameStore.mockReturnValue({
        ...mockGameStore,
        gameStatus: 'gameOver'
      })
      
      rerender(<GameCanvas {...defaultProps} />)
      
      await waitFor(() => {
        expect(mockGameEngine.endGame).toHaveBeenCalled()
      })
    })

    test('should call onGameOver callback when game ends', async () => {
      const onGameOverSpy = jest.fn()
      const { rerender } = render(<GameCanvas {...defaultProps} onGameOver={onGameOverSpy} />)
      
      // Update game store to game over state with score
      mockUseGameStore.mockReturnValue({
        ...mockGameStore,
        gameStatus: 'gameOver',
        score: 150
      })
      
      // Trigger re-render to simulate state change
      rerender(<GameCanvas {...defaultProps} onGameOver={onGameOverSpy} />)
      
      await waitFor(() => {
        expect(onGameOverSpy).toHaveBeenCalledWith(150)
      })
    })
  })

  describe('Keyboard Controls', () => {
    test('should handle arrow key presses', () => {
      render(<GameCanvas {...defaultProps} />)
      const canvas = screen.getByRole('img')
      
      canvas.focus()
      
      fireEvent.keyDown(canvas, { key: 'ArrowRight' })
      expect(mockGameEngine.changeDirection).toHaveBeenCalledWith('right')
      
      fireEvent.keyDown(canvas, { key: 'ArrowLeft' })
      expect(mockGameEngine.changeDirection).toHaveBeenCalledWith('left')
      
      fireEvent.keyDown(canvas, { key: 'ArrowUp' })
      expect(mockGameEngine.changeDirection).toHaveBeenCalledWith('up')
      
      fireEvent.keyDown(canvas, { key: 'ArrowDown' })
      expect(mockGameEngine.changeDirection).toHaveBeenCalledWith('down')
    })

    test('should handle WASD key presses', () => {
      render(<GameCanvas {...defaultProps} />)
      const canvas = screen.getByRole('img')
      
      canvas.focus()
      
      fireEvent.keyDown(canvas, { key: 'w' })
      expect(mockGameEngine.changeDirection).toHaveBeenCalledWith('up')
      
      fireEvent.keyDown(canvas, { key: 'a' })
      expect(mockGameEngine.changeDirection).toHaveBeenCalledWith('left')
      
      fireEvent.keyDown(canvas, { key: 's' })
      expect(mockGameEngine.changeDirection).toHaveBeenCalledWith('down')
      
      fireEvent.keyDown(canvas, { key: 'd' })
      expect(mockGameEngine.changeDirection).toHaveBeenCalledWith('right')
    })

    test('should handle uppercase WASD keys', () => {
      render(<GameCanvas {...defaultProps} />)
      const canvas = screen.getByRole('img')
      
      canvas.focus()
      
      fireEvent.keyDown(canvas, { key: 'W' })
      expect(mockGameEngine.changeDirection).toHaveBeenCalledWith('up')
      
      fireEvent.keyDown(canvas, { key: 'A' })
      expect(mockGameEngine.changeDirection).toHaveBeenCalledWith('left')
      
      fireEvent.keyDown(canvas, { key: 'S' })
      expect(mockGameEngine.changeDirection).toHaveBeenCalledWith('down')
      
      fireEvent.keyDown(canvas, { key: 'D' })
      expect(mockGameEngine.changeDirection).toHaveBeenCalledWith('right')
    })

    test('should prevent default behavior for game keys', () => {
      render(<GameCanvas {...defaultProps} />)
      const canvas = screen.getByRole('img')
      
      canvas.focus()
      
      const arrowEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' })
      const preventDefaultSpy = jest.spyOn(arrowEvent, 'preventDefault')
      
      fireEvent(canvas, arrowEvent)
      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    test('should ignore non-game keys', () => {
      render(<GameCanvas {...defaultProps} />)
      const canvas = screen.getByRole('img')
      
      canvas.focus()
      
      fireEvent.keyDown(canvas, { key: 'Enter' })
      fireEvent.keyDown(canvas, { key: 'Escape' })
      fireEvent.keyDown(canvas, { key: 'Space' })
      
      expect(mockGameEngine.changeDirection).not.toHaveBeenCalled()
    })

    test('should not handle keys when canvas is not focused', () => {
      render(<GameCanvas {...defaultProps} />)
      
      // Don't focus the canvas
      fireEvent.keyDown(document, { key: 'ArrowRight' })
      
      expect(mockGameEngine.changeDirection).not.toHaveBeenCalled()
    })
  })

  describe('Lifecycle Management', () => {
    test('should cleanup game engine on unmount', () => {
      const { unmount } = render(<GameCanvas {...defaultProps} />)
      
      unmount()
      
      expect(mockGameEngine.endGame).toHaveBeenCalled()
    })

    test('should handle canvas context creation failure gracefully', () => {
      HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue(null)
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      
      expect(() => {
        render(<GameCanvas {...defaultProps} />)
      }).not.toThrow()
      
      consoleSpy.mockRestore()
    })

    test('should reinitialize game engine when canvas dimensions change', () => {
      const { rerender } = render(<GameCanvas {...defaultProps} />)
      
      expect(MockGameEngine).toHaveBeenCalledTimes(1)
      
      rerender(<GameCanvas {...defaultProps} width={600} height={600} />)
      
      expect(MockGameEngine).toHaveBeenCalledTimes(2)
    })
  })

  describe('Performance', () => {
    test('should not create multiple game engines unnecessarily', () => {
      const { rerender } = render(<GameCanvas {...defaultProps} />)
      
      // Re-render with same props
      rerender(<GameCanvas {...defaultProps} />)
      rerender(<GameCanvas {...defaultProps} />)
      
      expect(MockGameEngine).toHaveBeenCalledTimes(1)
    })

    test('should properly cleanup animation frames', () => {
      const { unmount } = render(<GameCanvas {...defaultProps} />)
      
      unmount()
      
      expect(mockGameEngine.endGame).toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    test('should handle GameEngine initialization errors', () => {
      MockGameEngine.mockImplementation(() => {
        throw new Error('Canvas context not available')
      })
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      
      expect(() => {
        render(<GameCanvas {...defaultProps} />)
      }).not.toThrow()
      
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    test('should handle missing onGameOver callback gracefully', () => {
      const propsWithoutCallback = {
        width: 400,
        height: 400
      }
      
      expect(() => {
        render(<GameCanvas {...propsWithoutCallback} />)
      }).not.toThrow()
    })
  })

  describe('Accessibility', () => {
    test('should have proper ARIA attributes', () => {
      render(<GameCanvas {...defaultProps} />)
      
      const canvas = screen.getByRole('img')
      expect(canvas).toHaveAttribute('tabIndex', '0')
    })

    test('should be focusable for keyboard navigation', () => {
      render(<GameCanvas {...defaultProps} />)
      
      const canvas = screen.getByRole('img')
      canvas.focus()
      
      expect(canvas).toHaveFocus()
    })
  })
}) 