import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Button } from '@/components/ui/Button'

describe('Button Component', () => {
  // Basic rendering tests
  describe('Rendering', () => {
    test('renders button with text content', () => {
      render(<Button>Click me</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Click me')
    })

    test('renders button with JSX children', () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      )
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('IconText')
    })

    test('renders as button element by default', () => {
      render(<Button>Test</Button>)
      
      const button = screen.getByRole('button')
      expect(button.tagName).toBe('BUTTON')
    })
  })

  // Event handling tests
  describe('Event Handling', () => {
    test('calls onClick handler when clicked', () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Click me</Button>)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test('calls onKeyDown handler when key is pressed', () => {
      const handleKeyDown = jest.fn()
      render(<Button onKeyDown={handleKeyDown}>Press key</Button>)
      
      const button = screen.getByRole('button')
      fireEvent.keyDown(button, { key: 'Enter' })
      
      expect(handleKeyDown).toHaveBeenCalledTimes(1)
      expect(handleKeyDown).toHaveBeenCalledWith(expect.objectContaining({
        key: 'Enter'
      }))
    })

    test('does not call onClick when disabled', () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick} disabled>Disabled</Button>)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(handleClick).not.toHaveBeenCalled()
    })

    test('does not call onKeyDown when disabled', () => {
      const handleKeyDown = jest.fn()
      render(<Button onKeyDown={handleKeyDown} disabled>Disabled</Button>)
      
      const button = screen.getByRole('button')
      fireEvent.keyDown(button, { key: 'Enter' })
      
      expect(handleKeyDown).not.toHaveBeenCalled()
    })
  })

  // Variant styling tests
  describe('Variant Styling', () => {
    test('applies primary variant classes by default', () => {
      render(<Button>Primary</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white', 'focus:ring-blue-500')
    })

    test('applies primary variant classes when explicitly set', () => {
      render(<Button variant="primary">Primary</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white', 'focus:ring-blue-500')
    })

    test('applies secondary variant classes', () => {
      render(<Button variant="secondary">Secondary</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-gray-600', 'hover:bg-gray-700', 'text-white', 'focus:ring-gray-500')
    })

    test('applies danger variant classes', () => {
      render(<Button variant="danger">Danger</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-red-600', 'hover:bg-red-700', 'text-white', 'focus:ring-red-500')
    })
  })

  // Size styling tests
  describe('Size Styling', () => {
    test('applies medium size classes by default', () => {
      render(<Button>Medium</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-4', 'py-2', 'text-base')
    })

    test('applies medium size classes when explicitly set', () => {
      render(<Button size="md">Medium</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-4', 'py-2', 'text-base')
    })

    test('applies small size classes', () => {
      render(<Button size="sm">Small</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm')
    })

    test('applies large size classes', () => {
      render(<Button size="lg">Large</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-6', 'py-3', 'text-lg')
    })
  })

  // Base styling tests
  describe('Base Styling', () => {
    test('applies base classes to all buttons', () => {
      render(<Button>Test</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass(
        'inline-flex',
        'items-center',
        'justify-center',
        'font-medium',
        'rounded-lg',
        'transition-colors',
        'duration-200',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-offset-2'
      )
    })
  })

  // Disabled state tests
  describe('Disabled State', () => {
    test('is not disabled by default', () => {
      render(<Button>Enabled</Button>)
      
      const button = screen.getByRole('button')
      expect(button).not.toBeDisabled()
      expect(button).not.toHaveClass('opacity-50', 'cursor-not-allowed')
    })

    test('applies disabled attribute when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('disabled')
    })

    test('applies disabled styling classes when disabled', () => {
      render(<Button disabled>Disabled</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed')
    })

    test('maintains other classes when disabled', () => {
      render(<Button disabled variant="danger" size="lg" className="custom-class">Disabled</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('bg-red-600', 'px-6', 'py-3', 'custom-class')
    })
  })

  // Custom className tests
  describe('Custom Classes', () => {
    test('applies custom className when provided', () => {
      render(<Button className="custom-class">Custom</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })

    test('combines custom className with base classes', () => {
      render(<Button className="custom-class">Custom</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class', 'inline-flex', 'bg-blue-600')
    })

    test('handles empty className gracefully', () => {
      render(<Button className="">Empty Class</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('inline-flex', 'bg-blue-600')
    })

    test('handles undefined className gracefully', () => {
      render(<Button>No Class</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('inline-flex', 'bg-blue-600')
    })
  })

  // Accessibility tests
  describe('Accessibility', () => {
    test('has button role by default', () => {
      render(<Button>Accessible</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    test('is focusable when not disabled', () => {
      render(<Button>Focusable</Button>)
      
      const button = screen.getByRole('button')
      button.focus()
      expect(button).toHaveFocus()
    })

    test('has focus styles applied', () => {
      render(<Button>Focus Test</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2')
    })

    test('maintains accessibility when disabled', () => {
      render(<Button disabled>Disabled Accessible</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('disabled')
    })
  })

  // Combination tests
  describe('Property Combinations', () => {
    test('combines all props correctly', () => {
      const handleClick = jest.fn()
      const handleKeyDown = jest.fn()
      
      render(
        <Button
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          variant="danger"
          size="lg"
          className="custom-class"
        >
          Combined Props
        </Button>
      )
      
      const button = screen.getByRole('button')
      
      // Check styling
      expect(button).toHaveClass(
        'bg-red-600',
        'px-6',
        'py-3',
        'text-lg',
        'custom-class'
      )
      
      // Check event handling
      fireEvent.click(button)
      expect(handleClick).toHaveBeenCalledTimes(1)
      
      fireEvent.keyDown(button, { key: 'Space' })
      expect(handleKeyDown).toHaveBeenCalledTimes(1)
    })

    test('disabled overrides event handlers', () => {
      const handleClick = jest.fn()
      const handleKeyDown = jest.fn()
      
      render(
        <Button
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          disabled
          variant="primary"
          size="sm"
          className="custom-class"
        >
          Disabled Combined
        </Button>
      )
      
      const button = screen.getByRole('button')
      
      // Check styling is still applied
      expect(button).toHaveClass(
        'bg-blue-600',
        'px-3',
        'py-1.5',
        'custom-class'
      )
      
      // Check disabled state
      expect(button).toBeDisabled()
      
      // Check events are not called
      fireEvent.click(button)
      fireEvent.keyDown(button, { key: 'Enter' })
      expect(handleClick).not.toHaveBeenCalled()
      expect(handleKeyDown).not.toHaveBeenCalled()
    })
  })

  // Edge cases
  describe('Edge Cases', () => {
    test('handles undefined onClick gracefully', () => {
      expect(() => {
        render(<Button>No onClick</Button>)
      }).not.toThrow()
      
      const button = screen.getByRole('button')
      expect(() => {
        fireEvent.click(button)
      }).not.toThrow()
    })

    test('handles undefined onKeyDown gracefully', () => {
      expect(() => {
        render(<Button>No onKeyDown</Button>)
      }).not.toThrow()
      
      const button = screen.getByRole('button')
      expect(() => {
        fireEvent.keyDown(button, { key: 'Enter' })
      }).not.toThrow()
    })

         test('handles empty children', () => {
       render(<Button>{''}</Button>)
       
       const button = screen.getByRole('button')
       expect(button).toBeInTheDocument()
       expect(button).toHaveTextContent('')
     })

    test('handles multiple rapid clicks', () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Rapid Click</Button>)
      
      const button = screen.getByRole('button')
      
      // Simulate rapid clicking
      fireEvent.click(button)
      fireEvent.click(button)
      fireEvent.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(3)
    })
  })
}) 