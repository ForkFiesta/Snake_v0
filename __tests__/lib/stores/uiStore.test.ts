import { useUIStore } from '@/lib/stores/uiStore'
import { Theme } from '@/types/game'
import { act, renderHook } from '@testing-library/react'

describe('uiStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useUIStore.setState({
      theme: 'classic',
      soundEnabled: true,
      musicEnabled: true,
      showTutorial: true,
      activeModal: null
    })
  })

  describe('Initial State', () => {
    test('should have correct initial state', () => {
      const { result } = renderHook(() => useUIStore())
      
      expect(result.current.theme).toBe('classic')
      expect(result.current.soundEnabled).toBe(true)
      expect(result.current.musicEnabled).toBe(true)
      expect(result.current.showTutorial).toBe(true)
      expect(result.current.activeModal).toBeNull()
    })

    test('should provide all required action functions', () => {
      const { result } = renderHook(() => useUIStore())
      
      expect(typeof result.current.setTheme).toBe('function')
      expect(typeof result.current.toggleSound).toBe('function')
      expect(typeof result.current.toggleMusic).toBe('function')
      expect(typeof result.current.showModal).toBe('function')
      expect(typeof result.current.hideModal).toBe('function')
      expect(typeof result.current.setShowTutorial).toBe('function')
    })
  })

  describe('Theme Management', () => {
    test('setTheme should update theme to classic', () => {
      const { result } = renderHook(() => useUIStore())
      
      act(() => {
        result.current.setTheme('classic')
      })
      
      expect(result.current.theme).toBe('classic')
    })

    test('setTheme should update theme to dark', () => {
      const { result } = renderHook(() => useUIStore())
      
      act(() => {
        result.current.setTheme('dark')
      })
      
      expect(result.current.theme).toBe('dark')
    })

    test('setTheme should update theme to neon', () => {
      const { result } = renderHook(() => useUIStore())
      
      act(() => {
        result.current.setTheme('neon')
      })
      
      expect(result.current.theme).toBe('neon')
    })

    test('setTheme should update theme to retro', () => {
      const { result } = renderHook(() => useUIStore())
      
      act(() => {
        result.current.setTheme('retro')
      })
      
      expect(result.current.theme).toBe('retro')
    })

    test('setTheme should replace existing theme', () => {
      const { result } = renderHook(() => useUIStore())
      
      act(() => {
        result.current.setTheme('dark')
      })
      
      expect(result.current.theme).toBe('dark')
      
      act(() => {
        result.current.setTheme('neon')
      })
      
      expect(result.current.theme).toBe('neon')
    })
  })

  describe('Sound Management', () => {
    test('toggleSound should toggle sound from enabled to disabled', () => {
      const { result } = renderHook(() => useUIStore())
      
      expect(result.current.soundEnabled).toBe(true)
      
      act(() => {
        result.current.toggleSound()
      })
      
      expect(result.current.soundEnabled).toBe(false)
    })

    test('toggleSound should toggle sound from disabled to enabled', () => {
      const { result } = renderHook(() => useUIStore())
      
      act(() => {
        result.current.toggleSound() // Disable
        result.current.toggleSound() // Enable again
      })
      
      expect(result.current.soundEnabled).toBe(true)
    })

    test('toggleSound should work multiple times', () => {
      const { result } = renderHook(() => useUIStore())
      
      const initialState = result.current.soundEnabled
      
      act(() => {
        result.current.toggleSound()
      })
      
      expect(result.current.soundEnabled).toBe(!initialState)
      
      act(() => {
        result.current.toggleSound()
      })
      
      expect(result.current.soundEnabled).toBe(initialState)
      
      act(() => {
        result.current.toggleSound()
      })
      
      expect(result.current.soundEnabled).toBe(!initialState)
    })
  })

  describe('Music Management', () => {
    test('toggleMusic should toggle music from enabled to disabled', () => {
      const { result } = renderHook(() => useUIStore())
      
      expect(result.current.musicEnabled).toBe(true)
      
      act(() => {
        result.current.toggleMusic()
      })
      
      expect(result.current.musicEnabled).toBe(false)
    })

    test('toggleMusic should toggle music from disabled to enabled', () => {
      const { result } = renderHook(() => useUIStore())
      
      act(() => {
        result.current.toggleMusic() // Disable
        result.current.toggleMusic() // Enable again
      })
      
      expect(result.current.musicEnabled).toBe(true)
    })

    test('toggleMusic should work multiple times', () => {
      const { result } = renderHook(() => useUIStore())
      
      const initialState = result.current.musicEnabled
      
      act(() => {
        result.current.toggleMusic()
      })
      
      expect(result.current.musicEnabled).toBe(!initialState)
      
      act(() => {
        result.current.toggleMusic()
      })
      
      expect(result.current.musicEnabled).toBe(initialState)
      
      act(() => {
        result.current.toggleMusic()
      })
      
      expect(result.current.musicEnabled).toBe(!initialState)
    })

    test('sound and music toggles should work independently', () => {
      const { result } = renderHook(() => useUIStore())
      
      act(() => {
        result.current.toggleSound()
      })
      
      expect(result.current.soundEnabled).toBe(false)
      expect(result.current.musicEnabled).toBe(true)
      
      act(() => {
        result.current.toggleMusic()
      })
      
      expect(result.current.soundEnabled).toBe(false)
      expect(result.current.musicEnabled).toBe(false)
      
      act(() => {
        result.current.toggleSound()
      })
      
      expect(result.current.soundEnabled).toBe(true)
      expect(result.current.musicEnabled).toBe(false)
    })
  })

  describe('Modal Management', () => {
    test('showModal should set active modal', () => {
      const { result } = renderHook(() => useUIStore())
      
      act(() => {
        result.current.showModal('settings')
      })
      
      expect(result.current.activeModal).toBe('settings')
    })

    test('showModal should replace existing modal', () => {
      const { result } = renderHook(() => useUIStore())
      
      act(() => {
        result.current.showModal('settings')
      })
      
      expect(result.current.activeModal).toBe('settings')
      
      act(() => {
        result.current.showModal('leaderboard')
      })
      
      expect(result.current.activeModal).toBe('leaderboard')
    })

    test('hideModal should clear active modal', () => {
      const { result } = renderHook(() => useUIStore())
      
      act(() => {
        result.current.showModal('settings')
      })
      
      expect(result.current.activeModal).toBe('settings')
      
      act(() => {
        result.current.hideModal()
      })
      
      expect(result.current.activeModal).toBeNull()
    })

    test('hideModal should work when no modal is active', () => {
      const { result } = renderHook(() => useUIStore())
      
      expect(result.current.activeModal).toBeNull()
      
      act(() => {
        result.current.hideModal()
      })
      
      expect(result.current.activeModal).toBeNull()
    })

    test('showModal should handle different modal types', () => {
      const { result } = renderHook(() => useUIStore())
      
      const modalTypes = ['settings', 'leaderboard', 'achievements', 'tutorial', 'gameOver', 'pause']
      
      modalTypes.forEach(modalType => {
        act(() => {
          result.current.showModal(modalType)
        })
        
        expect(result.current.activeModal).toBe(modalType)
      })
    })

    test('showModal should handle empty string', () => {
      const { result } = renderHook(() => useUIStore())
      
      act(() => {
        result.current.showModal('')
      })
      
      expect(result.current.activeModal).toBe('')
    })
  })

  describe('Tutorial Management', () => {
    test('setShowTutorial should set tutorial visibility to true', () => {
      const { result } = renderHook(() => useUIStore())
      
      act(() => {
        result.current.setShowTutorial(false)
      })
      
      expect(result.current.showTutorial).toBe(false)
      
      act(() => {
        result.current.setShowTutorial(true)
      })
      
      expect(result.current.showTutorial).toBe(true)
    })

    test('setShowTutorial should set tutorial visibility to false', () => {
      const { result } = renderHook(() => useUIStore())
      
      expect(result.current.showTutorial).toBe(true)
      
      act(() => {
        result.current.setShowTutorial(false)
      })
      
      expect(result.current.showTutorial).toBe(false)
    })

    test('setShowTutorial should replace existing value', () => {
      const { result } = renderHook(() => useUIStore())
      
      act(() => {
        result.current.setShowTutorial(false)
      })
      
      expect(result.current.showTutorial).toBe(false)
      
      act(() => {
        result.current.setShowTutorial(true)
      })
      
      expect(result.current.showTutorial).toBe(true)
      
      act(() => {
        result.current.setShowTutorial(false)
      })
      
      expect(result.current.showTutorial).toBe(false)
    })
  })

  describe('State Persistence', () => {
    test('should maintain state across multiple actions', () => {
      const { result } = renderHook(() => useUIStore())
      
      act(() => {
        result.current.setTheme('dark')
        result.current.toggleSound()
        result.current.showModal('settings')
        result.current.setShowTutorial(false)
      })
      
      expect(result.current.theme).toBe('dark')
      expect(result.current.soundEnabled).toBe(false)
      expect(result.current.musicEnabled).toBe(true) // Should remain unchanged
      expect(result.current.activeModal).toBe('settings')
      expect(result.current.showTutorial).toBe(false)
    })

    test('should not affect other state when updating one property', () => {
      const { result } = renderHook(() => useUIStore())
      
      // Set initial complex state
      act(() => {
        result.current.setTheme('neon')
        result.current.toggleSound()
        result.current.toggleMusic()
        result.current.showModal('leaderboard')
        result.current.setShowTutorial(false)
      })
      
      const initialState = {
        theme: result.current.theme,
        soundEnabled: result.current.soundEnabled,
        musicEnabled: result.current.musicEnabled,
        activeModal: result.current.activeModal,
        showTutorial: result.current.showTutorial
      }
      
      // Change only theme
      act(() => {
        result.current.setTheme('retro')
      })
      
      expect(result.current.theme).toBe('retro')
      expect(result.current.soundEnabled).toBe(initialState.soundEnabled)
      expect(result.current.musicEnabled).toBe(initialState.musicEnabled)
      expect(result.current.activeModal).toBe(initialState.activeModal)
      expect(result.current.showTutorial).toBe(initialState.showTutorial)
    })
  })

  describe('Edge Cases', () => {
    test('should handle rapid successive calls', () => {
      const { result } = renderHook(() => useUIStore())
      
      act(() => {
        result.current.toggleSound()
        result.current.toggleSound()
        result.current.toggleSound()
        result.current.toggleMusic()
        result.current.toggleMusic()
        result.current.setTheme('dark')
        result.current.setTheme('neon')
        result.current.setTheme('retro')
      })
      
      expect(result.current.soundEnabled).toBe(false) // Toggled 3 times from true
      expect(result.current.musicEnabled).toBe(true) // Toggled 2 times from true
      expect(result.current.theme).toBe('retro') // Last theme set
    })

    test('should handle modal show/hide cycles', () => {
      const { result } = renderHook(() => useUIStore())
      
      act(() => {
        result.current.showModal('settings')
        result.current.hideModal()
        result.current.showModal('leaderboard')
        result.current.showModal('achievements')
        result.current.hideModal()
      })
      
      expect(result.current.activeModal).toBeNull()
    })

    test('should handle tutorial toggle cycles', () => {
      const { result } = renderHook(() => useUIStore())
      
      act(() => {
        result.current.setShowTutorial(false)
        result.current.setShowTutorial(true)
        result.current.setShowTutorial(false)
        result.current.setShowTutorial(true)
        result.current.setShowTutorial(false)
      })
      
      expect(result.current.showTutorial).toBe(false)
    })
  })

  describe('Type Safety', () => {
    test('should only accept valid theme values', () => {
      const { result } = renderHook(() => useUIStore())
      
      const validThemes: Theme[] = ['classic', 'dark', 'neon', 'retro']
      
      validThemes.forEach(theme => {
        act(() => {
          result.current.setTheme(theme)
        })
        
        expect(result.current.theme).toBe(theme)
      })
    })

    test('should handle boolean values correctly for tutorial', () => {
      const { result } = renderHook(() => useUIStore())
      
      const booleanValues = [true, false, true, false]
      
      booleanValues.forEach(value => {
        act(() => {
          result.current.setShowTutorial(value)
        })
        
        expect(result.current.showTutorial).toBe(value)
        expect(typeof result.current.showTutorial).toBe('boolean')
      })
    })

    test('should handle string values correctly for modal', () => {
      const { result } = renderHook(() => useUIStore())
      
      const modalValues = ['settings', 'leaderboard', 'achievements', '', 'custom-modal']
      
      modalValues.forEach(modal => {
        act(() => {
          result.current.showModal(modal)
        })
        
        expect(result.current.activeModal).toBe(modal)
        expect(typeof result.current.activeModal).toBe('string')
      })
      
      act(() => {
        result.current.hideModal()
      })
      
      expect(result.current.activeModal).toBeNull()
    })
  })
}) 