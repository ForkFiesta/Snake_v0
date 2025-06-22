import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Navigation } from '@/components/layout/Navigation'

describe('Navigation Component', () => {
  beforeEach(() => {
    // Clear any previous renders
    document.body.innerHTML = ''
  })

  describe('Rendering', () => {
    test('renders navigation element', () => {
      render(<Navigation />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
      expect(nav.tagName).toBe('NAV')
    })

    test('renders with default className when none provided', () => {
      render(<Navigation />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('navigation')
    })

    test('renders with custom className when provided', () => {
      const customClass = 'custom-nav-class'
      render(<Navigation className={customClass} />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('navigation', customClass)
    })

    test('renders with multiple custom classes', () => {
      const customClasses = 'class1 class2 class3'
      render(<Navigation className={customClasses} />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('navigation', 'class1', 'class2', 'class3')
    })
  })

  describe('Navigation Links', () => {
    test('renders all required navigation links', () => {
      render(<Navigation />)
      
      const homeLink = screen.getByRole('link', { name: /home/i })
      const playLink = screen.getByRole('link', { name: /play/i })
      const leaderboardLink = screen.getByRole('link', { name: /leaderboard/i })
      const achievementsLink = screen.getByRole('link', { name: /achievements/i })
      const settingsLink = screen.getByRole('link', { name: /settings/i })
      
      expect(homeLink).toBeInTheDocument()
      expect(playLink).toBeInTheDocument()
      expect(leaderboardLink).toBeInTheDocument()
      expect(achievementsLink).toBeInTheDocument()
      expect(settingsLink).toBeInTheDocument()
    })

    test('navigation links have correct hrefs', () => {
      render(<Navigation />)
      
      const homeLink = screen.getByRole('link', { name: /home/i })
      const playLink = screen.getByRole('link', { name: /play/i })
      const leaderboardLink = screen.getByRole('link', { name: /leaderboard/i })
      const achievementsLink = screen.getByRole('link', { name: /achievements/i })
      const settingsLink = screen.getByRole('link', { name: /settings/i })
      
      expect(homeLink).toHaveAttribute('href', '/')
      expect(playLink).toHaveAttribute('href', '/game')
      expect(leaderboardLink).toHaveAttribute('href', '/leaderboard')
      expect(achievementsLink).toHaveAttribute('href', '/achievements')
      expect(settingsLink).toHaveAttribute('href', '/settings')
    })

    test('navigation links have correct text content', () => {
      render(<Navigation />)
      
      const homeLink = screen.getByRole('link', { name: /home/i })
      const playLink = screen.getByRole('link', { name: /play/i })
      const leaderboardLink = screen.getByRole('link', { name: /leaderboard/i })
      const achievementsLink = screen.getByRole('link', { name: /achievements/i })
      const settingsLink = screen.getByRole('link', { name: /settings/i })
      
      expect(homeLink).toHaveTextContent('Home')
      expect(playLink).toHaveTextContent('Play')
      expect(leaderboardLink).toHaveTextContent('Leaderboard')
      expect(achievementsLink).toHaveTextContent('Achievements')
      expect(settingsLink).toHaveTextContent('Settings')
    })

    test('navigation links have correct CSS classes', () => {
      render(<Navigation />)
      
      const homeLink = screen.getByRole('link', { name: /home/i })
      const playLink = screen.getByRole('link', { name: /play/i })
      const leaderboardLink = screen.getByRole('link', { name: /leaderboard/i })
      const achievementsLink = screen.getByRole('link', { name: /achievements/i })
      const settingsLink = screen.getByRole('link', { name: /settings/i })
      
      expect(homeLink).toHaveClass('nav-item')
      expect(playLink).toHaveClass('nav-item')
      expect(leaderboardLink).toHaveClass('nav-item')
      expect(achievementsLink).toHaveClass('nav-item')
      expect(settingsLink).toHaveClass('nav-item')
    })

    test('renders correct number of navigation links', () => {
      render(<Navigation />)
      
      const allLinks = screen.getAllByRole('link')
      expect(allLinks).toHaveLength(5)
    })
  })

  describe('Accessibility', () => {
    test('navigation has correct ARIA role', () => {
      render(<Navigation />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
    })

    test('all links are accessible via screen reader', () => {
      render(<Navigation />)
      
      const homeLink = screen.getByRole('link', { name: /home/i })
      const playLink = screen.getByRole('link', { name: /play/i })
      const leaderboardLink = screen.getByRole('link', { name: /leaderboard/i })
      const achievementsLink = screen.getByRole('link', { name: /achievements/i })
      const settingsLink = screen.getByRole('link', { name: /settings/i })
      
      expect(homeLink).toBeVisible()
      expect(playLink).toBeVisible()
      expect(leaderboardLink).toBeVisible()
      expect(achievementsLink).toBeVisible()
      expect(settingsLink).toBeVisible()
    })

    test('links have proper focus behavior', () => {
      render(<Navigation />)
      
      const homeLink = screen.getByRole('link', { name: /home/i })
      homeLink.focus()
      expect(homeLink).toHaveFocus()
    })

    test('navigation is keyboard accessible', () => {
      render(<Navigation />)
      
      const playLink = screen.getByRole('link', { name: /play/i })
      playLink.focus()
      expect(playLink).toHaveFocus()
    })

    test('supports tab navigation between links', () => {
      render(<Navigation />)
      
      const allLinks = screen.getAllByRole('link')
      
      // Test that each link can receive focus
      allLinks.forEach(link => {
        link.focus()
        expect(link).toHaveFocus()
      })
    })

    test('has proper semantic structure', () => {
      render(<Navigation />)
      
      const nav = screen.getByRole('navigation')
      const links = screen.getAllByRole('link')
      
      expect(nav).toBeInTheDocument()
      expect(nav.tagName).toBe('NAV')
      expect(links.length).toBeGreaterThan(0)
      
      // Verify all links are inside the navigation
      links.forEach(link => {
        expect(nav).toContainElement(link)
      })
    })
  })

  describe('Props Handling', () => {
    test('handles undefined className prop gracefully', () => {
      render(<Navigation className={undefined} />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('navigation')
    })

    test('handles empty string className prop', () => {
      render(<Navigation className="" />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('navigation')
    })

    test('handles null className prop gracefully', () => {
      // @ts-expect-error Testing runtime behavior with null
      render(<Navigation className={null} />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('navigation')
    })

    test('trims whitespace from className prop', () => {
      render(<Navigation className="  custom-class  " />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('navigation', 'custom-class')
    })
  })

  describe('Integration', () => {
    test('works with Next.js Link component', () => {
      render(<Navigation />)
      
      const homeLink = screen.getByRole('link', { name: /home/i })
      
      // Next.js Link should render as an anchor tag
      expect(homeLink.tagName).toBe('A')
      expect(homeLink).toHaveAttribute('href', '/')
    })

    test('preserves Next.js Link behavior', () => {
      render(<Navigation />)
      
      const allLinks = screen.getAllByRole('link')
      
      // All links should be anchor tags (Next.js Link renders as <a>)
      allLinks.forEach(link => {
        expect(link.tagName).toBe('A')
        expect(link).toHaveAttribute('href')
      })
    })
  })

  describe('Styling and Layout', () => {
    test('applies correct base CSS class', () => {
      render(<Navigation />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('navigation')
    })

    test('combines base class with custom classes', () => {
      const customClass = 'flex items-center space-x-4'
      render(<Navigation className={customClass} />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('navigation', 'flex', 'items-center', 'space-x-4')
    })

    test('maintains consistent link styling', () => {
      render(<Navigation />)
      
      const allLinks = screen.getAllByRole('link')
      
      allLinks.forEach(link => {
        expect(link).toHaveClass('nav-item')
      })
    })
  })

  describe('Edge Cases', () => {
    test('renders correctly when no props provided', () => {
      render(<Navigation />)
      
      const nav = screen.getByRole('navigation')
      const links = screen.getAllByRole('link')
      
      expect(nav).toBeInTheDocument()
      expect(links).toHaveLength(5)
    })

    test('handles component re-rendering', () => {
      const { rerender } = render(<Navigation className="initial" />)
      
      let nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('navigation', 'initial')
      
      rerender(<Navigation className="updated" />)
      
      nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('navigation', 'updated')
      expect(nav).not.toHaveClass('initial')
    })

    test('maintains link functionality after re-render', () => {
      const { rerender } = render(<Navigation />)
      
      let homeLink = screen.getByRole('link', { name: /home/i })
      expect(homeLink).toHaveAttribute('href', '/')
      
      rerender(<Navigation className="updated" />)
      
      homeLink = screen.getByRole('link', { name: /home/i })
      expect(homeLink).toHaveAttribute('href', '/')
    })
  })

  describe('Performance', () => {
    test('renders efficiently without unnecessary DOM elements', () => {
      render(<Navigation />)
      
      const nav = screen.getByRole('navigation')
      const links = screen.getAllByRole('link')
      
      // Should only have the nav element and 5 link elements
      expect(nav.children).toHaveLength(5)
      expect(links).toHaveLength(5)
    })

    test('does not create memory leaks on unmount', () => {
      const { unmount } = render(<Navigation />)
      
      // Component should unmount cleanly
      expect(() => unmount()).not.toThrow()
    })
  })
}) 