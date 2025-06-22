import { GameMode, Difficulty, Theme, BoardSize } from './game'

export interface User {
  id: string
  username: string
  email?: string
  createdAt: Date
  lastActive: Date
  preferences: UserPreferences
}

export interface UserStatistics {
  totalGames: number
  totalScore: number
  highScore: number
  averageScore: number
  totalPlayTime: number // in seconds
  gamesWon: number
  currentStreak: number
  longestStreak: number
  favoriteGameMode: GameMode
  achievementsUnlocked: number
}

export interface UserPreferences {
  theme: Theme
  soundEnabled: boolean
  musicEnabled: boolean
  difficulty: Difficulty
  defaultGameMode: GameMode
  controlScheme: 'arrows' | 'wasd' | 'touch'
  boardSize: BoardSize
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'score' | 'gameplay' | 'social' | 'streak'
  condition: AchievementCondition
  reward?: AchievementReward
  unlockedAt?: Date
}

export interface AchievementCondition {
  type: 'score' | 'games_played' | 'streak' | 'time_played'
  target: number
  gameMode?: GameMode
  difficulty?: Difficulty
}

export interface AchievementReward {
  type: 'points' | 'theme' | 'title'
  value: string | number
} 