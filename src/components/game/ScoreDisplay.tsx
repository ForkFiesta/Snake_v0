import React from 'react'
import { cn } from '@/lib/utils'

interface ScoreDisplayProps {
  currentScore: number
  highScore: number
  level?: number
  className?: string
  variant?: 'default' | 'compact' | 'detailed'
  showLevel?: boolean
  formatNumbers?: boolean
}

/**
 * ScoreDisplay component for showing current game score, high score, and level
 * Supports different variants and formatting options
 */
export function ScoreDisplay({ 
  currentScore, 
  highScore, 
  level = 1,
  className,
  variant = 'default',
  showLevel = true,
  formatNumbers = true
}: ScoreDisplayProps) {
  // Format numbers for better readability
  const formatNumber = (num: number): string => {
    if (!formatNumbers) return num.toString()
    
    // Handle special cases
    if (isNaN(num)) return 'NaN'
    if (!isFinite(num)) return num.toString()
    
    // Format large numbers with commas
    return num.toLocaleString()
  }

  // Variant-specific styling
  const containerClasses = cn(
    'score-display',
    'flex gap-4',
    {
      'flex-col space-y-2': variant === 'default',
      'flex-row items-center space-x-4': variant === 'compact',
      'grid grid-cols-1 md:grid-cols-3 gap-4': variant === 'detailed'
    },
    className
  )

  const itemClasses = cn(
    'score-item',
    'flex items-center justify-between',
    {
      'bg-white/10 rounded-lg p-3 backdrop-blur-sm': variant === 'detailed',
      'bg-gray-100 rounded px-2 py-1': variant === 'compact',
      'py-1': variant === 'default'
    }
  )

  const labelClasses = cn(
    'score-label',
    'font-medium text-gray-700',
    {
      'text-sm': variant === 'compact',
      'text-base': variant === 'default',
      'text-lg font-semibold': variant === 'detailed'
    }
  )

  const valueClasses = cn(
    'score-value',
    'font-bold tabular-nums',
    {
      'text-sm': variant === 'compact',
      'text-lg': variant === 'default',
      'text-xl': variant === 'detailed'
    }
  )

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <div className={itemClasses}>
        <span className={labelClasses} id="current-score-label">
          Score:
        </span>
        <span 
          className={cn(valueClasses, 'text-blue-600')}
          data-testid="current-score"
          aria-labelledby="current-score-label"
        >
          {formatNumber(currentScore)}
        </span>
      </div>
      
      <div className={itemClasses}>
        <span className={labelClasses} id="high-score-label">
          High Score:
        </span>
        <span 
          className={cn(valueClasses, 'text-green-600')}
          data-testid="high-score"
          aria-labelledby="high-score-label"
        >
          {formatNumber(highScore)}
        </span>
      </div>
      
      {showLevel && (
        <div className={itemClasses}>
          <span className={labelClasses} id="level-label">
            Level:
          </span>
          <span 
            className={cn(valueClasses, 'text-purple-600')}
            data-testid="level"
            aria-labelledby="level-label"
          >
            {formatNumber(level)}
          </span>
        </div>
      )}
    </div>
  )
} 