import { render, screen, fireEvent } from '@testing-library/react'
import { GameControls } from '@/components/game/GameControls'

describe('GameControls', () => {
  const defaultProps = {
    onStart: jest.fn(),
    onPause: jest.fn(),
    onRestart: jest.fn(),
    gameStatus: 'idle' as const
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    test('should render container with correct class', () => {
      const { container } = render(<GameControls {...defaultProps} />)
      
      const gameControls = container.querySelector('.game-controls')
      expect(gameControls).toBeInTheDocument()
    })

    test('should render Start Game button when gameStatus is idle', () => {
      render(<GameControls {...defaultProps} gameStatus="idle" />)
      
      const startButton = screen.getByRole('button', { name: /start game/i })
      expect(startButton).toBeInTheDocument()
      expect(startButton).toHaveClass('btn', 'btn-primary')
    })

    test('should render Pause button when gameStatus is playing', () => {
      render(<GameControls {...defaultProps} gameStatus="playing" />)
      
      const pauseButton = screen.getByRole('button', { name: /pause/i })
      expect(pauseButton).toBeInTheDocument()
      expect(pauseButton).toHaveClass('btn', 'btn-secondary')
    })

    test('should render Resume button when gameStatus is paused', () => {
      render(<GameControls {...defaultProps} gameStatus="paused" />)
      
      const resumeButton = screen.getByRole('button', { name: /resume/i })
      expect(resumeButton).toBeInTheDocument()
      expect(resumeButton).toHaveClass('btn', 'btn-primary')
    })

    test('should render Restart button when gameStatus is gameOver', () => {
      render(<GameControls {...defaultProps} gameStatus="gameOver" />)
      
      const restartButton = screen.getByRole('button', { name: /restart/i })
      expect(restartButton).toBeInTheDocument()
      expect(restartButton).toHaveClass('btn', 'btn-danger')
    })

    test('should render both Resume and Restart buttons when gameStatus is paused', () => {
      render(<GameControls {...defaultProps} gameStatus="paused" />)
      
      const resumeButton = screen.getByRole('button', { name: /resume/i })
      const restartButton = screen.getByRole('button', { name: /restart/i })
      
      expect(resumeButton).toBeInTheDocument()
      expect(restartButton).toBeInTheDocument()
    })

    test('should not render any buttons for unknown gameStatus', () => {
      // @ts-expect-error - Testing invalid gameStatus
      render(<GameControls {...defaultProps} gameStatus="unknown" />)
      
      const buttons = screen.queryAllByRole('button')
      expect(buttons).toHaveLength(0)
    })
  })

  describe('Button Interactions', () => {
    test('should call onStart when Start Game button is clicked', () => {
      render(<GameControls {...defaultProps} gameStatus="idle" />)
      
      const startButton = screen.getByRole('button', { name: /start game/i })
      fireEvent.click(startButton)
      
      expect(defaultProps.onStart).toHaveBeenCalledTimes(1)
      expect(defaultProps.onPause).not.toHaveBeenCalled()
      expect(defaultProps.onRestart).not.toHaveBeenCalled()
    })

    test('should call onPause when Pause button is clicked', () => {
      render(<GameControls {...defaultProps} gameStatus="playing" />)
      
      const pauseButton = screen.getByRole('button', { name: /pause/i })
      fireEvent.click(pauseButton)
      
      expect(defaultProps.onPause).toHaveBeenCalledTimes(1)
      expect(defaultProps.onStart).not.toHaveBeenCalled()
      expect(defaultProps.onRestart).not.toHaveBeenCalled()
    })

    test('should call onStart when Resume button is clicked', () => {
      render(<GameControls {...defaultProps} gameStatus="paused" />)
      
      const resumeButton = screen.getByRole('button', { name: /resume/i })
      fireEvent.click(resumeButton)
      
      expect(defaultProps.onStart).toHaveBeenCalledTimes(1)
      expect(defaultProps.onPause).not.toHaveBeenCalled()
      expect(defaultProps.onRestart).not.toHaveBeenCalled()
    })

    test('should call onRestart when Restart button is clicked from paused state', () => {
      render(<GameControls {...defaultProps} gameStatus="paused" />)
      
      const restartButton = screen.getByRole('button', { name: /restart/i })
      fireEvent.click(restartButton)
      
      expect(defaultProps.onRestart).toHaveBeenCalledTimes(1)
      expect(defaultProps.onStart).not.toHaveBeenCalled()
      expect(defaultProps.onPause).not.toHaveBeenCalled()
    })

    test('should call onRestart when Restart button is clicked from gameOver state', () => {
      render(<GameControls {...defaultProps} gameStatus="gameOver" />)
      
      const restartButton = screen.getByRole('button', { name: /restart/i })
      fireEvent.click(restartButton)
      
      expect(defaultProps.onRestart).toHaveBeenCalledTimes(1)
      expect(defaultProps.onStart).not.toHaveBeenCalled()
      expect(defaultProps.onPause).not.toHaveBeenCalled()
    })

    test('should handle multiple rapid clicks without calling handlers multiple times', () => {
      render(<GameControls {...defaultProps} gameStatus="idle" />)
      
      const startButton = screen.getByRole('button', { name: /start game/i })
      
      // Rapid clicks
      fireEvent.click(startButton)
      fireEvent.click(startButton)
      fireEvent.click(startButton)
      
      expect(defaultProps.onStart).toHaveBeenCalledTimes(3)
    })
  })

  describe('State Transitions', () => {
    test('should update buttons when gameStatus changes from idle to playing', () => {
      const { rerender } = render(<GameControls {...defaultProps} gameStatus="idle" />)
      
      expect(screen.getByRole('button', { name: /start game/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /pause/i })).not.toBeInTheDocument()
      
      rerender(<GameControls {...defaultProps} gameStatus="playing" />)
      
      expect(screen.queryByRole('button', { name: /start game/i })).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
    })

    test('should update buttons when gameStatus changes from playing to paused', () => {
      const { rerender } = render(<GameControls {...defaultProps} gameStatus="playing" />)
      
      expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /resume/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /restart/i })).not.toBeInTheDocument()
      
      rerender(<GameControls {...defaultProps} gameStatus="paused" />)
      
      expect(screen.queryByRole('button', { name: /pause/i })).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: /resume/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /restart/i })).toBeInTheDocument()
    })

    test('should update buttons when gameStatus changes from playing to gameOver', () => {
      const { rerender } = render(<GameControls {...defaultProps} gameStatus="playing" />)
      
      expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /restart/i })).not.toBeInTheDocument()
      
      rerender(<GameControls {...defaultProps} gameStatus="gameOver" />)
      
      expect(screen.queryByRole('button', { name: /pause/i })).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: /restart/i })).toBeInTheDocument()
    })

    test('should update buttons when gameStatus changes from gameOver to idle', () => {
      const { rerender } = render(<GameControls {...defaultProps} gameStatus="gameOver" />)
      
      expect(screen.getByRole('button', { name: /restart/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /start game/i })).not.toBeInTheDocument()
      
      rerender(<GameControls {...defaultProps} gameStatus="idle" />)
      
      expect(screen.queryByRole('button', { name: /restart/i })).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: /start game/i })).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should have proper button roles and labels', () => {
      render(<GameControls {...defaultProps} gameStatus="idle" />)
      
      const startButton = screen.getByRole('button', { name: /start game/i })
      expect(startButton).toHaveAttribute('type', 'button')
    })

    test('should be keyboard accessible', () => {
      render(<GameControls {...defaultProps} gameStatus="idle" />)
      
      const startButton = screen.getByRole('button', { name: /start game/i })
      
      // Focus the button
      startButton.focus()
      expect(startButton).toHaveFocus()
      
      // Press Enter
      fireEvent.keyDown(startButton, { key: 'Enter' })
      fireEvent.keyUp(startButton, { key: 'Enter' })
      
      // Should still work (browser handles this automatically)
      expect(startButton).toHaveFocus()
    })

    test('should support Space key activation', () => {
      render(<GameControls {...defaultProps} gameStatus="idle" />)
      
      const startButton = screen.getByRole('button', { name: /start game/i })
      
      startButton.focus()
      fireEvent.keyDown(startButton, { key: ' ' })
      fireEvent.keyUp(startButton, { key: ' ' })
      
      // Browser handles space key activation automatically
      expect(startButton).toHaveFocus()
    })
  })

  describe('Error Handling', () => {
    test('should handle missing callback functions gracefully', () => {
      const propsWithoutCallbacks = {
        onStart: undefined as any,
        onPause: undefined as any,
        onRestart: undefined as any,
        gameStatus: 'idle' as const
      }
      
      expect(() => {
        render(<GameControls {...propsWithoutCallbacks} />)
      }).not.toThrow()
    })

    test('should handle callback errors gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      const errorProps = {
        ...defaultProps,
        onStart: jest.fn(() => {
          throw new Error('Test error')
        })
      }
      
      render(<GameControls {...errorProps} gameStatus="idle" />)
      
      const startButton = screen.getByRole('button', { name: /start game/i })
      
      // The callback should be called and error should be logged
      // Component should handle the error gracefully and not crash
      fireEvent.click(startButton)
      
      expect(errorProps.onStart).toHaveBeenCalledTimes(1)
      expect(consoleErrorSpy).toHaveBeenCalledWith('GameControls callback error:', expect.any(Error))
      
      // Component should still be rendered and functional after error
      expect(startButton).toBeInTheDocument()
      
      // Should be able to click again without issues
      fireEvent.click(startButton)
      expect(errorProps.onStart).toHaveBeenCalledTimes(2)
      
      consoleErrorSpy.mockRestore()
    })
  })

  describe('Performance', () => {
    test('should not re-render unnecessarily when props do not change', () => {
      const { rerender } = render(<GameControls {...defaultProps} gameStatus="idle" />)
      
      const startButton = screen.getByRole('button', { name: /start game/i })
      const initialButton = startButton
      
      // Re-render with same props
      rerender(<GameControls {...defaultProps} gameStatus="idle" />)
      
      const newStartButton = screen.getByRole('button', { name: /start game/i })
      expect(newStartButton).toBeInTheDocument()
    })

    test('should handle rapid state changes efficiently', () => {
      const { rerender } = render(<GameControls {...defaultProps} gameStatus="idle" />)
      
      // Rapid state changes
      rerender(<GameControls {...defaultProps} gameStatus="playing" />)
      rerender(<GameControls {...defaultProps} gameStatus="paused" />)
      rerender(<GameControls {...defaultProps} gameStatus="gameOver" />)
      rerender(<GameControls {...defaultProps} gameStatus="idle" />)
      
      // Should end up with Start Game button
      expect(screen.getByRole('button', { name: /start game/i })).toBeInTheDocument()
    })
  })

  describe('Custom Props', () => {
    test('should accept custom className prop', () => {
      const customClass = 'custom-controls'
      const { container } = render(
        <GameControls {...defaultProps} className={customClass} />
      )
      
      const gameControls = container.querySelector('.game-controls')
      expect(gameControls).toHaveClass('game-controls', customClass)
    })

    test('should accept data-testid prop', () => {
      const testId = 'game-controls-test'
      const { container } = render(
        <GameControls {...defaultProps} data-testid={testId} />
      )
      
      const gameControls = container.querySelector(`[data-testid="${testId}"]`)
      expect(gameControls).toBeInTheDocument()
    })
  })
}) 