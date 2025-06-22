import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Header } from '@/components/layout/Header'

describe('Header Component', () => {
  beforeEach(() => {
    // Clear any previous renders
    document.body.innerHTML = ''
  })

  describe('Rendering', () => {
    test('renders header element', () => {
      render(<Header />)
      
      const header = screen.getByRole('banner')
      expect(header).toBeInTheDocument()
      expect(header.tagName).toBe('HEADER')
    })

    test('renders with correct structure', () => {
      render(<Header />)
      
      const header = screen.getByRole('banner')
      const container = header.querySelector('.container')
      const nav = header.querySelector('nav')
      
      expect(container).toBeInTheDocument()
      expect(nav).toBeInTheDocument()
      expect(nav).toHaveRole('navigation')
    })

    test('renders navigation element', () => {
      render(<Header />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
      expect(nav.tagName).toBe('NAV')
    })
  })

  describe('Logo and Branding', () => {
    test('displays logo link', () => {
      render(<Header />)
      
      const logoLink = screen.getByRole('link', { name: /snake game/i })
      expect(logoLink).toBeInTheDocument()
      expect(logoLink).toHaveAttribute('href', '/')
    })

    test('logo link has correct text', () => {
      render(<Header />)
      
      const logoLink = screen.getByRole('link', { name: /snake game/i })
      expect(logoLink).toHaveTextContent('Snake Game')
    })

    test('logo link has correct CSS class', () => {
      render(<Header />)
      
      const logoLink = screen.getByRole('link', { name: /snake game/i })
      expect(logoLink).toHaveClass('logo')
    })
  })

  describe('Navigation Links', () => {
    test('renders all navigation links', () => {
      render(<Header />)
      
      const playLink = screen.getByRole('link', { name: /play/i })
      const leaderboardLink = screen.getByRole('link', { name: /leaderboard/i })
      const achievementsLink = screen.getByRole('link', { name: /achievements/i })
      const settingsLink = screen.getByRole('link', { name: /settings/i })
      
      expect(playLink).toBeInTheDocument()
      expect(leaderboardLink).toBeInTheDocument()
      expect(achievementsLink).toBeInTheDocument()
      expect(settingsLink).toBeInTheDocument()
    })

    test('navigation links have correct hrefs', () => {
      render(<Header />)
      
      const playLink = screen.getByRole('link', { name: /play/i })
      const leaderboardLink = screen.getByRole('link', { name: /leaderboard/i })
      const achievementsLink = screen.getByRole('link', { name: /achievements/i })
      const settingsLink = screen.getByRole('link', { name: /settings/i })
      
      expect(playLink).toHaveAttribute('href', '/game')
      expect(leaderboardLink).toHaveAttribute('href', '/leaderboard')
      expect(achievementsLink).toHaveAttribute('href', '/achievements')
      expect(settingsLink).toHaveAttribute('href', '/settings')
    })

    test('navigation links have correct CSS classes', () => {
      render(<Header />)
      
      const playLink = screen.getByRole('link', { name: /play/i })
      const leaderboardLink = screen.getByRole('link', { name: /leaderboard/i })
      const achievementsLink = screen.getByRole('link', { name: /achievements/i })
      const settingsLink = screen.getByRole('link', { name: /settings/i })
      
      expect(playLink).toHaveClass('nav-link')
      expect(leaderboardLink).toHaveClass('nav-link')
      expect(achievementsLink).toHaveClass('nav-link')
      expect(settingsLink).toHaveClass('nav-link')
    })

    test('navigation links container has correct class', () => {
      render(<Header />)
      
      const header = screen.getByRole('banner')
      const navLinksContainer = header.querySelector('.nav-links')
      
      expect(navLinksContainer).toBeInTheDocument()
      expect(navLinksContainer).toHaveClass('nav-links')
    })
  })

  describe('Styling and Layout', () => {
    test('applies correct CSS classes to header', () => {
      render(<Header />)
      
      const header = screen.getByRole('banner')
      expect(header).toHaveClass('header')
    })

    test('container has correct Tailwind classes', () => {
      render(<Header />)
      
      const header = screen.getByRole('banner')
      const container = header.querySelector('.container')
      
      expect(container).toHaveClass('mx-auto', 'px-4')
    })

    test('navigation has correct flex layout classes', () => {
      render(<Header />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('flex', 'items-center', 'justify-between', 'h-16')
    })

    test('has proper semantic structure', () => {
      render(<Header />)
      
      const header = screen.getByRole('banner')
      const nav = header.querySelector('nav')
      
      expect(nav).toBeInTheDocument()
      expect(nav?.tagName).toBe('NAV')
    })
  })

  describe('Accessibility', () => {
    test('header has correct ARIA role', () => {
      render(<Header />)
      
      const header = screen.getByRole('banner')
      expect(header).toBeInTheDocument()
    })

    test('navigation has correct ARIA role', () => {
      render(<Header />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
    })

    test('all links are accessible via screen reader', () => {
      render(<Header />)
      
      const logoLink = screen.getByRole('link', { name: /snake game/i })
      const playLink = screen.getByRole('link', { name: /play/i })
      const leaderboardLink = screen.getByRole('link', { name: /leaderboard/i })
      const achievementsLink = screen.getByRole('link', { name: /achievements/i })
      const settingsLink = screen.getByRole('link', { name: /settings/i })
      
      expect(logoLink).toBeVisible()
      expect(playLink).toBeVisible()
      expect(leaderboardLink).toBeVisible()
      expect(achievementsLink).toBeVisible()
      expect(settingsLink).toBeVisible()
    })

    test('links have proper focus behavior', () => {
      render(<Header />)
      
      const logoLink = screen.getByRole('link', { name: /snake game/i })
      logoLink.focus()
      expect(logoLink).toHaveFocus()
    })

    test('navigation is keyboard accessible', () => {
      render(<Header />)
      
      const playLink = screen.getByRole('link', { name: /play/i })
      playLink.focus()
      expect(playLink).toHaveFocus()
    })
  })

  describe('DOM Structure', () => {
    test('has proper nesting structure', () => {
      render(<Header />)
      
      const header = screen.getByRole('banner')
      const container = header.querySelector('.container') as HTMLElement
      const nav = container?.querySelector('nav') as HTMLElement
      const logoLink = nav?.querySelector('.logo') as HTMLElement
      const navLinks = nav?.querySelector('.nav-links') as HTMLElement
      
      expect(header).toContainElement(container)
      expect(container).toContainElement(nav)
      expect(nav).toContainElement(logoLink)
      expect(nav).toContainElement(navLinks)
    })

    test('header is a direct child of its parent', () => {
      const { container } = render(<Header />)
      
      const header = container.querySelector('header')
      expect(header).toBeInTheDocument()
      expect(header?.parentElement).toBe(container)
    })

    test('navigation links are properly nested', () => {
      render(<Header />)
      
      const header = screen.getByRole('banner')
      const navLinksContainer = header.querySelector('.nav-links') as HTMLElement
      const playLink = navLinksContainer?.querySelector('a[href="/game"]') as HTMLElement
      const leaderboardLink = navLinksContainer?.querySelector('a[href="/leaderboard"]') as HTMLElement
      const achievementsLink = navLinksContainer?.querySelector('a[href="/achievements"]') as HTMLElement
      const settingsLink = navLinksContainer?.querySelector('a[href="/settings"]') as HTMLElement
      
      expect(navLinksContainer).toContainElement(playLink)
      expect(navLinksContainer).toContainElement(leaderboardLink)
      expect(navLinksContainer).toContainElement(achievementsLink)
      expect(navLinksContainer).toContainElement(settingsLink)
    })
  })

  describe('Link Content Validation', () => {
    test('displays correct link text content', () => {
      render(<Header />)
      
      const playLink = screen.getByRole('link', { name: /play/i })
      const leaderboardLink = screen.getByRole('link', { name: /leaderboard/i })
      const achievementsLink = screen.getByRole('link', { name: /achievements/i })
      const settingsLink = screen.getByRole('link', { name: /settings/i })
      
      expect(playLink).toHaveTextContent('Play')
      expect(leaderboardLink).toHaveTextContent('Leaderboard')
      expect(achievementsLink).toHaveTextContent('Achievements')
      expect(settingsLink).toHaveTextContent('Settings')
    })

    test('link text is properly formatted', () => {
      render(<Header />)
      
      const playLink = screen.getByRole('link', { name: /play/i })
      expect(playLink.textContent).toBe('Play')
      expect(playLink.textContent).not.toContain('  ') // No double spaces
      expect(playLink.textContent?.trim()).toBe(playLink.textContent) // No leading/trailing spaces
    })

    test('logo text is properly formatted', () => {
      render(<Header />)
      
      const logoLink = screen.getByRole('link', { name: /snake game/i })
      expect(logoLink.textContent).toBe('Snake Game')
      expect(logoLink.textContent).not.toContain('  ') // No double spaces
      expect(logoLink.textContent?.trim()).toBe(logoLink.textContent) // No leading/trailing spaces
    })
  })

  describe('Component Isolation', () => {
    test('renders independently without props', () => {
      expect(() => render(<Header />)).not.toThrow()
    })

    test('does not interfere with other components', () => {
      const { container } = render(
        <div>
          <div data-testid="other-component">Other Component</div>
          <Header />
        </div>
      )
      
      const otherComponent = screen.getByTestId('other-component')
      const header = screen.getByRole('banner')
      
      expect(otherComponent).toBeInTheDocument()
      expect(header).toBeInTheDocument()
      expect(container.children).toHaveLength(1) // Wrapper div
    })

    test('maintains state independence', () => {
      const { rerender } = render(<Header />)
      
      // Re-render multiple times to ensure no state persistence
      rerender(<Header />)
      rerender(<Header />)
      
      const header = screen.getByRole('banner')
      expect(header).toBeInTheDocument()
    })
  })

  describe('Performance and Rendering', () => {
    test('renders without console errors', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      render(<Header />)
      
      expect(consoleSpy).not.toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    test('renders all elements in single render cycle', () => {
      const { container } = render(<Header />)
      
      // All elements should be present immediately
      const header = container.querySelector('header')
      const nav = container.querySelector('nav')
      const logoLink = container.querySelector('.logo')
      const navLinks = container.querySelector('.nav-links')
      
      expect(header).toBeInTheDocument()
      expect(nav).toBeInTheDocument()
      expect(logoLink).toBeInTheDocument()
      expect(navLinks).toBeInTheDocument()
    })

    test('has minimal DOM footprint', () => {
      const { container } = render(<Header />)
      
      // Should have reasonable number of DOM nodes
      const allElements = container.querySelectorAll('*')
      expect(allElements.length).toBeLessThan(20) // Reasonable upper bound
      expect(allElements.length).toBeGreaterThan(5) // Should have essential elements
    })
  })

  describe('Next.js Link Integration', () => {
    test('uses Next.js Link components', () => {
      render(<Header />)
      
      // All links should be rendered (mocked Next.js Link renders as regular anchor)
      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(5) // Logo + 4 nav links
    })

    test('logo link navigates to home page', () => {
      render(<Header />)
      
      const logoLink = screen.getByRole('link', { name: /snake game/i })
      expect(logoLink).toHaveAttribute('href', '/')
    })

    test('all navigation links have valid hrefs', () => {
      render(<Header />)
      
      const links = screen.getAllByRole('link')
      const expectedHrefs = ['/', '/game', '/leaderboard', '/achievements', '/settings']
      
      links.forEach((link) => {
        const href = link.getAttribute('href')
        expect(expectedHrefs).toContain(href)
      })
    })
  })
}) 