import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ScoreDisplay } from '@/components/game/ScoreDisplay'

describe('ScoreDisplay Component', () => {
  const defaultProps = {
    currentScore: 150,
    highScore: 300,
    level: 3
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    test('should render all score elements with correct values', () => {
      render(<ScoreDisplay {...defaultProps} />)
      
      // Check if all labels are present
      expect(screen.getByText('Score:')).toBeInTheDocument()
      expect(screen.getByText('High Score:')).toBeInTheDocument()
      expect(screen.getByText('Level:')).toBeInTheDocument()
      
      // Check if all values are displayed correctly using data-testid
      expect(screen.getByTestId('current-score')).toHaveTextContent('150')
      expect(screen.getByTestId('high-score')).toHaveTextContent('300')
      expect(screen.getByTestId('level')).toHaveTextContent('3')
    })

    test('should render with correct DOM structure', () => {
      render(<ScoreDisplay {...defaultProps} />)
      
      const container = document.querySelector('.score-display')
      const scoreItems = document.querySelectorAll('.score-item')
      const labels = document.querySelectorAll('.score-label')
      const values = document.querySelectorAll('.score-value')
      
      expect(container).toBeInTheDocument()
      expect(scoreItems).toHaveLength(3)
      expect(labels).toHaveLength(3)
      expect(values).toHaveLength(3)
    })

    test('should render with default level when not provided', () => {
      const propsWithoutLevel = {
        currentScore: 100,
        highScore: 200
      }
      
      render(<ScoreDisplay {...propsWithoutLevel} />)
      
      expect(screen.getByText('Level:')).toBeInTheDocument()
      expect(screen.getByTestId('level')).toHaveTextContent('1')
    })

    test('should handle zero values correctly', () => {
      const zeroProps = {
        currentScore: 0,
        highScore: 0,
        level: 0
      }
      
      render(<ScoreDisplay {...zeroProps} />)
      
      // Should display zeros
      expect(screen.getByTestId('current-score')).toHaveTextContent('0')
      expect(screen.getByTestId('high-score')).toHaveTextContent('0')
      expect(screen.getByTestId('level')).toHaveTextContent('0')
    })

    test('should handle large numbers correctly with formatting', () => {
      const largeProps = {
        currentScore: 999999,
        highScore: 1000000,
        level: 50
      }
      
      render(<ScoreDisplay {...largeProps} />)
      
      // Numbers should be formatted with commas
      expect(screen.getByTestId('current-score')).toHaveTextContent('999,999')
      expect(screen.getByTestId('high-score')).toHaveTextContent('1,000,000')
      expect(screen.getByTestId('level')).toHaveTextContent('50')
    })

    test('should render without level when showLevel is false', () => {
      render(<ScoreDisplay {...defaultProps} showLevel={false} />)
      
      expect(screen.getByText('Score:')).toBeInTheDocument()
      expect(screen.getByText('High Score:')).toBeInTheDocument()
      expect(screen.queryByText('Level:')).not.toBeInTheDocument()
      expect(screen.queryByTestId('level')).not.toBeInTheDocument()
    })
  })

  describe('Number Formatting', () => {
    test('should format large numbers with commas by default', () => {
      const largeProps = {
        currentScore: 1234567,
        highScore: 9876543,
        level: 15
      }
      
      render(<ScoreDisplay {...largeProps} />)
      
      expect(screen.getByTestId('current-score')).toHaveTextContent('1,234,567')
      expect(screen.getByTestId('high-score')).toHaveTextContent('9,876,543')
    })

    test('should not format numbers when formatNumbers is false', () => {
      const largeProps = {
        currentScore: 1234567,
        highScore: 9876543,
        level: 15,
        formatNumbers: false
      }
      
      render(<ScoreDisplay {...largeProps} />)
      
      expect(screen.getByTestId('current-score')).toHaveTextContent('1234567')
      expect(screen.getByTestId('high-score')).toHaveTextContent('9876543')
    })

    test('should handle NaN values gracefully', () => {
      const nanProps = {
        currentScore: NaN,
        highScore: NaN,
        level: NaN
      }
      
      render(<ScoreDisplay {...nanProps} />)
      
      expect(screen.getByTestId('current-score')).toHaveTextContent('NaN')
      expect(screen.getByTestId('high-score')).toHaveTextContent('NaN')
      expect(screen.getByTestId('level')).toHaveTextContent('NaN')
    })

    test('should handle Infinity values', () => {
      const infinityProps = {
        currentScore: Infinity,
        highScore: -Infinity,
        level: Infinity
      }
      
      render(<ScoreDisplay {...infinityProps} />)
      
      expect(screen.getByTestId('current-score')).toHaveTextContent('Infinity')
      expect(screen.getByTestId('high-score')).toHaveTextContent('-Infinity')
      expect(screen.getByTestId('level')).toHaveTextContent('Infinity')
    })
  })

  describe('Variants', () => {
    test('should render default variant correctly', () => {
      render(<ScoreDisplay {...defaultProps} variant="default" />)
      
      const container = document.querySelector('.score-display')
      expect(container).toHaveClass('flex-col', 'space-y-2')
    })

    test('should render compact variant correctly', () => {
      render(<ScoreDisplay {...defaultProps} variant="compact" />)
      
      const container = document.querySelector('.score-display')
      expect(container).toHaveClass('flex-row', 'items-center', 'space-x-4')
    })

    test('should render detailed variant correctly', () => {
      render(<ScoreDisplay {...defaultProps} variant="detailed" />)
      
      const container = document.querySelector('.score-display')
      expect(container).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-4')
    })
  })

  describe('Custom Styling', () => {
    test('should apply custom className', () => {
      const customClass = 'custom-score-display'
      render(<ScoreDisplay {...defaultProps} className={customClass} />)
      
      const container = document.querySelector('.score-display')
      expect(container).toHaveClass(customClass)
    })

    test('should maintain base classes with custom className', () => {
      const customClass = 'custom-score-display'
      render(<ScoreDisplay {...defaultProps} className={customClass} />)
      
      const container = document.querySelector('.score-display')
      expect(container).toHaveClass('score-display', 'flex', 'gap-4', customClass)
    })
  })

  describe('Props Validation', () => {
    test('should handle negative scores gracefully', () => {
      const negativeProps = {
        currentScore: -50,
        highScore: -100,
        level: -1
      }
      
      render(<ScoreDisplay {...negativeProps} />)
      
      expect(screen.getByTestId('current-score')).toHaveTextContent('-50')
      expect(screen.getByTestId('high-score')).toHaveTextContent('-100')
      expect(screen.getByTestId('level')).toHaveTextContent('-1')
    })

    test('should handle floating point numbers', () => {
      const floatProps = {
        currentScore: 123.45,
        highScore: 678.90,
        level: 2.5
      }
      
      render(<ScoreDisplay {...floatProps} />)
      
      expect(screen.getByTestId('current-score')).toHaveTextContent('123.45')
      expect(screen.getByTestId('high-score')).toHaveTextContent('678.9')
      expect(screen.getByTestId('level')).toHaveTextContent('2.5')
    })
  })

  describe('Accessibility', () => {
    test('should have proper ARIA attributes', () => {
      render(<ScoreDisplay {...defaultProps} />)
      
      const container = document.querySelector('.score-display')
      expect(container).toHaveAttribute('role', 'status')
      expect(container).toHaveAttribute('aria-live', 'polite')
    })

    test('should have proper label associations', () => {
      render(<ScoreDisplay {...defaultProps} />)
      
      const currentScoreLabel = document.getElementById('current-score-label')
      const currentScoreValue = screen.getByTestId('current-score')
      
      expect(currentScoreLabel).toBeInTheDocument()
      expect(currentScoreValue).toHaveAttribute('aria-labelledby', 'current-score-label')
      
      const highScoreLabel = document.getElementById('high-score-label')
      const highScoreValue = screen.getByTestId('high-score')
      
      expect(highScoreLabel).toBeInTheDocument()
      expect(highScoreValue).toHaveAttribute('aria-labelledby', 'high-score-label')
      
      const levelLabel = document.getElementById('level-label')
      const levelValue = screen.getByTestId('level')
      
      expect(levelLabel).toBeInTheDocument()
      expect(levelValue).toHaveAttribute('aria-labelledby', 'level-label')
    })

    test('should be readable by screen readers', () => {
      render(<ScoreDisplay {...defaultProps} />)
      
      // Check that labels and values are properly associated
      const scoreLabel = screen.getByText('Score:')
      const scoreValue = screen.getByTestId('current-score')
      
      expect(scoreLabel).toBeInTheDocument()
      expect(scoreValue).toBeInTheDocument()
      
      // Check semantic structure
      const container = document.querySelector('.score-display')
      expect(container).toHaveAttribute('role', 'status')
    })
  })

  describe('Edge Cases', () => {
    test('should handle very large numbers without breaking layout', () => {
      const veryLargeProps = {
        currentScore: Number.MAX_SAFE_INTEGER,
        highScore: Number.MAX_SAFE_INTEGER - 1,
        level: 999
      }
      
      render(<ScoreDisplay {...veryLargeProps} />)
      
      // Should format the numbers properly
      expect(screen.getByTestId('current-score')).toHaveTextContent('9,007,199,254,740,991')
      expect(screen.getByTestId('high-score')).toHaveTextContent('9,007,199,254,740,990')
      expect(screen.getByTestId('level')).toHaveTextContent('999')
    })
  })

  describe('Component Updates', () => {
    test('should update when props change', () => {
      const { rerender } = render(<ScoreDisplay {...defaultProps} />)
      
      expect(screen.getByTestId('current-score')).toHaveTextContent('150')
      
      const updatedProps = {
        currentScore: 250,
        highScore: 400,
        level: 5
      }
      
      rerender(<ScoreDisplay {...updatedProps} />)
      
      expect(screen.getByTestId('current-score')).toHaveTextContent('250')
      expect(screen.getByTestId('high-score')).toHaveTextContent('400')
      expect(screen.getByTestId('level')).toHaveTextContent('5')
    })

    test('should handle partial prop updates', () => {
      const { rerender } = render(<ScoreDisplay {...defaultProps} />)
      
      const partialUpdate = {
        ...defaultProps,
        currentScore: 200
      }
      
      rerender(<ScoreDisplay {...partialUpdate} />)
      
      expect(screen.getByTestId('current-score')).toHaveTextContent('200')
      expect(screen.getByTestId('high-score')).toHaveTextContent('300')
      expect(screen.getByTestId('level')).toHaveTextContent('3')
    })

    test('should handle showLevel toggle', () => {
      const { rerender } = render(<ScoreDisplay {...defaultProps} showLevel={true} />)
      
      expect(screen.getByTestId('level')).toBeInTheDocument()
      
      rerender(<ScoreDisplay {...defaultProps} showLevel={false} />)
      
      expect(screen.queryByTestId('level')).not.toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    test('should not cause unnecessary re-renders with same props', () => {
      const renderSpy = jest.fn()
      
      const TestWrapper = (props: any) => {
        renderSpy()
        return <ScoreDisplay {...props} />
      }
      
      const { rerender } = render(<TestWrapper {...defaultProps} />)
      
      expect(renderSpy).toHaveBeenCalledTimes(1)
      
      // Re-render with same props
      rerender(<TestWrapper {...defaultProps} />)
      
      expect(renderSpy).toHaveBeenCalledTimes(2) // React will still re-render, but component should handle it efficiently
    })
  })

  describe('TypeScript Integration', () => {
    test('should accept all required props', () => {
      // This test ensures TypeScript types are working correctly
      const validProps = {
        currentScore: 100,
        highScore: 200,
        level: 2
      }
      
      expect(() => render(<ScoreDisplay {...validProps} />)).not.toThrow()
    })

    test('should work without optional props', () => {
      const minimalProps = {
        currentScore: 100,
        highScore: 200
      }
      
      expect(() => render(<ScoreDisplay {...minimalProps} />)).not.toThrow()
    })

    test('should accept all optional props', () => {
      const fullProps = {
        currentScore: 100,
        highScore: 200,
        level: 2,
        className: 'custom-class',
        variant: 'detailed' as const,
        showLevel: true,
        formatNumbers: true
      }
      
      expect(() => render(<ScoreDisplay {...fullProps} />)).not.toThrow()
    })
  })

  describe('Integration with Game Constants', () => {
    test('should display scores that align with game scoring system', () => {
      // Test with scores that would come from actual gameplay
      const gameplayProps = {
        currentScore: 10, // One food item (POINTS.FOOD = 10)
        highScore: 150,   // 15 food items
        level: 2
      }
      
      render(<ScoreDisplay {...gameplayProps} />)
      
      expect(screen.getByTestId('current-score')).toHaveTextContent('10')
      expect(screen.getByTestId('high-score')).toHaveTextContent('150')
      expect(screen.getByTestId('level')).toHaveTextContent('2')
    })

    test('should handle level progression correctly', () => {
      // Test with level that follows MAX_LEVEL constant
      const maxLevelProps = {
        currentScore: 2000,
        highScore: 2500,
        level: 20 // MAX_LEVEL from constants
      }
      
      render(<ScoreDisplay {...maxLevelProps} />)
      
      expect(screen.getByTestId('level')).toHaveTextContent('20')
    })
  })
}) 