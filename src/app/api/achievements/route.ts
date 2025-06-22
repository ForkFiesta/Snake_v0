import { NextResponse } from 'next/server'
import { Achievement } from '@/types/user'
import { ApiResponse } from '@/types/api'

// In-memory storage for development (replace with database in production)
let achievements: Achievement[] = [
  {
    id: 'first-score',
    name: 'First Score',
    description: 'Score your first point',
    icon: '🎯',
    category: 'score',
    condition: {
      type: 'score',
      target: 1
    },
    reward: {
      type: 'points',
      value: 10
    }
  },
  {
    id: 'high-scorer',
    name: 'High Scorer',
    description: 'Score 100 points in a single game',
    icon: '🏆',
    category: 'score',
    condition: {
      type: 'score',
      target: 100
    },
    reward: {
      type: 'points',
      value: 50
    }
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete a game in under 60 seconds',
    icon: '⚡',
    category: 'gameplay',
    condition: {
      type: 'time_played',
      target: 60
    },
    reward: {
      type: 'theme',
      value: 'speed-theme'
    }
  }
]

let userAchievements: Array<{
  userId: string
  achievementId: string
  unlockedAt: Date
}> = []

export async function GET(): Promise<NextResponse<ApiResponse<Achievement[]>>> {
  try {
    return NextResponse.json({
      success: true,
      data: achievements,
      achievements: achievements // For backward compatibility
    })
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch achievements',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.userId || !body.achievementId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'userId and achievementId are required'
        },
        { status: 400 }
      )
    }
    
    // Check if achievement exists
    const achievement = achievements.find(a => a.id === body.achievementId)
    if (!achievement) {
      return NextResponse.json(
        {
          success: false,
          error: 'Achievement not found',
          message: `Achievement with id ${body.achievementId} does not exist`
        },
        { status: 404 }
      )
    }
    
    // Check if user already has this achievement
    const existingUserAchievement = userAchievements.find(
      ua => ua.userId === body.userId && ua.achievementId === body.achievementId
    )
    
    if (existingUserAchievement) {
      return NextResponse.json(
        {
          success: false,
          error: 'Achievement already unlocked',
          message: 'User already has this achievement'
        },
        { status: 409 }
      )
    }
    
    // Unlock achievement for user
    const userAchievement = {
      userId: body.userId,
      achievementId: body.achievementId,
      unlockedAt: new Date()
    }
    
    userAchievements.push(userAchievement)
    
    return NextResponse.json({
      success: true,
      data: {
        userId: body.userId,
        achievementId: body.achievementId,
        achievement: achievement,
        unlockedAt: userAchievement.unlockedAt
      },
      message: 'Achievement unlocked successfully'
    })
    
  } catch (error) {
    console.error('Error unlocking achievement:', error)
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON',
          message: 'Request body must be valid JSON'
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 