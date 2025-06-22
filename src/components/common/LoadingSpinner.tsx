import React from 'react'
import { cn } from '@/lib/utils/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  return (
    <div 
      data-testid="loading-spinner"
      className={cn(
        'loading-spinner',
        `loading-spinner-${size}`,
        className
      )}
      role="status"
      aria-label="Loading"
      aria-live="polite"
    >
      <div className={cn(
        'spinner',
        'animate-spin',
        'rounded-full border-2 border-gray-300',
        'border-t-blue-600',
        // Size variants
        size === 'sm' && 'w-4 h-4',
        size === 'md' && 'w-6 h-6', 
        size === 'lg' && 'w-8 h-8'
      )}></div>
      <span className="sr-only">Loading...</span>
    </div>
  )
} 