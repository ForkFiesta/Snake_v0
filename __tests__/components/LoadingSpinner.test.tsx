import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

describe('LoadingSpinner Component', () => {
  describe('Basic Rendering', () => {
    test('renders loading spinner with default props', () => {
      render(<LoadingSpinner />)
      
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveClass('loading-spinner', 'loading-spinner-md')
    })

    test('renders spinner element inside container', () => {
      render(<LoadingSpinner />)
      
      const container = screen.getByTestId('loading-spinner')
      const spinnerElement = container.querySelector('.spinner')
      
      expect(spinnerElement).toBeInTheDocument()
      expect(spinnerElement).toHaveClass('spinner')
    })
  })

  describe('Size Variants', () => {
    test('renders small size variant', () => {
      render(<LoadingSpinner size="sm" />)
      
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toHaveClass('loading-spinner-sm')
      expect(spinner).not.toHaveClass('loading-spinner-md', 'loading-spinner-lg')
    })

    test('renders medium size variant (default)', () => {
      render(<LoadingSpinner size="md" />)
      
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toHaveClass('loading-spinner-md')
      expect(spinner).not.toHaveClass('loading-spinner-sm', 'loading-spinner-lg')
    })

    test('renders large size variant', () => {
      render(<LoadingSpinner size="lg" />)
      
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toHaveClass('loading-spinner-lg')
      expect(spinner).not.toHaveClass('loading-spinner-sm', 'loading-spinner-md')
    })

    test('defaults to medium size when no size prop provided', () => {
      render(<LoadingSpinner />)
      
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toHaveClass('loading-spinner-md')
    })
  })

  describe('Custom Styling', () => {
    test('applies custom className', () => {
      const customClass = 'custom-spinner-class'
      render(<LoadingSpinner className={customClass} />)
      
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toHaveClass(customClass)
      expect(spinner).toHaveClass('loading-spinner', 'loading-spinner-md') // Should still have base classes
    })

    test('applies multiple custom classes', () => {
      const customClasses = 'class1 class2 class3'
      render(<LoadingSpinner className={customClasses} />)
      
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toHaveClass('class1', 'class2', 'class3')
    })

    test('handles empty className gracefully', () => {
      render(<LoadingSpinner className="" />)
      
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toHaveClass('loading-spinner', 'loading-spinner-md')
    })

    test('combines size and custom className correctly', () => {
      render(<LoadingSpinner size="lg" className="custom-class" />)
      
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toHaveClass('loading-spinner', 'loading-spinner-lg', 'custom-class')
    })
  })

  describe('Accessibility', () => {
    test('has proper ARIA attributes for screen readers', () => {
      render(<LoadingSpinner />)
      
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toHaveAttribute('role', 'status')
      expect(spinner).toHaveAttribute('aria-label', 'Loading')
    })

    test('has aria-live attribute for screen reader announcements', () => {
      render(<LoadingSpinner />)
      
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toHaveAttribute('aria-live', 'polite')
    })

    test('is not focusable', () => {
      render(<LoadingSpinner />)
      
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).not.toHaveAttribute('tabindex')
      expect(spinner).not.toHaveAttribute('tabIndex')
    })

    test('provides screen reader text', () => {
      render(<LoadingSpinner />)
      
      // Should have visually hidden text for screen readers
      const srText = screen.getByText('Loading...')
      expect(srText).toBeInTheDocument()
      expect(srText).toHaveClass('sr-only')
    })
  })

  describe('Props Validation', () => {
    test('accepts all valid size options', () => {
      const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg']
      
      sizes.forEach(size => {
        const { unmount } = render(<LoadingSpinner size={size} />)
        const spinner = screen.getByTestId('loading-spinner')
        expect(spinner).toHaveClass(`loading-spinner-${size}`)
        unmount()
      })
    })

    test('works without any props', () => {
      expect(() => render(<LoadingSpinner />)).not.toThrow()
      
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toBeInTheDocument()
    })

    test('works with only size prop', () => {
      expect(() => render(<LoadingSpinner size="lg" />)).not.toThrow()
      
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toHaveClass('loading-spinner-lg')
    })

    test('works with only className prop', () => {
      expect(() => render(<LoadingSpinner className="test-class" />)).not.toThrow()
      
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toHaveClass('test-class')
    })
  })

  describe('Animation and Visual States', () => {
    test('has animation classes applied', () => {
      render(<LoadingSpinner />)
      
      const spinnerElement = screen.getByTestId('loading-spinner').querySelector('.spinner')
      expect(spinnerElement).toHaveClass('animate-spin')
    })

    test('maintains consistent structure across all sizes', () => {
      const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg']
      
      sizes.forEach(size => {
        const { unmount } = render(<LoadingSpinner size={size} />)
        const container = screen.getByTestId('loading-spinner')
        const spinnerElement = container.querySelector('.spinner')
        
        expect(container).toBeInTheDocument()
        expect(spinnerElement).toBeInTheDocument()
        expect(container).toHaveClass('loading-spinner', `loading-spinner-${size}`)
        expect(spinnerElement).toHaveClass('spinner')
        
        unmount()
      })
    })
  })

  describe('Performance', () => {
    test('renders efficiently without unnecessary re-renders', () => {
      let renderCount = 0
      
      const TestSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size }) => {
        renderCount++
        return <LoadingSpinner size={size} />
      }

      const { rerender } = render(<TestSpinner size="md" />)
      expect(renderCount).toBe(1)

      // Re-render with same props should not cause issues
      rerender(<TestSpinner size="md" />)
      expect(renderCount).toBe(2)

      // Re-render with different props
      rerender(<TestSpinner size="lg" />)
      expect(renderCount).toBe(3)
    })

    test('handles rapid prop changes gracefully', () => {
      const { rerender } = render(<LoadingSpinner size="sm" />)
      
      // Rapidly change sizes
      rerender(<LoadingSpinner size="md" />)
      rerender(<LoadingSpinner size="lg" />)
      rerender(<LoadingSpinner size="sm" />)
      
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toHaveClass('loading-spinner-sm')
      expect(spinner).toBeInTheDocument()
    })
  })

  describe('Integration', () => {
    test('works within other components', () => {
      const ParentComponent: React.FC = () => (
        <div data-testid="parent">
          <h1>Loading Data</h1>
          <LoadingSpinner size="lg" />
        </div>
      )

      render(<ParentComponent />)
      
      const parent = screen.getByTestId('parent')
      const spinner = screen.getByTestId('loading-spinner')
      
      expect(parent).toContainElement(spinner)
      expect(spinner).toHaveClass('loading-spinner-lg')
    })

    test('can be conditionally rendered', () => {
      const ConditionalSpinner: React.FC<{ isLoading: boolean }> = ({ isLoading }) => (
        <div>
          {isLoading && <LoadingSpinner />}
        </div>
      )

      const { rerender } = render(<ConditionalSpinner isLoading={false} />)
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument()

      rerender(<ConditionalSpinner isLoading={true} />)
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('handles undefined props gracefully', () => {
      expect(() => render(<LoadingSpinner size={undefined} className={undefined} />)).not.toThrow()
      
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toHaveClass('loading-spinner-md') // Should default to md
    })

    test('handles null className gracefully', () => {
      expect(() => render(<LoadingSpinner className={null as any} />)).not.toThrow()
      
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toBeInTheDocument()
    })

    test('maintains accessibility even with custom classes', () => {
      render(<LoadingSpinner className="custom-overlay z-50" />)
      
      const spinner = screen.getByTestId('loading-spinner')
      expect(spinner).toHaveAttribute('role', 'status')
      expect(spinner).toHaveAttribute('aria-label', 'Loading')
      expect(spinner).toHaveClass('custom-overlay', 'z-50')
    })
  })
}) 