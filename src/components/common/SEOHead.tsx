import { Metadata } from 'next'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
}

export function generateSEOMetadata({ 
  title = 'Snake Game - Classic Snake Game Online',
  description = 'Play the classic Snake game online. Modern, responsive design with smooth gameplay.',
  keywords = 'snake game, online game, classic game, browser game',
  ogImage = '/images/og-image.png'
}: SEOHeadProps): Metadata {
  return {
    title,
    description,
    keywords: keywords.split(', '),
    openGraph: {
      title,
      description,
      images: [ogImage],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
} 