import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SEOHead, generateSEOMetadata } from '@/components/common/SEOHead'

// Mock Next.js Head component
jest.mock('next/head', () => {
  return function Head({ children }: { children: React.ReactNode }) {
    return <div data-testid="next-head">{children}</div>
  }
})

describe('SEOHead Component', () => {
  describe('SEOHead React Component', () => {
    test('should render with default SEO meta tags', () => {
      const { container } = render(<SEOHead />)
      
      const headElement = container.querySelector('[data-testid="next-head"]')
      expect(headElement).toBeInTheDocument()
      
      // Check for title tag
      const titleElement = container.querySelector('title')
      expect(titleElement).toBeInTheDocument()
      expect(titleElement?.textContent).toBe('Snake Game - Classic Snake Game Online')
      
      // Check for meta description
      const descriptionMeta = container.querySelector('meta[name="description"]')
      expect(descriptionMeta).toBeInTheDocument()
      expect(descriptionMeta?.getAttribute('content')).toBe('Play the classic Snake game online. Modern, responsive design with smooth gameplay.')
      
      // Check for meta keywords
      const keywordsMeta = container.querySelector('meta[name="keywords"]')
      expect(keywordsMeta).toBeInTheDocument()
      expect(keywordsMeta?.getAttribute('content')).toBe('snake game, online game, classic game, browser game')
      
      // Check for Open Graph meta tags
      const ogTitle = container.querySelector('meta[property="og:title"]')
      expect(ogTitle).toBeInTheDocument()
      expect(ogTitle?.getAttribute('content')).toBe('Snake Game - Classic Snake Game Online')
      
      const ogDescription = container.querySelector('meta[property="og:description"]')
      expect(ogDescription).toBeInTheDocument()
      expect(ogDescription?.getAttribute('content')).toBe('Play the classic Snake game online. Modern, responsive design with smooth gameplay.')
      
      const ogImage = container.querySelector('meta[property="og:image"]')
      expect(ogImage).toBeInTheDocument()
      expect(ogImage?.getAttribute('content')).toBe('/images/og-image.png')
      
      const ogType = container.querySelector('meta[property="og:type"]')
      expect(ogType).toBeInTheDocument()
      expect(ogType?.getAttribute('content')).toBe('website')
      
      // Check for Twitter Card meta tags
      const twitterCard = container.querySelector('meta[name="twitter:card"]')
      expect(twitterCard).toBeInTheDocument()
      expect(twitterCard?.getAttribute('content')).toBe('summary_large_image')
      
      const twitterTitle = container.querySelector('meta[name="twitter:title"]')
      expect(twitterTitle).toBeInTheDocument()
      expect(twitterTitle?.getAttribute('content')).toBe('Snake Game - Classic Snake Game Online')
      
      const twitterDescription = container.querySelector('meta[name="twitter:description"]')
      expect(twitterDescription).toBeInTheDocument()
      expect(twitterDescription?.getAttribute('content')).toBe('Play the classic Snake game online. Modern, responsive design with smooth gameplay.')
      
      const twitterImage = container.querySelector('meta[name="twitter:image"]')
      expect(twitterImage).toBeInTheDocument()
      expect(twitterImage?.getAttribute('content')).toBe('/images/og-image.png')
    })

    test('should render with custom title', () => {
      const customTitle = 'Custom Snake Game Title'
      const { container } = render(<SEOHead title={customTitle} />)
      
      const titleElement = container.querySelector('title')
      expect(titleElement?.textContent).toBe(customTitle)
      
      const ogTitle = container.querySelector('meta[property="og:title"]')
      expect(ogTitle?.getAttribute('content')).toBe(customTitle)
      
      const twitterTitle = container.querySelector('meta[name="twitter:title"]')
      expect(twitterTitle?.getAttribute('content')).toBe(customTitle)
    })

    test('should render with custom description', () => {
      const customDescription = 'A custom description for the snake game'
      const { container } = render(<SEOHead description={customDescription} />)
      
      const descriptionMeta = container.querySelector('meta[name="description"]')
      expect(descriptionMeta?.getAttribute('content')).toBe(customDescription)
      
      const ogDescription = container.querySelector('meta[property="og:description"]')
      expect(ogDescription?.getAttribute('content')).toBe(customDescription)
      
      const twitterDescription = container.querySelector('meta[name="twitter:description"]')
      expect(twitterDescription?.getAttribute('content')).toBe(customDescription)
    })

    test('should render with custom keywords', () => {
      const customKeywords = 'game, fun, entertainment, arcade'
      const { container } = render(<SEOHead keywords={customKeywords} />)
      
      const keywordsMeta = container.querySelector('meta[name="keywords"]')
      expect(keywordsMeta?.getAttribute('content')).toBe(customKeywords)
    })

    test('should render with custom ogImage', () => {
      const customImage = '/images/custom-og.png'
      const { container } = render(<SEOHead ogImage={customImage} />)
      
      const ogImage = container.querySelector('meta[property="og:image"]')
      expect(ogImage?.getAttribute('content')).toBe(customImage)
      
      const twitterImage = container.querySelector('meta[name="twitter:image"]')
      expect(twitterImage?.getAttribute('content')).toBe(customImage)
    })

    test('should render with all custom props', () => {
      const customProps = {
        title: 'Ultimate Snake Game',
        description: 'The best snake game experience online',
        keywords: 'ultimate, snake, best, game',
        ogImage: '/images/ultimate-snake.png'
      }
      
      const { container } = render(<SEOHead {...customProps} />)
      
      // Check title
      const titleElement = container.querySelector('title')
      expect(titleElement?.textContent).toBe(customProps.title)
      
      // Check description
      const descriptionMeta = container.querySelector('meta[name="description"]')
      expect(descriptionMeta?.getAttribute('content')).toBe(customProps.description)
      
      // Check keywords
      const keywordsMeta = container.querySelector('meta[name="keywords"]')
      expect(keywordsMeta?.getAttribute('content')).toBe(customProps.keywords)
      
      // Check Open Graph
      const ogTitle = container.querySelector('meta[property="og:title"]')
      expect(ogTitle?.getAttribute('content')).toBe(customProps.title)
      
      const ogDescription = container.querySelector('meta[property="og:description"]')
      expect(ogDescription?.getAttribute('content')).toBe(customProps.description)
      
      const ogImage = container.querySelector('meta[property="og:image"]')
      expect(ogImage?.getAttribute('content')).toBe(customProps.ogImage)
      
      // Check Twitter
      const twitterTitle = container.querySelector('meta[name="twitter:title"]')
      expect(twitterTitle?.getAttribute('content')).toBe(customProps.title)
      
      const twitterDescription = container.querySelector('meta[name="twitter:description"]')
      expect(twitterDescription?.getAttribute('content')).toBe(customProps.description)
      
      const twitterImage = container.querySelector('meta[name="twitter:image"]')
      expect(twitterImage?.getAttribute('content')).toBe(customProps.ogImage)
    })

    test('should handle empty props gracefully', () => {
      const { container } = render(<SEOHead title="" description="" keywords="" ogImage="" />)
      
      // Should still render meta tags but with empty content
      const titleElement = container.querySelector('title')
      expect(titleElement?.textContent).toBe('')
      
      const descriptionMeta = container.querySelector('meta[name="description"]')
      expect(descriptionMeta?.getAttribute('content')).toBe('')
      
      const keywordsMeta = container.querySelector('meta[name="keywords"]')
      expect(keywordsMeta?.getAttribute('content')).toBe('')
    })

    test('should handle special characters in props', () => {
      const specialTitle = 'Snake Game: The Ultimate Experience! 🐍'
      const specialDescription = 'Play the classic Snake game with special chars: @#$%^&*()'
      
      const { container } = render(
        <SEOHead title={specialTitle} description={specialDescription} />
      )
      
      const titleElement = container.querySelector('title')
      expect(titleElement?.textContent).toBe(specialTitle)
      
      const descriptionMeta = container.querySelector('meta[name="description"]')
      expect(descriptionMeta?.getAttribute('content')).toBe(specialDescription)
    })

    test('should include viewport meta tag for responsive design', () => {
      const { container } = render(<SEOHead />)
      
      const viewportMeta = container.querySelector('meta[name="viewport"]')
      expect(viewportMeta).toBeInTheDocument()
      expect(viewportMeta?.getAttribute('content')).toBe('width=device-width, initial-scale=1')
    })

    test('should include charset meta tag', () => {
      const { container } = render(<SEOHead />)
      
      const charsetMeta = container.querySelector('meta[charset]')
      expect(charsetMeta).toBeInTheDocument()
      expect(charsetMeta?.getAttribute('charset')).toBe('utf-8')
    })

    test('should include canonical URL if provided', () => {
      const canonicalUrl = 'https://example.com/snake-game'
      const { container } = render(<SEOHead canonicalUrl={canonicalUrl} />)
      
      const canonicalLink = container.querySelector('link[rel="canonical"]')
      expect(canonicalLink).toBeInTheDocument()
      expect(canonicalLink?.getAttribute('href')).toBe(canonicalUrl)
    })

    test('should not include canonical URL if not provided', () => {
      const { container } = render(<SEOHead />)
      
      const canonicalLink = container.querySelector('link[rel="canonical"]')
      expect(canonicalLink).not.toBeInTheDocument()
    })
  })

  describe('generateSEOMetadata utility function', () => {
    test('should generate metadata with default values when no props provided', () => {
      const metadata = generateSEOMetadata({})
      
      expect(metadata.title).toBe('Snake Game - Classic Snake Game Online')
      expect(metadata.description).toBe('Play the classic Snake game online. Modern, responsive design with smooth gameplay.')
      expect(metadata.keywords).toEqual(['snake game', 'online game', 'classic game', 'browser game'])
      
      // Test OpenGraph metadata structure (without testing exact type property)
      expect(metadata.openGraph).toBeDefined()
      expect(metadata.openGraph?.title).toBe('Snake Game - Classic Snake Game Online')
      expect(metadata.openGraph?.description).toBe('Play the classic Snake game online. Modern, responsive design with smooth gameplay.')
      expect(metadata.openGraph?.images).toEqual(['/images/og-image.png'])
      
      // Test Twitter metadata structure (without testing exact card property)
      expect(metadata.twitter).toBeDefined()
      expect(metadata.twitter?.title).toBe('Snake Game - Classic Snake Game Online')
      expect(metadata.twitter?.description).toBe('Play the classic Snake game online. Modern, responsive design with smooth gameplay.')
      expect(metadata.twitter?.images).toEqual(['/images/og-image.png'])
    })
    
    test('should generate metadata with custom title', () => {
      const customTitle = 'Custom Snake Game Title'
      const metadata = generateSEOMetadata({ title: customTitle })
      
      expect(metadata.title).toBe(customTitle)
      expect(metadata.openGraph?.title).toBe(customTitle)
      expect(metadata.twitter?.title).toBe(customTitle)
    })
    
    test('should generate metadata with custom description', () => {
      const customDescription = 'A custom description for the snake game'
      const metadata = generateSEOMetadata({ description: customDescription })
      
      expect(metadata.description).toBe(customDescription)
      expect(metadata.openGraph?.description).toBe(customDescription)
      expect(metadata.twitter?.description).toBe(customDescription)
    })
    
    test('should handle custom keywords string and convert to array', () => {
      const customKeywords = 'game, fun, entertainment, arcade'
      const metadata = generateSEOMetadata({ keywords: customKeywords })
      
      expect(metadata.keywords).toEqual(['game', 'fun', 'entertainment', 'arcade'])
    })
    
    test('should handle single keyword without commas', () => {
      const singleKeyword = 'snake'
      const metadata = generateSEOMetadata({ keywords: singleKeyword })
      
      expect(metadata.keywords).toEqual(['snake'])
    })
    
    test('should handle empty keywords string', () => {
      const emptyKeywords = ''
      const metadata = generateSEOMetadata({ keywords: emptyKeywords })
      
      expect(metadata.keywords).toEqual([''])
    })
    
    test('should generate metadata with custom ogImage', () => {
      const customImage = '/images/custom-og.png'
      const metadata = generateSEOMetadata({ ogImage: customImage })
      
      expect(metadata.openGraph?.images).toEqual([customImage])
      expect(metadata.twitter?.images).toEqual([customImage])
    })
    
    test('should generate metadata with all custom props', () => {
      const customProps = {
        title: 'Ultimate Snake Game',
        description: 'The best snake game experience online',
        keywords: 'ultimate, snake, best, game',
        ogImage: '/images/ultimate-snake.png'
      }
      
      const metadata = generateSEOMetadata(customProps)
      
      expect(metadata.title).toBe(customProps.title)
      expect(metadata.description).toBe(customProps.description)
      expect(metadata.keywords).toEqual(['ultimate', 'snake', 'best', 'game'])
      
      expect(metadata.openGraph?.title).toBe(customProps.title)
      expect(metadata.openGraph?.description).toBe(customProps.description)
      expect(metadata.openGraph?.images).toEqual([customProps.ogImage])
      
      expect(metadata.twitter?.title).toBe(customProps.title)
      expect(metadata.twitter?.description).toBe(customProps.description)
      expect(metadata.twitter?.images).toEqual([customProps.ogImage])
    })
    
    test('should handle undefined props gracefully', () => {
      const metadata = generateSEOMetadata({
        title: undefined,
        description: undefined,
        keywords: undefined,
        ogImage: undefined
      })
      
      // Should fall back to defaults
      expect(metadata.title).toBe('Snake Game - Classic Snake Game Online')
      expect(metadata.description).toBe('Play the classic Snake game online. Modern, responsive design with smooth gameplay.')
      expect(metadata.keywords).toEqual(['snake game', 'online game', 'classic game', 'browser game'])
      expect(metadata.openGraph?.images).toEqual(['/images/og-image.png'])
    })

    test('should handle canonical URL in metadata', () => {
      const canonicalUrl = 'https://example.com/snake-game'
      const metadata = generateSEOMetadata({ canonicalUrl })
      
      expect(metadata.alternates?.canonical).toBe(canonicalUrl)
    })

    test('should return proper metadata structure', () => {
      const metadata = generateSEOMetadata({})
      
      // Check that all required properties exist
      expect(metadata).toHaveProperty('title')
      expect(metadata).toHaveProperty('description')
      expect(metadata).toHaveProperty('keywords')
      expect(metadata).toHaveProperty('openGraph')
      expect(metadata).toHaveProperty('twitter')
      
      // Type assertions to ensure proper typing
      expect(typeof metadata.title).toBe('string')
      expect(typeof metadata.description).toBe('string')
      expect(Array.isArray(metadata.keywords)).toBe(true)
      expect(typeof metadata.openGraph).toBe('object')
      expect(typeof metadata.twitter).toBe('object')
    })
  })
}) 