'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

interface Props {
  children?: ReactNode
  className?: string
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // You can also log the error to an error reporting service here
    // Example: errorReportingService.captureException(error, { extra: errorInfo })
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className={cn(
          'error-boundary',
          'flex flex-col items-center justify-center',
          'min-h-[200px] p-6 bg-red-50 border border-red-200 rounded-lg',
          'text-center space-y-4',
          this.props.className
        )}>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-red-800">
              Something went wrong.
            </h2>
            <p className="text-sm text-red-600 max-w-md">
              An unexpected error occurred. Please try again or refresh the page.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={this.handleReset}
              variant="primary"
              size="sm"
            >
              Try again
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="secondary"
              size="sm"
            >
              Refresh page
            </Button>
          </div>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4 p-3 bg-red-100 rounded border text-left max-w-full">
              <summary className="cursor-pointer text-sm font-medium text-red-800">
                Error Details (Development Only)
              </summary>
              <pre className="mt-2 text-xs text-red-700 whitespace-pre-wrap break-all">
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
} 