import { renderHook, act } from '@testing-library/react'
import { useGameLoop } from '@/lib/hooks/useGameLoop'
import { useGameStore } from '@/lib/stores/gameStore'

// Mock the game store
jest.mock('@/lib/stores/gameStore')

describe('useGameLoop', () => {
  let mockGameStore: {
    gameStatus: string
    moveSnake: jest.Mock
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    
    // Setup mock game store
    mockGameStore = {
      gameStatus: 'idle',
      moveSnake: jest.fn()
    }
    
    ;(useGameStore as jest.MockedFunction<typeof useGameStore>).mockReturnValue(mockGameStore)
    
    // Mock performance.now to return predictable values based on fake timers
    jest.spyOn(performance, 'now').mockImplementation(() => {
      return Date.now()
    })
    
    // Mock requestAnimationFrame and cancelAnimationFrame
    let animationId = 1
    global.requestAnimationFrame = jest.fn((callback) => {
      const id = animationId++
      // Schedule callback to run on next tick
      setTimeout(() => {
        if (callback) callback(performance.now())
      }, 16) // Simulate ~60fps
      return id
    })
    
    global.cancelAnimationFrame = jest.fn()
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  describe('initialization', () => {
    test('should return startLoop and stopLoop functions', () => {
      const { result } = renderHook(() => useGameLoop())
      
      expect(result.current).toHaveProperty('startLoop')
      expect(result.current).toHaveProperty('stopLoop')
      expect(typeof result.current.startLoop).toBe('function')
      expect(typeof result.current.stopLoop).toBe('function')
    })

    test('should not start game loop when game status is idle', () => {
      mockGameStore.gameStatus = 'idle'
      renderHook(() => useGameLoop())
      
      expect(global.requestAnimationFrame).not.toHaveBeenCalled()
    })

    test('should not start game loop when game status is paused', () => {
      mockGameStore.gameStatus = 'paused'
      renderHook(() => useGameLoop())
      
      expect(global.requestAnimationFrame).not.toHaveBeenCalled()
    })

    test('should not start game loop when game status is gameOver', () => {
      mockGameStore.gameStatus = 'gameOver'
      renderHook(() => useGameLoop())
      
      expect(global.requestAnimationFrame).not.toHaveBeenCalled()
    })
  })

  describe('game loop execution', () => {
    test('should start game loop when game status changes to playing', () => {
      const { rerender } = renderHook(() => useGameLoop())
      
      // Change game status to playing
      mockGameStore.gameStatus = 'playing'
      rerender()
      
      expect(global.requestAnimationFrame).toHaveBeenCalled()
    })

    test('should call moveSnake at correct intervals when playing', async () => {
      mockGameStore.gameStatus = 'playing'
      renderHook(() => useGameLoop())
      
      // Fast forward time to trigger game loop
      act(() => {
        jest.advanceTimersByTime(170) // 150ms + buffer for RAF
      })
      
      expect(mockGameStore.moveSnake).toHaveBeenCalledTimes(1)
      
      // Advance more time
      act(() => {
        jest.advanceTimersByTime(170)
      })
      
      expect(mockGameStore.moveSnake).toHaveBeenCalledTimes(2)
    })

    test('should not call moveSnake too frequently (respects 150ms interval)', async () => {
      mockGameStore.gameStatus = 'playing'
      renderHook(() => useGameLoop())
      
      // Fast forward less than the interval
      act(() => {
        jest.advanceTimersByTime(100)
      })
      
      expect(mockGameStore.moveSnake).not.toHaveBeenCalled()
      
      // Fast forward to reach the interval
      act(() => {
        jest.advanceTimersByTime(80) // 150ms + buffer
      })
      
      expect(mockGameStore.moveSnake).toHaveBeenCalledTimes(1)
    })

    test('should stop calling moveSnake when game status changes from playing', () => {
      mockGameStore.gameStatus = 'playing'
      const { rerender } = renderHook(() => useGameLoop())
      
      // Let it run once
      act(() => {
        jest.advanceTimersByTime(170)
      })
      
      expect(mockGameStore.moveSnake).toHaveBeenCalledTimes(1)
      
      // Change status to paused
      mockGameStore.gameStatus = 'paused'
      rerender()
      
      // Advance time - moveSnake should not be called again
      act(() => {
        jest.advanceTimersByTime(170)
      })
      
      expect(mockGameStore.moveSnake).toHaveBeenCalledTimes(1)
    })
  })

  describe('manual loop control', () => {
    test('should start loop manually with startLoop function', () => {
      const { result } = renderHook(() => useGameLoop())
      
      act(() => {
        result.current.startLoop()
      })
      
      expect(global.requestAnimationFrame).toHaveBeenCalled()
    })

    test('should stop loop manually with stopLoop function', () => {
      mockGameStore.gameStatus = 'playing'
      const { result } = renderHook(() => useGameLoop())
      
      // Start the loop
      act(() => {
        result.current.startLoop()
      })
      
      // Stop the loop
      act(() => {
        result.current.stopLoop()
      })
      
      expect(global.cancelAnimationFrame).toHaveBeenCalled()
    })

    test('should cancel existing animation frame before starting new loop', () => {
      const { result } = renderHook(() => useGameLoop())
      
      // Start loop twice
      act(() => {
        result.current.startLoop()
        result.current.startLoop()
      })
      
      expect(global.cancelAnimationFrame).toHaveBeenCalled()
      expect(global.requestAnimationFrame).toHaveBeenCalledTimes(2)
    })

    test('should handle stopLoop when no animation frame is active', () => {
      const { result } = renderHook(() => useGameLoop())
      
      // Should not throw error
      expect(() => {
        act(() => {
          result.current.stopLoop()
        })
      }).not.toThrow()
      
      expect(global.cancelAnimationFrame).not.toHaveBeenCalled()
    })
  })

  describe('cleanup', () => {
    test('should cleanup animation frame on unmount', () => {
      mockGameStore.gameStatus = 'playing'
      const { unmount } = renderHook(() => useGameLoop())
      
      // Let the loop start
      act(() => {
        jest.advanceTimersByTime(16)
      })
      
      unmount()
      
      expect(global.cancelAnimationFrame).toHaveBeenCalled()
    })

    test('should cleanup animation frame when game status changes away from playing', () => {
      mockGameStore.gameStatus = 'playing'
      const { rerender } = renderHook(() => useGameLoop())
      
      // Change to non-playing status
      mockGameStore.gameStatus = 'gameOver'
      rerender()
      
      expect(global.cancelAnimationFrame).toHaveBeenCalled()
    })
  })

  describe('performance and timing', () => {
    test('should maintain consistent timing across multiple frames', () => {
      mockGameStore.gameStatus = 'playing'
      renderHook(() => useGameLoop())
      
      const callTimes: number[] = []
      mockGameStore.moveSnake.mockImplementation(() => {
        callTimes.push(performance.now())
      })
      
      // Simulate multiple game loop iterations
      for (let i = 0; i < 3; i++) {
        act(() => {
          jest.advanceTimersByTime(170) // 150ms + buffer
        })
      }
      
      expect(mockGameStore.moveSnake).toHaveBeenCalledTimes(3)
      
      // Check that calls are roughly 170ms apart (our test interval)
      for (let i = 1; i < callTimes.length; i++) {
        const timeDiff = callTimes[i] - callTimes[i - 1]
        expect(timeDiff).toBeGreaterThanOrEqual(150) // At least the game interval
      }
    })

    test('should handle rapid game status changes gracefully', () => {
      const { rerender } = renderHook(() => useGameLoop())
      
      // Rapidly change game status
      mockGameStore.gameStatus = 'playing'
      rerender()
      
      mockGameStore.gameStatus = 'paused'
      rerender()
      
      mockGameStore.gameStatus = 'playing'
      rerender()
      
      mockGameStore.gameStatus = 'gameOver'
      rerender()
      
      // Should handle without errors
      expect(global.requestAnimationFrame).toHaveBeenCalled()
      expect(global.cancelAnimationFrame).toHaveBeenCalled()
    })

    test('should not accumulate animation frames', () => {
      const { rerender } = renderHook(() => useGameLoop())
      
      // Start with playing status
      mockGameStore.gameStatus = 'playing'
      rerender()
      
      // Change status and back to playing multiple times
      mockGameStore.gameStatus = 'paused'
      rerender()
      
      mockGameStore.gameStatus = 'playing'
      rerender()
      
      // Should cancel previous frames before creating new ones
      expect(global.cancelAnimationFrame).toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    test('should handle undefined gameStatus gracefully', () => {
      mockGameStore.gameStatus = undefined as any
      
      expect(() => {
        renderHook(() => useGameLoop())
      }).not.toThrow()
      
      expect(global.requestAnimationFrame).not.toHaveBeenCalled()
    })

    test('should handle moveSnake throwing an error', () => {
      mockGameStore.gameStatus = 'playing'
      mockGameStore.moveSnake.mockImplementation(() => {
        throw new Error('Snake movement error')
      })
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      
      const { result } = renderHook(() => useGameLoop())
      
      // Should not break the hook
      expect(() => {
        act(() => {
          result.current.startLoop()
          jest.advanceTimersByTime(170)
        })
      }).not.toThrow()
      
      // Should log the error
      expect(consoleSpy).toHaveBeenCalledWith('Game loop error:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })

    test('should handle performance.now() returning inconsistent values', () => {
      // Mock performance.now to return inconsistent values but still allow deltaTime >= 150
      let callCount = 0
      jest.spyOn(performance, 'now').mockImplementation(() => {
        callCount++
        // First call (initialization): 0
        // Second call (first frame): 200 (deltaTime = 200, >= 150, so moveSnake called)
        return callCount === 1 ? 0 : 200
      })
      
      mockGameStore.gameStatus = 'playing'
      renderHook(() => useGameLoop())
      
      // Should still work even with weird timing
      act(() => {
        jest.advanceTimersByTime(170)
      })
      
      expect(mockGameStore.moveSnake).toHaveBeenCalled()
    })
  })

  describe('integration with game store', () => {
    test('should respond to game store changes reactively', () => {
      const { rerender } = renderHook(() => useGameLoop())
      
      // Start with idle
      expect(global.requestAnimationFrame).not.toHaveBeenCalled()
      
      // Change to playing
      mockGameStore.gameStatus = 'playing'
      rerender()
      
      expect(global.requestAnimationFrame).toHaveBeenCalled()
      
      // Change back to idle
      mockGameStore.gameStatus = 'idle'
      rerender()
      
      expect(global.cancelAnimationFrame).toHaveBeenCalled()
    })

    test('should work with different game statuses', () => {
      const statuses = ['idle', 'playing', 'paused', 'gameOver'] as const
      
      statuses.forEach(status => {
        jest.clearAllMocks()
        mockGameStore.gameStatus = status
        
        const { unmount } = renderHook(() => useGameLoop())
        
        if (status === 'playing') {
          expect(global.requestAnimationFrame).toHaveBeenCalled()
        } else {
          expect(global.requestAnimationFrame).not.toHaveBeenCalled()
        }
        
        unmount()
      })
    })
  })
})