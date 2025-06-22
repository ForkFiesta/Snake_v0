import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Modal } from '@/components/ui/Modal'

describe('Modal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    children: <div>Modal content</div>
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Basic rendering tests
  describe('Rendering', () => {
    test('renders modal when isOpen is true', () => {
      render(<Modal {...defaultProps} />)
      
      expect(screen.getByText('Modal content')).toBeInTheDocument()
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    test('does not render modal when isOpen is false', () => {
      render(<Modal {...defaultProps} isOpen={false} />)
      
      expect(screen.queryByText('Modal content')).not.toBeInTheDocument()
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    test('renders modal with title when provided', () => {
      render(<Modal {...defaultProps} title="Test Modal" />)
      
      expect(screen.getByText('Test Modal')).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Test Modal')
    })

    test('renders modal without title when not provided', () => {
      render(<Modal {...defaultProps} />)
      
      expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    })

    test('renders children content correctly', () => {
      const complexContent = (
        <div>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
          <button>Action Button</button>
        </div>
      )
      
      render(<Modal {...defaultProps}>{complexContent}</Modal>)
      
      expect(screen.getByText('Paragraph 1')).toBeInTheDocument()
      expect(screen.getByText('Paragraph 2')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument()
    })

    test('renders close button', () => {
      render(<Modal {...defaultProps} />)
      
      const closeButton = screen.getByRole('button', { name: /close/i })
      expect(closeButton).toBeInTheDocument()
      expect(closeButton).toHaveTextContent('×')
    })
  })

  // Event handling tests
  describe('Event Handling', () => {
    test('calls onClose when close button is clicked', () => {
      const onClose = jest.fn()
      render(<Modal {...defaultProps} onClose={onClose} />)
      
      const closeButton = screen.getByRole('button', { name: /close/i })
      fireEvent.click(closeButton)
      
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    test('calls onClose when overlay is clicked', () => {
      const onClose = jest.fn()
      render(<Modal {...defaultProps} onClose={onClose} />)
      
      const overlay = screen.getByTestId('modal-overlay')
      fireEvent.click(overlay)
      
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    test('does not call onClose when modal content is clicked', () => {
      const onClose = jest.fn()
      render(<Modal {...defaultProps} onClose={onClose} />)
      
      const modalContent = screen.getByTestId('modal-content')
      fireEvent.click(modalContent)
      
      expect(onClose).not.toHaveBeenCalled()
    })

    test('calls onClose when Escape key is pressed', () => {
      const onClose = jest.fn()
      render(<Modal {...defaultProps} onClose={onClose} />)
      
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
      
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    test('does not call onClose when other keys are pressed', () => {
      const onClose = jest.fn()
      render(<Modal {...defaultProps} onClose={onClose} />)
      
      fireEvent.keyDown(document, { key: 'Enter', code: 'Enter' })
      fireEvent.keyDown(document, { key: 'Space', code: 'Space' })
      fireEvent.keyDown(document, { key: 'Tab', code: 'Tab' })
      
      expect(onClose).not.toHaveBeenCalled()
    })
  })

  // Accessibility tests
  describe('Accessibility', () => {
    test('has proper ARIA attributes', () => {
      render(<Modal {...defaultProps} title="Test Modal" />)
      
      const modal = screen.getByRole('dialog')
      expect(modal).toHaveAttribute('aria-modal', 'true')
      expect(modal).toHaveAttribute('aria-labelledby')
      
      const title = screen.getByRole('heading', { level: 2 })
      expect(title).toHaveAttribute('id')
      expect(modal.getAttribute('aria-labelledby')).toBe(title.getAttribute('id'))
    })

    test('has aria-label when no title is provided', () => {
      render(<Modal {...defaultProps} />)
      
      const modal = screen.getByRole('dialog')
      expect(modal).toHaveAttribute('aria-label', 'Modal')
    })

    test('close button has accessible label', () => {
      render(<Modal {...defaultProps} />)
      
      const closeButton = screen.getByRole('button', { name: /close/i })
      expect(closeButton).toHaveAttribute('aria-label', 'Close modal')
    })

    test('traps focus within modal', async () => {
      render(
        <Modal {...defaultProps}>
          <div>
            <input data-testid="input1" />
            <button data-testid="button1">Button 1</button>
            <button data-testid="button2">Button 2</button>
          </div>
        </Modal>
      )

      const input = screen.getByTestId('input1')
      const button1 = screen.getByTestId('button1')
      const button2 = screen.getByTestId('button2')
      const closeButton = screen.getByRole('button', { name: /close/i })

      // Focus should start on the first focusable element
      await waitFor(() => {
        expect(input).toHaveFocus()
      })

      // Manually focus through elements to test focus trap logic
      button1.focus()
      expect(button1).toHaveFocus()

      button2.focus()
      expect(button2).toHaveFocus()

      closeButton.focus()
      expect(closeButton).toHaveFocus()

      // Test focus trap by simulating tab on last element
      fireEvent.keyDown(closeButton, { key: 'Tab', code: 'Tab' })
      await waitFor(() => {
        expect(input).toHaveFocus()
      })

      // Test reverse focus trap by simulating shift+tab on first element
      fireEvent.keyDown(input, { key: 'Tab', code: 'Tab', shiftKey: true })
      await waitFor(() => {
        expect(closeButton).toHaveFocus()
      })
    })

    test('returns focus to trigger element when closed', async () => {
      const TriggerButton = () => {
        const [isOpen, setIsOpen] = React.useState(false)
        return (
          <div>
            <button onClick={() => setIsOpen(true)} data-testid="trigger">
              Open Modal
            </button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              Modal content
            </Modal>
          </div>
        )
      }

      render(<TriggerButton />)

      const triggerButton = screen.getByTestId('trigger')
      
      // Manually focus the trigger first to simulate real user interaction
      triggerButton.focus()
      expect(triggerButton).toHaveFocus()
      
      fireEvent.click(triggerButton)

      // Modal should be open
      expect(screen.getByRole('dialog')).toBeInTheDocument()

      // Close modal
      const closeButton = screen.getByRole('button', { name: /close/i })
      fireEvent.click(closeButton)

      // Wait for modal to be removed from DOM
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      // Focus should return to trigger (with longer timeout for async focus)
      await waitFor(() => {
        expect(triggerButton).toHaveFocus()
      }, { timeout: 100 })
    })
  })

  // Styling tests
  describe('Styling', () => {
    test('applies correct CSS classes to overlay', () => {
      render(<Modal {...defaultProps} />)
      
      const overlay = screen.getByTestId('modal-overlay')
      expect(overlay).toHaveClass('modal-overlay')
    })

    test('applies correct CSS classes to content', () => {
      render(<Modal {...defaultProps} />)
      
      const content = screen.getByTestId('modal-content')
      expect(content).toHaveClass('modal-content')
    })

    test('applies correct CSS classes to title', () => {
      render(<Modal {...defaultProps} title="Test" />)
      
      const title = screen.getByRole('heading', { level: 2 })
      expect(title).toHaveClass('modal-title')
    })

    test('applies correct CSS classes to body', () => {
      render(<Modal {...defaultProps} />)
      
      const body = screen.getByTestId('modal-body')
      expect(body).toHaveClass('modal-body')
    })

    test('applies correct CSS classes to close button', () => {
      render(<Modal {...defaultProps} />)
      
      const closeButton = screen.getByRole('button', { name: /close/i })
      expect(closeButton).toHaveClass('modal-close')
    })
  })

  // Edge cases and error handling
  describe('Edge Cases', () => {
    test('handles null children gracefully', () => {
      render(<Modal {...defaultProps}>{null}</Modal>)
      
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByTestId('modal-body')).toBeEmptyDOMElement()
    })

    test('handles undefined children gracefully', () => {
      render(<Modal {...defaultProps}>{undefined}</Modal>)
      
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByTestId('modal-body')).toBeEmptyDOMElement()
    })

    test('handles empty string title', () => {
      render(<Modal {...defaultProps} title="" />)
      
      expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    })

    test('handles multiple rapid open/close cycles', () => {
      const { rerender } = render(<Modal {...defaultProps} isOpen={false} />)
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      
      rerender(<Modal {...defaultProps} isOpen={true} />)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      
      rerender(<Modal {...defaultProps} isOpen={false} />)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      
      rerender(<Modal {...defaultProps} isOpen={true} />)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    test('prevents body scroll when modal is open', () => {
      render(<Modal {...defaultProps} />)
      
      expect(document.body).toHaveStyle('overflow: hidden')
    })

    test('restores body scroll when modal is closed', () => {
      const { rerender } = render(<Modal {...defaultProps} isOpen={true} />)
      expect(document.body).toHaveStyle('overflow: hidden')
      
      rerender(<Modal {...defaultProps} isOpen={false} />)
      expect(document.body).not.toHaveStyle('overflow: hidden')
    })
  })

  // Performance tests
  describe('Performance', () => {
    test('does not re-render unnecessarily', () => {
      const renderSpy = jest.fn()
      const TestModal = React.memo(function TestModal(props: any) {
        renderSpy()
        return <Modal {...props} />
      })

      const { rerender } = render(<TestModal {...defaultProps} />)
      expect(renderSpy).toHaveBeenCalledTimes(1)

      // Same props should not cause re-render (memo should prevent this)
      rerender(<TestModal {...defaultProps} />)
      expect(renderSpy).toHaveBeenCalledTimes(1)

      // Different props should cause re-render
      rerender(<TestModal {...defaultProps} title="New Title" />)
      expect(renderSpy).toHaveBeenCalledTimes(2)
    })

    test('cleans up event listeners when unmounted', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener')
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener')

      const { unmount } = render(<Modal {...defaultProps} />)
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
      
      unmount()
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
      
      addEventListenerSpy.mockRestore()
      removeEventListenerSpy.mockRestore()
    })
  })
}) 