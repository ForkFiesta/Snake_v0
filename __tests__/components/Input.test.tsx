import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Input } from '@/components/ui/Input'

describe('Input Component', () => {
  // Basic rendering tests
  describe('Rendering', () => {
    test('renders input element', () => {
      render(<Input />)
      
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
    })

    test('renders with placeholder text', () => {
      const placeholder = 'Enter your name'
      render(<Input placeholder={placeholder} />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('placeholder', placeholder)
      expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument()
    })

    test('renders with initial value', () => {
      const value = 'Initial value'
      render(<Input value={value} />)
      
      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input.value).toBe(value)
      expect(screen.getByDisplayValue(value)).toBeInTheDocument()
    })

    test('renders as text input by default', () => {
      render(<Input />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'text')
    })

    test('renders with specified input type', () => {
      render(<Input type="email" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'email')
    })

    test('renders password input type', () => {
      render(<Input type="password" />)
      
      // Password inputs have a different role
      const input = document.querySelector('input[type="password"]')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'password')
    })

    test('renders number input type', () => {
      render(<Input type="number" />)
      
      const input = screen.getByRole('spinbutton')
      expect(input).toHaveAttribute('type', 'number')
    })
  })

  // Event handling tests
  describe('Event Handling', () => {
    test('calls onChange handler when value changes', () => {
      const handleChange = jest.fn()
      render(<Input onChange={handleChange} />)
      
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'new value' } })
      
      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({
        target: expect.objectContaining({
          value: 'new value'
        })
      }))
    })

    test('handles multiple onChange events', () => {
      const handleChange = jest.fn()
      render(<Input onChange={handleChange} />)
      
      const input = screen.getByRole('textbox')
      
      fireEvent.change(input, { target: { value: 'first' } })
      fireEvent.change(input, { target: { value: 'second' } })
      fireEvent.change(input, { target: { value: 'third' } })
      
      expect(handleChange).toHaveBeenCalledTimes(3)
      
      // Check that the onChange handler was called with proper event objects
      expect(handleChange).toHaveBeenNthCalledWith(1, expect.objectContaining({
        type: 'change',
        target: expect.any(HTMLInputElement)
      }))
      expect(handleChange).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: 'change',
        target: expect.any(HTMLInputElement)
      }))
      expect(handleChange).toHaveBeenNthCalledWith(3, expect.objectContaining({
        type: 'change',
        target: expect.any(HTMLInputElement)
      }))
    })

    test('handles onChange with empty value', () => {
      const handleChange = jest.fn()
      render(<Input value="initial" onChange={handleChange} />)
      
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: '' } })
      
      expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({
        type: 'change',
        target: expect.any(HTMLInputElement)
      }))
    })

    test('works without onChange handler', () => {
      expect(() => {
        render(<Input />)
      }).not.toThrow()
      
      const input = screen.getByRole('textbox')
      expect(() => {
        fireEvent.change(input, { target: { value: 'test' } })
      }).not.toThrow()
    })
  })

  // Styling tests
  describe('Styling', () => {
    test('applies base input class', () => {
      render(<Input />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('input')
    })

    test('applies custom className', () => {
      const customClass = 'custom-input-class'
      render(<Input className={customClass} />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('input', customClass)
    })

    test('combines base class with custom className', () => {
      render(<Input className="border-red-500 focus:ring-red-300" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('input', 'border-red-500', 'focus:ring-red-300')
    })

    test('handles empty className', () => {
      render(<Input className="" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('input')
    })

    test('handles undefined className', () => {
      render(<Input className={undefined} />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('input')
    })
  })

  // Controlled vs Uncontrolled tests
  describe('Controlled vs Uncontrolled', () => {
    test('works as uncontrolled component without value prop', () => {
      render(<Input />)
      
      const input = screen.getByRole('textbox') as HTMLInputElement
      
      fireEvent.change(input, { target: { value: 'typed value' } })
      expect(input.value).toBe('typed value')
    })

    test('works as controlled component with value prop', () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('initial')
        
        return (
          <Input 
            value={value} 
            onChange={(e) => setValue(e.target.value)} 
          />
        )
      }
      
      render(<TestComponent />)
      
      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input.value).toBe('initial')
      
      fireEvent.change(input, { target: { value: 'updated' } })
      expect(input.value).toBe('updated')
    })

    test('maintains controlled state when value prop changes', () => {
      const { rerender } = render(<Input value="first" />)
      
      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input.value).toBe('first')
      
      rerender(<Input value="second" />)
      expect(input.value).toBe('second')
    })
  })

  // Input types tests
  describe('Input Types', () => {
    const inputTypes = [
      { type: 'text', role: 'textbox' },
      { type: 'email', role: 'textbox' },
      { type: 'tel', role: 'textbox' },
      { type: 'url', role: 'textbox' },
      { type: 'search', role: 'searchbox' },
      { type: 'number', role: 'spinbutton' }
    ]

    inputTypes.forEach(({ type, role }) => {
      test(`renders ${type} input type correctly`, () => {
        render(<Input type={type} />)
        
        const input = screen.getByRole(role)
        expect(input).toHaveAttribute('type', type)
      })
    })

    test('renders password input without accessible role', () => {
      render(<Input type="password" placeholder="Password" />)
      
      const input = screen.getByPlaceholderText('Password')
      expect(input).toHaveAttribute('type', 'password')
    })

    test('renders hidden input', () => {
      render(<Input type="hidden" value="hidden-value" />)
      
      const input = document.querySelector('input[type="hidden"]')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'hidden')
      expect(input).toHaveAttribute('value', 'hidden-value')
    })
  })

  // Edge cases
  describe('Edge Cases', () => {
    test('handles undefined props gracefully', () => {
      expect(() => {
        render(<Input type={undefined} placeholder={undefined} value={undefined} />)
      }).not.toThrow()
      
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
    })

    test('handles null values gracefully', () => {
      expect(() => {
        render(<Input placeholder={null as any} />)
      }).not.toThrow()
    })

    test('handles very long values', () => {
      const longValue = 'a'.repeat(1000)
      render(<Input value={longValue} />)
      
      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input.value).toBe(longValue)
    })

    test('handles special characters in value', () => {
      const specialValue = '!@#$%^&*()_+-=[]{}|;:,.<>?'
      render(<Input value={specialValue} />)
      
      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input.value).toBe(specialValue)
    })

    test('handles unicode characters', () => {
      const unicodeValue = '你好世界 🌍 émojis'
      render(<Input value={unicodeValue} />)
      
      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input.value).toBe(unicodeValue)
    })

    test('handles rapid value changes', () => {
      const handleChange = jest.fn()
      render(<Input onChange={handleChange} />)
      
      const input = screen.getByRole('textbox')
      
      // Simulate rapid typing
      for (let i = 0; i < 10; i++) {
        fireEvent.change(input, { target: { value: `value${i}` } })
      }
      
      expect(handleChange).toHaveBeenCalledTimes(10)
    })
  })

  // Props validation
  describe('Props Validation', () => {
    test('accepts all valid HTML input attributes', () => {
      render(
        <Input
          type="email"
          placeholder="Email"
          value="test@example.com"
          className="custom-class"
        />
      )
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'email')
      expect(input).toHaveAttribute('placeholder', 'Email')
      expect(input).toHaveAttribute('value', 'test@example.com')
      expect(input).toHaveClass('custom-class')
    })

    test('works with minimal props', () => {
      render(<Input />)
      
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'text')
      expect(input).toHaveClass('input')
    })
  })

  // Component updates
  describe('Component Updates', () => {
    test('updates when props change', () => {
      const { rerender } = render(<Input value="initial" placeholder="First" />)
      
      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input.value).toBe('initial')
      expect(input).toHaveAttribute('placeholder', 'First')
      
      rerender(<Input value="updated" placeholder="Second" />)
      expect(input.value).toBe('updated')
      expect(input).toHaveAttribute('placeholder', 'Second')
    })

    test('updates type attribute', () => {
      const { rerender } = render(<Input type="text" />)
      
      let input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'text')
      
      rerender(<Input type="email" />)
      input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'email')
    })

    test('updates className', () => {
      const { rerender } = render(<Input className="first-class" />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('input', 'first-class')
      
      rerender(<Input className="second-class" />)
      expect(input).toHaveClass('input', 'second-class')
      expect(input).not.toHaveClass('first-class')
    })
  })
}) 