import { useUserStore } from '@/lib/stores/userStore'
import { User, UserStatistics, UserPreferences, Achievement } from '@/types/user'
import { act, renderHook } from '@testing-library/react'

describe('userStore', () => {
  // Test data fixtures
  const mockUser: User = {
    id: 'user-123',
    username: 'testuser',
    email: 'test@example.com',
    createdAt: new Date('2024-01-01'),
    lastActive: new Date('2024-01-15'),
    preferences: {
      theme: 'classic',
      soundEnabled: true,
      musicEnabled: false,
      difficulty: 'medium',
      defaultGameMode: 'classic',
      controlScheme: 'arrows',
      boardSize: { width: 20, height: 20 }
    }
  }

  const mockStatistics: UserStatistics = {
    totalGames: 50,
    totalScore: 12500,
    highScore: 1500,
    averageScore: 250,
    totalPlayTime: 3600,
    gamesWon: 25,
    currentStreak: 5,
    longestStreak: 12,
    favoriteGameMode: 'classic',
    achievementsUnlocked: 8
  }

  const mockPreferences: UserPreferences = {
    theme: 'dark',
    soundEnabled: false,
    musicEnabled: true,
    difficulty: 'hard',
    defaultGameMode: 'timed',
    controlScheme: 'wasd',
    boardSize: { width: 25, height: 25 }
  }

  const mockAchievement: Achievement = {
    id: 'achievement-1',
    name: 'First Score',
    description: 'Score your first 100 points',
    icon: '🎯',
    category: 'score',
    condition: {
      type: 'score',
      target: 100
    },
    reward: {
      type: 'points',
      value: 50
    },
    unlockedAt: new Date('2024-01-10')
  }

  const defaultStatistics: UserStatistics = {
    totalGames: 0,
    totalScore: 0,
    highScore: 0,
    averageScore: 0,
    totalPlayTime: 0,
    gamesWon: 0,
    currentStreak: 0,
    longestStreak: 0,
    favoriteGameMode: 'classic',
    achievementsUnlocked: 0
  }

  beforeEach(() => {
    // Reset store state before each test
    useUserStore.setState({
      user: null,
      statistics: defaultStatistics,
      achievements: [],
      preferences: null
    })
  })

  describe('Initial State', () => {
    test('should have correct initial state', () => {
      const { result } = renderHook(() => useUserStore())
      
      expect(result.current.user).toBeNull()
      expect(result.current.statistics).toEqual(defaultStatistics)
      expect(result.current.achievements).toEqual([])
      expect(result.current.preferences).toBeNull()
    })

    test('should provide all required action functions', () => {
      const { result } = renderHook(() => useUserStore())
      
      expect(typeof result.current.setUser).toBe('function')
      expect(typeof result.current.updateStatistics).toBe('function')
      expect(typeof result.current.unlockAchievement).toBe('function')
      expect(typeof result.current.savePreferences).toBe('function')
      expect(typeof result.current.clearUser).toBe('function')
    })
  })

  describe('User Management', () => {
    test('setUser should set the current user', () => {
      const { result } = renderHook(() => useUserStore())
      
      act(() => {
        result.current.setUser(mockUser)
      })
      
      expect(result.current.user).toEqual(mockUser)
    })

    test('setUser should replace existing user', () => {
      const { result } = renderHook(() => useUserStore())
      
      const firstUser = { ...mockUser, id: 'user-1', username: 'firstuser' }
      const secondUser = { ...mockUser, id: 'user-2', username: 'seconduser' }
      
      act(() => {
        result.current.setUser(firstUser)
      })
      
      expect(result.current.user).toEqual(firstUser)
      
      act(() => {
        result.current.setUser(secondUser)
      })
      
      expect(result.current.user).toEqual(secondUser)
    })

    test('clearUser should reset all user data', () => {
      const { result } = renderHook(() => useUserStore())
      
      act(() => {
        result.current.setUser(mockUser)
        result.current.updateStatistics(mockStatistics)
        result.current.unlockAchievement(mockAchievement)
        result.current.savePreferences(mockPreferences)
      })
      
      // Verify data is set
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.statistics).toEqual(mockStatistics)
      expect(result.current.achievements).toHaveLength(1)
      expect(result.current.preferences).toEqual(mockPreferences)
      
      act(() => {
        result.current.clearUser()
      })
      
      expect(result.current.user).toBeNull()
      expect(result.current.statistics).toEqual(defaultStatistics)
      expect(result.current.achievements).toEqual([])
      expect(result.current.preferences).toBeNull()
    })
  })

  describe('Statistics Management', () => {
    test('updateStatistics should update statistics when no existing statistics', () => {
      const { result } = renderHook(() => useUserStore())
      
      const partialStats = {
        totalGames: 10,
        highScore: 500
      }
      
      act(() => {
        result.current.updateStatistics(partialStats)
      })
      
      expect(result.current.statistics).toEqual({
        ...defaultStatistics,
        ...partialStats
      })
    })

    test('updateStatistics should merge with existing statistics', () => {
      const { result } = renderHook(() => useUserStore())
      
      const initialStats = {
        totalGames: 20,
        totalScore: 5000,
        highScore: 800
      }
      
      const updateStats = {
        totalGames: 25,
        gamesWon: 15
      }
      
      act(() => {
        result.current.updateStatistics(initialStats)
      })
      
      act(() => {
        result.current.updateStatistics(updateStats)
      })
      
      expect(result.current.statistics).toEqual({
        ...defaultStatistics,
        ...initialStats,
        ...updateStats
      })
    })

    test('updateStatistics should handle all statistic fields', () => {
      const { result } = renderHook(() => useUserStore())
      
      act(() => {
        result.current.updateStatistics(mockStatistics)
      })
      
      expect(result.current.statistics).toEqual(mockStatistics)
    })

    test('updateStatistics should handle partial updates', () => {
      const { result } = renderHook(() => useUserStore())
      
      act(() => {
        result.current.updateStatistics({ totalGames: 1 })
      })
      
      expect(result.current.statistics?.totalGames).toBe(1)
      expect(result.current.statistics?.totalScore).toBe(0)
      expect(result.current.statistics?.highScore).toBe(0)
    })

    test('updateStatistics should handle empty object', () => {
      const { result } = renderHook(() => useUserStore())
      
      act(() => {
        result.current.updateStatistics({})
      })
      
      expect(result.current.statistics).toEqual(defaultStatistics)
    })

    test('updateStatistics should handle zero values', () => {
      const { result } = renderHook(() => useUserStore())
      
      const zeroStats = {
        totalGames: 0,
        totalScore: 0,
        highScore: 0,
        currentStreak: 0
      }
      
      act(() => {
        result.current.updateStatistics(zeroStats)
      })
      
      expect(result.current.statistics).toEqual({
        ...defaultStatistics,
        ...zeroStats
      })
    })
  })

  describe('Achievement Management', () => {
    test('unlockAchievement should add achievement to list', () => {
      const { result } = renderHook(() => useUserStore())
      
      act(() => {
        result.current.unlockAchievement(mockAchievement)
      })
      
      expect(result.current.achievements).toHaveLength(1)
      expect(result.current.achievements[0]).toEqual(mockAchievement)
    })

    test('unlockAchievement should add multiple achievements', () => {
      const { result } = renderHook(() => useUserStore())
      
      const achievement2: Achievement = {
        ...mockAchievement,
        id: 'achievement-2',
        name: 'High Score',
        description: 'Reach 1000 points'
      }
      
      act(() => {
        result.current.unlockAchievement(mockAchievement)
        result.current.unlockAchievement(achievement2)
      })
      
      expect(result.current.achievements).toHaveLength(2)
      expect(result.current.achievements[0]).toEqual(mockAchievement)
      expect(result.current.achievements[1]).toEqual(achievement2)
    })

    test('unlockAchievement should preserve existing achievements', () => {
      const { result } = renderHook(() => useUserStore())
      
      const achievement2: Achievement = {
        ...mockAchievement,
        id: 'achievement-2',
        name: 'Speed Demon'
      }
      
      const achievement3: Achievement = {
        ...mockAchievement,
        id: 'achievement-3',
        name: 'Survivor'
      }
      
      act(() => {
        result.current.unlockAchievement(mockAchievement)
        result.current.unlockAchievement(achievement2)
        result.current.unlockAchievement(achievement3)
      })
      
      expect(result.current.achievements).toHaveLength(3)
      expect(result.current.achievements.map(a => a.id)).toEqual([
        'achievement-1',
        'achievement-2', 
        'achievement-3'
      ])
    })

    test('unlockAchievement should handle achievements with different categories', () => {
      const { result } = renderHook(() => useUserStore())
      
      const gameplayAchievement: Achievement = {
        ...mockAchievement,
        id: 'gameplay-1',
        category: 'gameplay'
      }
      
      const socialAchievement: Achievement = {
        ...mockAchievement,
        id: 'social-1',
        category: 'social'
      }
      
      act(() => {
        result.current.unlockAchievement(mockAchievement) // score category
        result.current.unlockAchievement(gameplayAchievement)
        result.current.unlockAchievement(socialAchievement)
      })
      
      expect(result.current.achievements).toHaveLength(3)
      expect(result.current.achievements.map(a => a.category)).toEqual([
        'score',
        'gameplay',
        'social'
      ])
    })

    test('unlockAchievement should handle achievements without rewards', () => {
      const { result } = renderHook(() => useUserStore())
      
      const achievementWithoutReward: Achievement = {
        id: 'no-reward',
        name: 'Simple Achievement',
        description: 'Basic achievement',
        icon: '⭐',
        category: 'gameplay',
        condition: {
          type: 'games_played',
          target: 10
        }
      }
      
      act(() => {
        result.current.unlockAchievement(achievementWithoutReward)
      })
      
      expect(result.current.achievements).toHaveLength(1)
      expect(result.current.achievements[0]).toEqual(achievementWithoutReward)
      expect(result.current.achievements[0].reward).toBeUndefined()
    })
  })

  describe('Preferences Management', () => {
    test('savePreferences should set user preferences', () => {
      const { result } = renderHook(() => useUserStore())
      
      act(() => {
        result.current.savePreferences(mockPreferences)
      })
      
      expect(result.current.preferences).toEqual(mockPreferences)
    })

    test('savePreferences should replace existing preferences', () => {
      const { result } = renderHook(() => useUserStore())
      
      const initialPrefs: UserPreferences = {
        theme: 'classic',
        soundEnabled: true,
        musicEnabled: true,
        difficulty: 'easy',
        defaultGameMode: 'classic',
        controlScheme: 'arrows',
        boardSize: { width: 15, height: 15 }
      }
      
      act(() => {
        result.current.savePreferences(initialPrefs)
      })
      
      expect(result.current.preferences).toEqual(initialPrefs)
      
      act(() => {
        result.current.savePreferences(mockPreferences)
      })
      
      expect(result.current.preferences).toEqual(mockPreferences)
    })

    test('savePreferences should handle all preference fields', () => {
      const { result } = renderHook(() => useUserStore())
      
      const allFieldsPrefs: UserPreferences = {
        theme: 'neon',
        soundEnabled: false,
        musicEnabled: false,
        difficulty: 'hard',
        defaultGameMode: 'survival',
        controlScheme: 'touch',
        boardSize: { width: 30, height: 30 }
      }
      
      act(() => {
        result.current.savePreferences(allFieldsPrefs)
      })
      
      expect(result.current.preferences).toEqual(allFieldsPrefs)
    })
  })

  describe('Edge Cases and Error Handling', () => {
    test('should handle undefined values gracefully', () => {
      const { result } = renderHook(() => useUserStore())
      
      // These should not throw errors
      act(() => {
        result.current.updateStatistics(undefined as any)
      })
      
      // Statistics should remain at default
      expect(result.current.statistics).toEqual(defaultStatistics)
    })

    test('should handle null values gracefully', () => {
      const { result } = renderHook(() => useUserStore())
      
      // These should not throw errors
      act(() => {
        result.current.setUser(null as any)
        result.current.savePreferences(null as any)
      })
      
      expect(result.current.user).toBeNull()
      expect(result.current.preferences).toBeNull()
    })

    test('should maintain referential integrity after multiple operations', () => {
      const { result } = renderHook(() => useUserStore())
      
      act(() => {
        result.current.setUser(mockUser)
        result.current.updateStatistics({ totalGames: 5 })
        result.current.unlockAchievement(mockAchievement)
        result.current.updateStatistics({ totalGames: 10 })
        result.current.savePreferences(mockPreferences)
      })
      
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.statistics?.totalGames).toBe(10)
      expect(result.current.achievements).toHaveLength(1)
      expect(result.current.preferences).toEqual(mockPreferences)
    })

    test('should handle rapid successive updates', () => {
      const { result } = renderHook(() => useUserStore())
      
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.updateStatistics({ totalGames: i })
        }
      })
      
      expect(result.current.statistics?.totalGames).toBe(9)
    })

    test('should handle achievement unlocking with duplicate IDs', () => {
      const { result } = renderHook(() => useUserStore())
      
      act(() => {
        result.current.unlockAchievement(mockAchievement)
        result.current.unlockAchievement(mockAchievement) // Same achievement
      })
      
      // Should have both (store doesn't prevent duplicates by design)
      expect(result.current.achievements).toHaveLength(2)
      expect(result.current.achievements[0].id).toBe(mockAchievement.id)
      expect(result.current.achievements[1].id).toBe(mockAchievement.id)
    })
  })

  describe('State Persistence and Isolation', () => {
    test('should maintain state across multiple hook instances', () => {
      const { result: result1 } = renderHook(() => useUserStore())
      const { result: result2 } = renderHook(() => useUserStore())
      
      act(() => {
        result1.current.setUser(mockUser)
      })
      
      expect(result2.current.user).toEqual(mockUser)
    })

    test('should update all hook instances when state changes', () => {
      const { result: result1 } = renderHook(() => useUserStore())
      const { result: result2 } = renderHook(() => useUserStore())
      
      act(() => {
        result1.current.updateStatistics({ totalGames: 15 })
      })
      
      expect(result1.current.statistics?.totalGames).toBe(15)
      expect(result2.current.statistics?.totalGames).toBe(15)
    })

    test('clearUser should reset state for all hook instances', () => {
      const { result: result1 } = renderHook(() => useUserStore())
      const { result: result2 } = renderHook(() => useUserStore())
      
      act(() => {
        result1.current.setUser(mockUser)
        result1.current.updateStatistics(mockStatistics)
      })
      
      expect(result2.current.user).toEqual(mockUser)
      expect(result2.current.statistics).toEqual(mockStatistics)
      
      act(() => {
        result2.current.clearUser()
      })
      
      expect(result1.current.user).toBeNull()
      expect(result1.current.statistics).toEqual(defaultStatistics)
    })
  })

  describe('Type Safety and Integration', () => {
    test('should maintain type safety for User interface', () => {
      const { result } = renderHook(() => useUserStore())
      
      act(() => {
        result.current.setUser(mockUser)
      })
      
      expect(result.current.user?.id).toBe('user-123')
      expect(result.current.user?.username).toBe('testuser')
      expect(result.current.user?.email).toBe('test@example.com')
      expect(result.current.user?.createdAt).toBeInstanceOf(Date)
      expect(result.current.user?.lastActive).toBeInstanceOf(Date)
      expect(result.current.user?.preferences).toBeDefined()
    })

    test('should maintain type safety for Achievement interface', () => {
      const { result } = renderHook(() => useUserStore())
      
      act(() => {
        result.current.unlockAchievement(mockAchievement)
      })
      
      const achievement = result.current.achievements[0]
      expect(achievement.id).toBe('achievement-1')
      expect(achievement.name).toBe('First Score')
      expect(achievement.category).toBe('score')
      expect(achievement.condition.type).toBe('score')
      expect(achievement.condition.target).toBe(100)
      expect(achievement.reward?.type).toBe('points')
      expect(achievement.reward?.value).toBe(50)
    })

    test('should maintain type safety for UserPreferences interface', () => {
      const { result } = renderHook(() => useUserStore())
      
      act(() => {
        result.current.savePreferences(mockPreferences)
      })
      
      expect(result.current.preferences?.theme).toBe('dark')
      expect(result.current.preferences?.soundEnabled).toBe(false)
      expect(result.current.preferences?.musicEnabled).toBe(true)
      expect(result.current.preferences?.difficulty).toBe('hard')
      expect(result.current.preferences?.defaultGameMode).toBe('timed')
      expect(result.current.preferences?.controlScheme).toBe('wasd')
      expect(result.current.preferences?.boardSize).toEqual({ width: 25, height: 25 })
    })
  })

  describe('Performance and Memory Management', () => {
    test('should handle large numbers of achievements efficiently', () => {
      const { result } = renderHook(() => useUserStore())
      
      const achievements: Achievement[] = Array.from({ length: 100 }, (_, i) => ({
        ...mockAchievement,
        id: `achievement-${i}`,
        name: `Achievement ${i}`
      }))
      
      act(() => {
        achievements.forEach(achievement => {
          result.current.unlockAchievement(achievement)
        })
      })
      
      expect(result.current.achievements).toHaveLength(100)
      expect(result.current.achievements[0].id).toBe('achievement-0')
      expect(result.current.achievements[99].id).toBe('achievement-99')
    })

    test('should handle frequent statistics updates efficiently', () => {
      const { result } = renderHook(() => useUserStore())
      
      const startTime = performance.now()
      
      act(() => {
        for (let i = 0; i < 1000; i++) {
          result.current.updateStatistics({ 
            totalGames: i,
            totalScore: i * 10 
          })
        }
      })
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      expect(duration).toBeLessThan(100) // Should complete in under 100ms
      expect(result.current.statistics?.totalGames).toBe(999)
      expect(result.current.statistics?.totalScore).toBe(9990)
    })

    test('should not cause memory leaks with repeated operations', () => {
      const { result } = renderHook(() => useUserStore())
      
      // Simulate repeated user sessions
      for (let session = 0; session < 10; session++) {
        act(() => {
          result.current.setUser({ ...mockUser, id: `user-${session}` })
          result.current.updateStatistics({ totalGames: session })
          result.current.unlockAchievement({ ...mockAchievement, id: `ach-${session}` })
          result.current.savePreferences(mockPreferences)
          result.current.clearUser()
        })
      }
      
      // After clearing, state should be reset
      expect(result.current.user).toBeNull()
      expect(result.current.statistics).toEqual(defaultStatistics)
      expect(result.current.achievements).toEqual([])
      expect(result.current.preferences).toBeNull()
    })
  })
}) 