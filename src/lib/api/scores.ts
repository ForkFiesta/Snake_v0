import { ScoreSubmission, ApiResponse, LeaderboardEntry } from '@/types/api'

const API_BASE = '/api'

export async function submitScore(scoreData: ScoreSubmission): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE}/scores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scoreData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
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

export async function getLeaderboard(
  gameMode?: string,
  difficulty?: string,
  limit = 10
): Promise<LeaderboardEntry[]> {
  try {
    const params = new URLSearchParams()
    if (gameMode) params.append('gameMode', gameMode)
    if (difficulty) params.append('difficulty', difficulty)
    params.append('limit', limit.toString())

    const response = await fetch(`${API_BASE}/leaderboard?${params}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.leaderboard || []
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return []
  }
} 