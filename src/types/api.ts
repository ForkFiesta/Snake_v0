import { GameSession, GameMode, Difficulty } from './game'
import { User, Achievement } from './user'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface LeaderboardEntry {
  id: string
  userId: string
  username: string
  score: number
  gameMode: GameMode
  difficulty: Difficulty
  achievedAt: Date
  rank: number
}

export interface LeaderboardEntrySubmission {
  userId: string
  username: string
  score: number
  gameMode: GameMode
  difficulty: Difficulty
}

export interface ScoreSubmission {
  score: number
  gameMode: GameMode
  difficulty: Difficulty
  duration: number
  moves: number
  foodConsumed: number
}

export interface LeaderboardQuery {
  gameMode?: GameMode
  difficulty?: Difficulty
  limit?: number
  offset?: number
}

export interface DailyChallenge {
  id: string
  date: Date
  title: string
  description: string
  objective: ChallengeObjective
  reward: ChallengeReward
  participants: number
  completions: number
}

export interface ChallengeObjective {
  type: 'score' | 'time' | 'food' | 'survival'
  target: number
  gameMode: GameMode
  difficulty: Difficulty
}

export interface ChallengeReward {
  type: 'points' | 'achievement' | 'theme'
  value: string | number
} 