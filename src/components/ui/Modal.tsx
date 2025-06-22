import { ReactNode, useEffect, useRef, useCallback, useMemo, memo } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export const Modal = memo(function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  const titleId = useMemo(() => `modal-title-${Math.random().toString(36).substr(2, 9)}`, [])

  // Handle escape key press
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  // Focus trap implementation
  const handleTabKey = useCallback((event: KeyboardEvent) => {
    if (event.key !== 'Tab' || !modalRef.current) return

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault()
        lastElement?.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault()
        firstElement?.focus()
      }
    }
  }, [])

  // Combined keyboard event handler
  const handleKeyboardEvents = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose()
      return
    }
    
    if (event.key === 'Tab' && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement?.focus()
        }
      }
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousActiveElement.current = document.activeElement as HTMLElement
      
      // Prevent body scroll
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      
      // Add keyboard event listeners
      document.addEventListener('keydown', handleKeyboardEvents)
      
      // Focus the first focusable element or the modal itself
      const focusTimer = setTimeout(() => {
        if (modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
          const firstElement = focusableElements[0] as HTMLElement
          if (firstElement) {
            firstElement.focus()
          } else {
            modalRef.current.focus()
          }
        }
      }, 0)
      
      return () => {
        // Clear the focus timer
        clearTimeout(focusTimer)
        
        // Restore body scroll
        document.body.style.overflow = originalOverflow
        
        // Remove keyboard event listeners
        document.removeEventListener('keydown', handleKeyboardEvents)
        
        // Return focus to previously focused element
        if (previousActiveElement.current) {
          // Use setTimeout to ensure focus happens after modal is removed from DOM
          setTimeout(() => {
            if (previousActiveElement.current) {
              previousActiveElement.current.focus()
            }
          }, 0)
        }
      }
    }
  }, [isOpen, handleKeyboardEvents])

  if (!isOpen) return null

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      data-testid="modal-overlay"
    >
      <div 
        ref={modalRef}
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : 'Modal'}
        tabIndex={-1}
        data-testid="modal-content"
      >
        {title && (
          <h2 
            id={titleId}
            className="modal-title"
          >
            {title}
          </h2>
        )}
        <div className="modal-body" data-testid="modal-body">
          {children}
        </div>
        <button 
          className="modal-close" 
          onClick={onClose}
          aria-label="Close modal"
          type="button"
        >
          ×
        </button>
      </div>
    </div>
  )
}) 