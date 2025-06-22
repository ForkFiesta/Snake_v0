import React from 'react'
import Head from 'next/head'
import { Metadata } from 'next'

export interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  canonicalUrl?: string
}

// React component for rendering SEO meta tags
export function SEOHead({ 
  title = 'Snake Game - Classic Snake Game Online',
  description = 'Play the classic Snake game online. Modern, responsive design with smooth gameplay.',
  keywords = 'snake game, online game, classic game, browser game',
  ogImage = '/images/og-image.png',
  canonicalUrl
}: SEOHeadProps) {
  return (
    <Head>
      {/* Basic meta tags */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Title */}
      <title>{title}</title>
      
      {/* Meta description and keywords */}
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph meta tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      
      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical URL if provided */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    </Head>
  )
}

// Utility function for generating Next.js metadata (for App Router)
export function generateSEOMetadata({ 
  title = 'Snake Game - Classic Snake Game Online',
  description = 'Play the classic Snake game online. Modern, responsive design with smooth gameplay.',
  keywords = 'snake game, online game, classic game, browser game',
  ogImage = '/images/og-image.png',
  canonicalUrl
}: SEOHeadProps): Metadata {
  const keywordsArray = keywords.split(', ')
  
  const metadata: Metadata = {
    title,
    description,
    keywords: keywordsArray,
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
  
  // Add canonical URL if provided
  if (canonicalUrl) {
    metadata.alternates = {
      canonical: canonicalUrl
    }
  }
  
  return metadata
} 