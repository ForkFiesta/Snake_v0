import { renderHook } from '@testing-library/react'
import { useKeyboardControls } from '@/lib/hooks/useKeyboardControls'
import { Direction } from '@/types/game'

describe('useKeyboardControls', () => {
  let mockOnDirectionChange: jest.Mock<void, [Direction]>

  beforeEach(() => {
    mockOnDirectionChange = jest.fn()
    
    // Clear any existing event listeners
    document.removeEventListener = jest.fn()
    window.removeEventListener = jest.fn()
    window.addEventListener = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  describe('initialization', () => {
    test('should add keydown event listener when enabled', () => {
      renderHook(() => 
        useKeyboardControls({ 
          onDirectionChange: mockOnDirectionChange,
          enabled: true 
        })
      )
      
      expect(window.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))
    })

    test('should not add event listener when disabled', () => {
      renderHook(() => 
        useKeyboardControls({ 
          onDirectionChange: mockOnDirectionChange,
          enabled: false 
        })
      )
      
      expect(window.addEventListener).not.toHaveBeenCalled()
    })

    test('should default to enabled when enabled prop is not provided', () => {
      renderHook(() => 
        useKeyboardControls({ 
          onDirectionChange: mockOnDirectionChange
        })
      )
      
      expect(window.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))
    })
  })

  describe('cleanup', () => {
    test('should remove event listener on unmount', () => {
      const { unmount } = renderHook(() => 
        useKeyboardControls({ 
          onDirectionChange: mockOnDirectionChange,
          enabled: true 
        })
      )
      
      unmount()
      
      expect(window.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))
    })

    test('should remove event listener when disabled', () => {
      const { rerender } = renderHook(
        ({ enabled }) => useKeyboardControls({ 
          onDirectionChange: mockOnDirectionChange,
          enabled 
        }),
        { initialProps: { enabled: true } }
      )
      
      // Change to disabled
      rerender({ enabled: false })
      
      expect(window.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))
    })

    test('should not remove event listener when disabled initially', () => {
      renderHook(() => 
        useKeyboardControls({ 
          onDirectionChange: mockOnDirectionChange,
          enabled: false 
        })
      )
      
      expect(window.removeEventListener).not.toHaveBeenCalled()
    })
  })

  describe('arrow key handling', () => {
    let keydownHandler: (event: KeyboardEvent) => void

    beforeEach(() => {
      renderHook(() => 
        useKeyboardControls({ 
          onDirectionChange: mockOnDirectionChange,
          enabled: true 
        })
      )
      
      // Extract the keydown handler that was registered
      const addEventListenerCall = (window.addEventListener as jest.Mock).mock.calls.find(
        call => call[0] === 'keydown'
      )
      keydownHandler = addEventListenerCall[1]
    })

    test('should handle ArrowUp key', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' })
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault')
      
      keydownHandler(event)
      
      expect(mockOnDirectionChange).toHaveBeenCalledWith('up')
      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    test('should handle ArrowDown key', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault')
      
      keydownHandler(event)
      
      expect(mockOnDirectionChange).toHaveBeenCalledWith('down')
      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    test('should handle ArrowLeft key', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault')
      
      keydownHandler(event)
      
      expect(mockOnDirectionChange).toHaveBeenCalledWith('left')
      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    test('should handle ArrowRight key', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault')
      
      keydownHandler(event)
      
      expect(mockOnDirectionChange).toHaveBeenCalledWith('right')
      expect(preventDefaultSpy).toHaveBeenCalled()
    })
  })

  describe('WASD key handling', () => {
    let keydownHandler: (event: KeyboardEvent) => void

    beforeEach(() => {
      renderHook(() => 
        useKeyboardControls({ 
          onDirectionChange: mockOnDirectionChange,
          enabled: true 
        })
      )
      
      const addEventListenerCall = (window.addEventListener as jest.Mock).mock.calls.find(
        call => call[0] === 'keydown'
      )
      keydownHandler = addEventListenerCall[1]
    })

    test('should handle lowercase w key', () => {
      const event = new KeyboardEvent('keydown', { key: 'w' })
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault')
      
      keydownHandler(event)
      
      expect(mockOnDirectionChange).toHaveBeenCalledWith('up')
      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    test('should handle uppercase W key', () => {
      const event = new KeyboardEvent('keydown', { key: 'W' })
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault')
      
      keydownHandler(event)
      
      expect(mockOnDirectionChange).toHaveBeenCalledWith('up')
      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    test('should handle lowercase s key', () => {
      const event = new KeyboardEvent('keydown', { key: 's' })
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault')
      
      keydownHandler(event)
      
      expect(mockOnDirectionChange).toHaveBeenCalledWith('down')
      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    test('should handle uppercase S key', () => {
      const event = new KeyboardEvent('keydown', { key: 'S' })
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault')
      
      keydownHandler(event)
      
      expect(mockOnDirectionChange).toHaveBeenCalledWith('down')
      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    test('should handle lowercase a key', () => {
      const event = new KeyboardEvent('keydown', { key: 'a' })
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault')
      
      keydownHandler(event)
      
      expect(mockOnDirectionChange).toHaveBeenCalledWith('left')
      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    test('should handle uppercase A key', () => {
      const event = new KeyboardEvent('keydown', { key: 'A' })
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault')
      
      keydownHandler(event)
      
      expect(mockOnDirectionChange).toHaveBeenCalledWith('left')
      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    test('should handle lowercase d key', () => {
      const event = new KeyboardEvent('keydown', { key: 'd' })
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault')
      
      keydownHandler(event)
      
      expect(mockOnDirectionChange).toHaveBeenCalledWith('right')
      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    test('should handle uppercase D key', () => {
      const event = new KeyboardEvent('keydown', { key: 'D' })
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault')
      
      keydownHandler(event)
      
      expect(mockOnDirectionChange).toHaveBeenCalledWith('right')
      expect(preventDefaultSpy).toHaveBeenCalled()
    })
  })

  describe('invalid key handling', () => {
    let keydownHandler: (event: KeyboardEvent) => void

    beforeEach(() => {
      renderHook(() => 
        useKeyboardControls({ 
          onDirectionChange: mockOnDirectionChange,
          enabled: true 
        })
      )
      
      const addEventListenerCall = (window.addEventListener as jest.Mock).mock.calls.find(
        call => call[0] === 'keydown'
      )
      keydownHandler = addEventListenerCall[1]
    })

    test('should ignore unrecognized keys', () => {
      const event = new KeyboardEvent('keydown', { key: 'Space' })
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault')
      
      keydownHandler(event)
      
      expect(mockOnDirectionChange).not.toHaveBeenCalled()
      expect(preventDefaultSpy).not.toHaveBeenCalled()
    })

    test('should ignore numeric keys', () => {
      const event = new KeyboardEvent('keydown', { key: '1' })
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault')
      
      keydownHandler(event)
      
      expect(mockOnDirectionChange).not.toHaveBeenCalled()
      expect(preventDefaultSpy).not.toHaveBeenCalled()
    })

    test('should ignore other letter keys', () => {
      const event = new KeyboardEvent('keydown', { key: 'z' })
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault')
      
      keydownHandler(event)
      
      expect(mockOnDirectionChange).not.toHaveBeenCalled()
      expect(preventDefaultSpy).not.toHaveBeenCalled()
    })
  })

  describe('dependency changes', () => {
    test('should update event listener when onDirectionChange changes', () => {
      const firstCallback = jest.fn()
      const secondCallback = jest.fn()
      
      const { rerender } = renderHook(
        ({ callback }) => useKeyboardControls({ 
          onDirectionChange: callback,
          enabled: true 
        }),
        { initialProps: { callback: firstCallback } }
      )
      
      // Clear mocks to track new calls
      jest.clearAllMocks()
      
      // Change the callback
      rerender({ callback: secondCallback })
      
      // Should remove old listener and add new one
      expect(window.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))
      expect(window.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))
    })

    test('should update event listener when enabled changes', () => {
      const { rerender } = renderHook(
        ({ enabled }) => useKeyboardControls({ 
          onDirectionChange: mockOnDirectionChange,
          enabled 
        }),
        { initialProps: { enabled: true } }
      )
      
      // Clear mocks to track new calls
      jest.clearAllMocks()
      
      // Change enabled state
      rerender({ enabled: false })
      
      // Should remove listener when disabled
      expect(window.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))
      
      // Change back to enabled
      rerender({ enabled: true })
      
      // Should add listener when re-enabled
      expect(window.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))
    })
  })

  describe('multiple key presses', () => {
    let keydownHandler: (event: KeyboardEvent) => void

    beforeEach(() => {
      renderHook(() => 
        useKeyboardControls({ 
          onDirectionChange: mockOnDirectionChange,
          enabled: true 
        })
      )
      
      const addEventListenerCall = (window.addEventListener as jest.Mock).mock.calls.find(
        call => call[0] === 'keydown'
      )
      keydownHandler = addEventListenerCall[1]
    })

    test('should handle rapid key presses', () => {
      keydownHandler(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
      keydownHandler(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
      keydownHandler(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
      keydownHandler(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
      
      expect(mockOnDirectionChange).toHaveBeenCalledTimes(4)
      expect(mockOnDirectionChange).toHaveBeenNthCalledWith(1, 'up')
      expect(mockOnDirectionChange).toHaveBeenNthCalledWith(2, 'right')
      expect(mockOnDirectionChange).toHaveBeenNthCalledWith(3, 'down')
      expect(mockOnDirectionChange).toHaveBeenNthCalledWith(4, 'left')
    })

    test('should handle mixed arrow and WASD keys', () => {
      keydownHandler(new KeyboardEvent('keydown', { key: 'w' }))
      keydownHandler(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
      keydownHandler(new KeyboardEvent('keydown', { key: 's' }))
      keydownHandler(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
      
      expect(mockOnDirectionChange).toHaveBeenCalledTimes(4)
      expect(mockOnDirectionChange).toHaveBeenNthCalledWith(1, 'up')
      expect(mockOnDirectionChange).toHaveBeenNthCalledWith(2, 'right')
      expect(mockOnDirectionChange).toHaveBeenNthCalledWith(3, 'down')
      expect(mockOnDirectionChange).toHaveBeenNthCalledWith(4, 'left')
    })
  })

  describe('edge cases', () => {
    test('should handle null/undefined onDirectionChange gracefully', () => {
      // This test ensures the hook doesn't crash if callback is undefined
      expect(() => {
        renderHook(() => 
          useKeyboardControls({ 
            onDirectionChange: undefined as any,
            enabled: true 
          })
        )
      }).not.toThrow()
    })

    test('should handle event with null key', () => {
      renderHook(() => 
        useKeyboardControls({ 
          onDirectionChange: mockOnDirectionChange,
          enabled: true 
        })
      )
      
      const addEventListenerCall = (window.addEventListener as jest.Mock).mock.calls.find(
        call => call[0] === 'keydown'
      )
      const keydownHandler = addEventListenerCall[1]
      
      // Create event with null key
      const event = { key: null, preventDefault: jest.fn() } as any
      
      expect(() => keydownHandler(event)).not.toThrow()
      expect(mockOnDirectionChange).not.toHaveBeenCalled()
    })
  })
}) 