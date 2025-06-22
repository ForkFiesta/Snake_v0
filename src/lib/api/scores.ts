import { ScoreSubmission, ApiResponse, LeaderboardEntry, LeaderboardQuery, DailyChallenge } from '@/types/api'
import { Achievement } from '@/types/user'

const API_BASE = '/api'

export async function submitScore(scoreData: ScoreSubmission): Promise<ApiResponse<ScoreSubmission>> {
  try {
    const response = await fetch(`${API_BASE}/scores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scoreData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        error: errorData.error || 'Failed to submit score',
        message: errorData.message
      }
    }

    return await response.json()
  } catch (error) {
    console.error('Error submitting score:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function getScores(): Promise<ApiResponse<any[]>> {
  try {
    const response = await fetch(`${API_BASE}/scores`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching scores:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function getLeaderboard(query?: LeaderboardQuery): Promise<ApiResponse<LeaderboardEntry[]>> {
  try {
    const params = new URLSearchParams()
    if (query?.gameMode) params.append('gameMode', query.gameMode)
    if (query?.difficulty) params.append('difficulty', query.difficulty)
    if (query?.limit) params.append('limit', query.limit.toString())
    if (query?.offset) params.append('offset', query.offset.toString())

    const response = await fetch(`${API_BASE}/leaderboard?${params.toString()}`)

    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        error: errorData.error || 'Failed to fetch leaderboard',
        message: errorData.message
      }
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function getAchievements(): Promise<ApiResponse<Achievement[]>> {
  try {
    const response = await fetch(`${API_BASE}/achievements`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function unlockAchievement(userId: string, achievementId: string): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_BASE}/achievements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, achievementId }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        error: errorData.error || 'Failed to unlock achievement',
        message: errorData.message
      }
    }

    return await response.json()
  } catch (error) {
    console.error('Error unlocking achievement:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function getDailyChallenges(): Promise<ApiResponse<DailyChallenge[]>> {
  try {
    const response = await fetch(`${API_BASE}/daily-challenges`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching daily challenges:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function createDailyChallenge(challengeData: Partial<DailyChallenge>): Promise<ApiResponse<DailyChallenge>> {
  try {
    const response = await fetch(`${API_BASE}/daily-challenges`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(challengeData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        error: errorData.error || 'Failed to create daily challenge',
        message: errorData.message
      }
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating daily challenge:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

 