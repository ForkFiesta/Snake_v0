import { create } from 'zustand'
import { User, UserStatistics, UserPreferences, Achievement } from '@/types/user'

interface UserState {
  user: User | null
  statistics: UserStatistics | null
  achievements: Achievement[]
  preferences: UserPreferences | null
  
  // Actions
  setUser: (user: User) => void
  updateStatistics: (stats: Partial<UserStatistics>) => void
  unlockAchievement: (achievement: Achievement) => void
  savePreferences: (prefs: UserPreferences) => void
  clearUser: () => void
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

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  statistics: defaultStatistics,
  achievements: [],
  preferences: null,
  
  setUser: (user: User) => set({ user }),
  
  updateStatistics: (stats: Partial<UserStatistics>) => set((state) => ({
    statistics: state.statistics ? { ...state.statistics, ...stats } : { ...defaultStatistics, ...stats }
  })),
  
  unlockAchievement: (achievement: Achievement) => set((state) => ({
    achievements: [...state.achievements, achievement]
  })),
  
  savePreferences: (prefs: UserPreferences) => set({ preferences: prefs }),
  
  clearUser: () => set({
    user: null,
    statistics: defaultStatistics,
    achievements: [],
    preferences: null
  })
})) 