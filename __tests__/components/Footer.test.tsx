import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Footer } from '@/components/layout/Footer'

describe('Footer Component', () => {
  beforeEach(() => {
    // Clear any previous renders
    document.body.innerHTML = ''
  })

  describe('Rendering', () => {
    test('renders footer element', () => {
      render(<Footer />)
      
      const footer = screen.getByRole('contentinfo')
      expect(footer).toBeInTheDocument()
      expect(footer.tagName).toBe('FOOTER')
    })

    test('renders with correct structure', () => {
      render(<Footer />)
      
      const footer = screen.getByRole('contentinfo')
      const container = footer.querySelector('.container')
      const textContainer = footer.querySelector('.text-center')
      
      expect(container).toBeInTheDocument()
      expect(textContainer).toBeInTheDocument()
    })
  })

  describe('Content', () => {
    test('displays copyright text', () => {
      render(<Footer />)
      
      const currentYear = new Date().getFullYear()
      const copyrightText = screen.getByText(new RegExp(`© ${currentYear} Snake Game`, 'i'))
      expect(copyrightText).toBeInTheDocument()
    })

    test('mentions technology stack', () => {
      render(<Footer />)
      
      const techText = screen.getByText(/Built with Next\.js and TypeScript/i)
      expect(techText).toBeInTheDocument()
    })

    test('displays complete footer text', () => {
      render(<Footer />)
      
      const currentYear = new Date().getFullYear()
      const fullText = screen.getByText(`© ${currentYear} Snake Game. Built with Next.js and TypeScript.`)
      expect(fullText).toBeInTheDocument()
    })

    test('copyright symbol is properly encoded', () => {
      render(<Footer />)
      
      const textWithCopyright = screen.getByText(/©/)
      expect(textWithCopyright).toBeInTheDocument()
      expect(textWithCopyright.textContent).toContain('©')
    })
  })

  describe('Styling and Layout', () => {
    test('applies correct CSS classes', () => {
      render(<Footer />)
      
      const footer = screen.getByRole('contentinfo')
      expect(footer).toHaveClass('footer')
    })

    test('container has correct Tailwind classes', () => {
      render(<Footer />)
      
      const footer = screen.getByRole('contentinfo')
      const container = footer.querySelector('.container')
      
      expect(container).toHaveClass('mx-auto', 'px-4', 'py-8')
    })

    test('text is centered', () => {
      render(<Footer />)
      
      const footer = screen.getByRole('contentinfo')
      const textContainer = footer.querySelector('.text-center')
      
      expect(textContainer).toHaveClass('text-center')
    })

    test('has proper semantic structure', () => {
      render(<Footer />)
      
      const footer = screen.getByRole('contentinfo')
      const paragraph = footer.querySelector('p')
      
      expect(paragraph).toBeInTheDocument()
      expect(paragraph?.tagName).toBe('P')
    })
  })

  describe('Accessibility', () => {
    test('footer has correct ARIA role', () => {
      render(<Footer />)
      
      const footer = screen.getByRole('contentinfo')
      expect(footer).toBeInTheDocument()
    })

    test('footer is accessible via screen reader', () => {
      render(<Footer />)
      
      const footer = screen.getByRole('contentinfo')
      expect(footer).toBeVisible()
    })

    test('text content is readable', () => {
      render(<Footer />)
      
      const currentYear = new Date().getFullYear()
      const textElement = screen.getByText(new RegExp(`© ${currentYear} Snake Game`, 'i'))
      expect(textElement).toBeVisible()
      expect(textElement).not.toHaveAttribute('aria-hidden')
    })
  })

  describe('DOM Structure', () => {
    test('has proper nesting structure', () => {
      render(<Footer />)
      
      const footer = screen.getByRole('contentinfo')
      const container = footer.querySelector('.container') as HTMLElement
      const textCenter = container?.querySelector('.text-center') as HTMLElement
      const paragraph = textCenter?.querySelector('p') as HTMLParagraphElement
      
      expect(footer).toContainElement(container)
      expect(container).toContainElement(textCenter)
      expect(textCenter).toContainElement(paragraph)
    })

    test('footer is a direct child of its parent', () => {
      const { container } = render(<Footer />)
      
      const footer = container.querySelector('footer')
      expect(footer).toBeInTheDocument()
      expect(footer?.parentElement).toBe(container)
    })
  })

  describe('Text Content Validation', () => {
    test('displays current year in copyright', () => {
      render(<Footer />)
      
      const currentYear = new Date().getFullYear()
      const yearText = screen.getByText(new RegExp(`© ${currentYear}`))
      expect(yearText).toBeInTheDocument()
    })

    test('mentions specific technologies', () => {
      render(<Footer />)
      
      const nextjsText = screen.getByText(/Next\.js/i)
      const typescriptText = screen.getByText(/TypeScript/i)
      
      expect(nextjsText).toBeInTheDocument()
      expect(typescriptText).toBeInTheDocument()
    })

    test('text is properly formatted', () => {
      render(<Footer />)
      
      const currentYear = new Date().getFullYear()
      const paragraph = screen.getByText(new RegExp(`© ${currentYear} Snake Game`, 'i'))
      expect(paragraph.textContent).toBe(`© ${currentYear} Snake Game. Built with Next.js and TypeScript.`)
      expect(paragraph.textContent).not.toContain('  ') // No double spaces
      expect(paragraph.textContent?.trim()).toBe(paragraph.textContent) // No leading/trailing spaces
    })
  })

  describe('Component Isolation', () => {
    test('renders independently without props', () => {
      expect(() => render(<Footer />)).not.toThrow()
    })

    test('does not interfere with other components', () => {
      const { container } = render(
        <div>
          <div data-testid="other-component">Other Component</div>
          <Footer />
        </div>
      )
      
      const otherComponent = screen.getByTestId('other-component')
      const footer = screen.getByRole('contentinfo')
      
      expect(otherComponent).toBeInTheDocument()
      expect(footer).toBeInTheDocument()
      expect(container.children).toHaveLength(1) // Wrapper div
    })

    test('maintains consistent rendering across multiple renders', () => {
      const { rerender } = render(<Footer />)
      const firstRender = screen.getByRole('contentinfo').innerHTML
      
      rerender(<Footer />)
      const secondRender = screen.getByRole('contentinfo').innerHTML
      
      expect(firstRender).toBe(secondRender)
    })
  })
}) 