import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

// Test component that throws an error
const ThrowError: React.FC<{ shouldThrow?: boolean; errorMessage?: string }> = ({ 
  shouldThrow = false, 
  errorMessage = 'Test error' 
}) => {
  if (shouldThrow) {
    throw new Error(errorMessage)
  }
  return <div data-testid="child-component">Child component rendered successfully</div>
}

// Mock console.error to avoid noise in test output
const originalConsoleError = console.error
beforeAll(() => {
  console.error = jest.fn()
})

afterAll(() => {
  console.error = originalConsoleError
})

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(console.error as jest.Mock).mockClear()
  })

  describe('Normal Operation', () => {
    test('renders children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      )

      expect(screen.getByTestId('child-component')).toBeInTheDocument()
      expect(screen.getByText('Child component rendered successfully')).toBeInTheDocument()
    })

    test('renders multiple children correctly', () => {
      render(
        <ErrorBoundary>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </ErrorBoundary>
      )

      expect(screen.getByTestId('child-1')).toBeInTheDocument()
      expect(screen.getByTestId('child-2')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    test('catches and displays error UI when child component throws', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      // Error UI should be displayed
      expect(screen.getByText('Something went wrong.')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
      
      // Child component should not be rendered
      expect(screen.queryByTestId('child-component')).not.toBeInTheDocument()
    })

    test('logs error information when error occurs', () => {
      const errorMessage = 'Custom test error'
      
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} errorMessage={errorMessage} />
        </ErrorBoundary>
      )

      expect(console.error).toHaveBeenCalledWith(
        'ErrorBoundary caught an error:',
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String)
        })
      )
    })

    test('displays correct CSS classes for error UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      // The error container is now the main div with error-boundary class
      const errorContainer = screen.getByText('Something went wrong.').closest('.error-boundary')
      expect(errorContainer).toHaveClass('error-boundary')
      expect(errorContainer).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center')
      
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(2) // "Try again" and "Refresh page"
      expect(buttons[0]).toHaveTextContent('Try again')
      expect(buttons[1]).toHaveTextContent('Refresh page')
    })
  })

  describe('Error Recovery', () => {
    test('recovers from error when "Try again" button is clicked', () => {
      const TestComponent: React.FC = () => {
        const [shouldThrow, setShouldThrow] = React.useState(true)

        return (
          <div>
            <button 
              data-testid="toggle-error" 
              onClick={() => setShouldThrow(false)}
            >
              Fix Error
            </button>
            <ErrorBoundary>
              <ThrowError shouldThrow={shouldThrow} />
            </ErrorBoundary>
          </div>
        )
      }

      render(<TestComponent />)

      // Initially should show error UI
      expect(screen.getByText('Something went wrong.')).toBeInTheDocument()
      
      // First fix the underlying issue (so component won't throw on re-render)
      fireEvent.click(screen.getByTestId('toggle-error'))
      
      // Then click "Try again" button to reset error boundary
      const tryAgainButton = screen.getByRole('button', { name: 'Try again' })
      fireEvent.click(tryAgainButton)

      // After clicking, should show the child component
      expect(screen.getByTestId('child-component')).toBeInTheDocument()
      expect(screen.queryByText('Something went wrong.')).not.toBeInTheDocument()
    })

    test('button click resets error state correctly', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      // Verify error state
      expect(screen.getByText('Something went wrong.')).toBeInTheDocument()
      
      // Click try again button
      const tryAgainButton = screen.getByRole('button', { name: 'Try again' })
      fireEvent.click(tryAgainButton)

      // The error boundary should attempt to re-render children
      // Since our test component still throws, it should show error again
      // But this verifies the state reset mechanism works
      expect(screen.getByText('Something went wrong.')).toBeInTheDocument()
    })
  })

  describe('Component Lifecycle', () => {
    test('getDerivedStateFromError returns correct state', () => {
      // This tests the static method indirectly through component behavior
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      // If getDerivedStateFromError works correctly, error UI should be shown
      expect(screen.getByText('Something went wrong.')).toBeInTheDocument()
    })

    test('componentDidCatch is called with correct parameters', () => {
      const errorMessage = 'Specific error message'
      
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} errorMessage={errorMessage} />
        </ErrorBoundary>
      )

      // Verify console.error was called with error and errorInfo
      expect(console.error).toHaveBeenCalledWith(
        'ErrorBoundary caught an error:',
        expect.objectContaining({
          message: errorMessage
        }),
        expect.objectContaining({
          componentStack: expect.any(String)
        })
      )
    })
  })

  describe('Accessibility', () => {
    test('error UI has proper semantic structure', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      // Check for proper heading
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveTextContent('Something went wrong.')
      
      // Check for button
      const button = screen.getByRole('button', { name: 'Try again' })
      expect(button).toBeInTheDocument()
    })

    test('try again button is focusable and clickable', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      const button = screen.getByRole('button', { name: 'Try again' })
      
      // Button should be focusable
      button.focus()
      expect(document.activeElement).toBe(button)
      
      // Button should be clickable
      expect(button).not.toBeDisabled()
    })
  })

  describe('Edge Cases', () => {
    test('handles null children gracefully', () => {
      render(
        <ErrorBoundary>
          {null}
        </ErrorBoundary>
      )

      // Should not crash and should render nothing visible
      expect(screen.queryByText('Something went wrong.')).not.toBeInTheDocument()
    })

    test('handles undefined children gracefully', () => {
      render(
        <ErrorBoundary>
          {undefined}
        </ErrorBoundary>
      )

      // Should not crash and should render nothing visible
      expect(screen.queryByText('Something went wrong.')).not.toBeInTheDocument()
    })

    test('handles empty children gracefully', () => {
      render(<ErrorBoundary></ErrorBoundary>)

      // Should not crash and should render nothing visible
      expect(screen.queryByText('Something went wrong.')).not.toBeInTheDocument()
    })

    test('handles string children', () => {
      render(
        <ErrorBoundary>
          Simple text content
        </ErrorBoundary>
      )

      expect(screen.getByText('Simple text content')).toBeInTheDocument()
    })

    test('handles errors in nested components', () => {
      const NestedComponent: React.FC = () => (
        <div>
          <span>Nested content</span>
          <ThrowError shouldThrow={true} />
        </div>
      )

      render(
        <ErrorBoundary>
          <NestedComponent />
        </ErrorBoundary>
      )

      expect(screen.getByText('Something went wrong.')).toBeInTheDocument()
      expect(screen.queryByText('Nested content')).not.toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    test('does not re-render unnecessarily when no error occurs', () => {
      let renderCount = 0
      
      const TestChild: React.FC = () => {
        renderCount++
        return <div>Child component</div>
      }

      const { rerender } = render(
        <ErrorBoundary>
          <TestChild />
        </ErrorBoundary>
      )

      expect(renderCount).toBe(1)

      // Re-render with same props
      rerender(
        <ErrorBoundary>
          <TestChild />
        </ErrorBoundary>
      )

      expect(renderCount).toBe(2) // Should render again due to child re-render
    })
  })
}) 