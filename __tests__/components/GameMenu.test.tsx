import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { GameMenu } from '@/components/game/GameMenu'

describe('GameMenu Component', () => {
  const defaultProps = {
    isVisible: true,
    onClose: jest.fn(),
    onRestart: jest.fn(),
    onSettings: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    test('should render menu when visible', () => {
      render(<GameMenu {...defaultProps} />)
      
      expect(screen.getByText('Game Menu')).toBeInTheDocument()
      expect(screen.getByText('Resume')).toBeInTheDocument()
      expect(screen.getByText('Restart')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
    })

    test('should not render menu when not visible', () => {
      render(<GameMenu {...defaultProps} isVisible={false} />)
      
      expect(screen.queryByText('Game Menu')).not.toBeInTheDocument()
      expect(screen.queryByText('Resume')).not.toBeInTheDocument()
      expect(screen.queryByText('Restart')).not.toBeInTheDocument()
      expect(screen.queryByText('Settings')).not.toBeInTheDocument()
    })

    test('should render with correct structure and classes', () => {
      render(<GameMenu {...defaultProps} />)
      
      const overlay = screen.getByText('Game Menu').closest('.game-menu-overlay')
      const menu = screen.getByText('Game Menu').closest('.game-menu')
      
      expect(overlay).toBeInTheDocument()
      expect(menu).toBeInTheDocument()
      expect(menu).toBeInTheDocument()
    })

    test('should render all buttons with correct classes', () => {
      render(<GameMenu {...defaultProps} />)
      
      const resumeButton = screen.getByText('Resume')
      const restartButton = screen.getByText('Restart')
      const settingsButton = screen.getByText('Settings')
      
      // Check for primary button styling
      expect(resumeButton).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white')
      // Check for secondary button styling
      expect(restartButton).toHaveClass('bg-gray-600', 'hover:bg-gray-700', 'text-white')
      expect(settingsButton).toHaveClass('bg-gray-600', 'hover:bg-gray-700', 'text-white')
      
      // Check for common button classes
      expect(resumeButton).toHaveClass('inline-flex', 'items-center', 'justify-center', 'font-medium', 'rounded-lg')
      expect(restartButton).toHaveClass('inline-flex', 'items-center', 'justify-center', 'font-medium', 'rounded-lg')
      expect(settingsButton).toHaveClass('inline-flex', 'items-center', 'justify-center', 'font-medium', 'rounded-lg')
    })
  })

  describe('Interactions', () => {
    test('should call onClose when Resume button is clicked', () => {
      render(<GameMenu {...defaultProps} />)
      
      const resumeButton = screen.getByText('Resume')
      fireEvent.click(resumeButton)
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
      expect(defaultProps.onRestart).not.toHaveBeenCalled()
      expect(defaultProps.onSettings).not.toHaveBeenCalled()
    })

    test('should call onRestart when Restart button is clicked', () => {
      render(<GameMenu {...defaultProps} />)
      
      const restartButton = screen.getByText('Restart')
      fireEvent.click(restartButton)
      
      expect(defaultProps.onRestart).toHaveBeenCalledTimes(1)
      expect(defaultProps.onClose).not.toHaveBeenCalled()
      expect(defaultProps.onSettings).not.toHaveBeenCalled()
    })

    test('should call onSettings when Settings button is clicked', () => {
      render(<GameMenu {...defaultProps} />)
      
      const settingsButton = screen.getByText('Settings')
      fireEvent.click(settingsButton)
      
      expect(defaultProps.onSettings).toHaveBeenCalledTimes(1)
      expect(defaultProps.onClose).not.toHaveBeenCalled()
      expect(defaultProps.onRestart).not.toHaveBeenCalled()
    })

    test('should handle multiple button clicks correctly', () => {
      render(<GameMenu {...defaultProps} />)
      
      const resumeButton = screen.getByText('Resume')
      const restartButton = screen.getByText('Restart')
      
      fireEvent.click(resumeButton)
      fireEvent.click(restartButton)
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
      expect(defaultProps.onRestart).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    test('should have proper heading structure', () => {
      render(<GameMenu {...defaultProps} />)
      
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveTextContent('Game Menu')
    })

    test('should have focusable buttons', () => {
      render(<GameMenu {...defaultProps} />)
      
      const resumeButton = screen.getByRole('button', { name: 'Resume' })
      const restartButton = screen.getByRole('button', { name: 'Restart' })
      const settingsButton = screen.getByRole('button', { name: 'Settings' })
      
      expect(resumeButton).toBeInTheDocument()
      expect(restartButton).toBeInTheDocument()
      expect(settingsButton).toBeInTheDocument()
      
      // Check that buttons can receive focus
      resumeButton.focus()
      expect(resumeButton).toHaveFocus()
    })

    test('should support keyboard navigation', () => {
      render(<GameMenu {...defaultProps} />)
      
      const resumeButton = screen.getByRole('button', { name: 'Resume' })
      
      // Focus the button and press Enter
      resumeButton.focus()
      fireEvent.keyDown(resumeButton, { key: 'Enter' })
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    })

    test('should support space key activation', () => {
      render(<GameMenu {...defaultProps} />)
      
      const restartButton = screen.getByRole('button', { name: 'Restart' })
      
      // Focus the button and press Space
      restartButton.focus()
      fireEvent.keyDown(restartButton, { key: ' ' })
      
      expect(defaultProps.onRestart).toHaveBeenCalledTimes(1)
    })
  })

  describe('Edge Cases', () => {
    test('should handle undefined callback functions gracefully', () => {
      const propsWithUndefined = {
        isVisible: true,
        onClose: undefined as any,
        onRestart: undefined as any,
        onSettings: undefined as any
      }
      
      expect(() => {
        render(<GameMenu {...propsWithUndefined} />)
      }).not.toThrow()
    })

    test('should handle rapid button clicks', () => {
      render(<GameMenu {...defaultProps} />)
      
      const resumeButton = screen.getByText('Resume')
      
      // Simulate rapid clicks
      fireEvent.click(resumeButton)
      fireEvent.click(resumeButton)
      fireEvent.click(resumeButton)
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(3)
    })

    test('should maintain state when toggling visibility', () => {
      const { rerender } = render(<GameMenu {...defaultProps} isVisible={false} />)
      
      expect(screen.queryByText('Game Menu')).not.toBeInTheDocument()
      
      rerender(<GameMenu {...defaultProps} isVisible={true} />)
      
      expect(screen.getByText('Game Menu')).toBeInTheDocument()
      expect(screen.getByText('Resume')).toBeInTheDocument()
      expect(screen.getByText('Restart')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
    })
  })

  describe('Component Structure', () => {
    test('should have correct DOM structure', () => {
      render(<GameMenu {...defaultProps} />)
      
      const overlay = document.querySelector('.game-menu-overlay')
      const menu = document.querySelector('.game-menu')
      const heading = screen.getByText('Game Menu')
      const buttons = screen.getAllByRole('button')
      
      expect(overlay).toBeInTheDocument()
      expect(menu).toBeInTheDocument()
             expect(overlay).toContainElement(menu as HTMLElement)
       expect(menu).toContainElement(heading as HTMLElement)
      expect(buttons).toHaveLength(3)
      
             buttons.forEach(button => {
         expect(menu).toContainElement(button as HTMLElement)
       })
    })

    test('should return null when not visible', () => {
      const { container } = render(<GameMenu {...defaultProps} isVisible={false} />)
      
      expect(container.firstChild).toBeNull()
    })
  })
}) 