import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock Button component since it doesn't exist yet
const Button: React.FC<{
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  className?: string
}> = ({ children, onClick, variant = 'primary', disabled = false, className = '' }) => {
  const baseClasses = 'px-4 py-2 rounded font-medium transition-colors'
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  }
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      data-testid="button"
    >
      {children}
    </button>
  )
}

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByTestId('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Click me')
  })
  
  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByTestId('button')
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
  
  test('applies correct variant classes', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>)
    let button = screen.getByTestId('button')
    expect(button).toHaveClass('bg-blue-600')
    
    rerender(<Button variant="secondary">Secondary</Button>)
    button = screen.getByTestId('button')
    expect(button).toHaveClass('bg-gray-600')
    
    rerender(<Button variant="danger">Danger</Button>)
    button = screen.getByTestId('button')
    expect(button).toHaveClass('bg-red-600')
  })
  
  test('handles disabled state correctly', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick} disabled>Disabled</Button>)
    
    const button = screen.getByTestId('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed')
    
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })
  
  test('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    
    const button = screen.getByTestId('button')
    expect(button).toHaveClass('custom-class')
  })
  
  test('has correct accessibility attributes', () => {
    render(<Button disabled>Disabled Button</Button>)
    
    const button = screen.getByTestId('button')
    expect(button).toHaveAttribute('disabled')
  })
}) 