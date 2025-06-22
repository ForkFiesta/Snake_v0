import { NextResponse } from 'next/server'
import { DailyChallenge, ApiResponse } from '@/types/api'
import { GameMode, Difficulty } from '@/types/game'

// In-memory storage for development (replace with database in production)
let dailyChallenges: DailyChallenge[] = []

export async function GET(): Promise<NextResponse<ApiResponse<DailyChallenge[]>>> {
  try {
    // Get today's date for filtering current challenges
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Filter for current/active challenges
    const activeChallenges = dailyChallenges.filter(challenge => {
      const challengeDate = new Date(challenge.date)
      challengeDate.setHours(0, 0, 0, 0)
      return challengeDate.getTime() >= today.getTime()
    })
    
    return NextResponse.json({
      success: true,
      data: activeChallenges,
      total: activeChallenges.length
    })
  } catch (error) {
    console.error('Error fetching daily challenges:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch daily challenges',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request): Promise<NextResponse<ApiResponse<DailyChallenge>>> {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'objective', 'reward']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: `Missing fields: ${missingFields.join(', ')}`
        },
        { status: 400 }
      )
    }
    
    // Validate objective
    if (!body.objective.type || !body.objective.target || !body.objective.gameMode || !body.objective.difficulty) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid objective',
          message: 'Objective must have type, target, gameMode, and difficulty'
        },
        { status: 400 }
      )
    }
    
    // Validate objective type
    const validObjectiveTypes = ['score', 'time', 'food', 'survival']
    if (!validObjectiveTypes.includes(body.objective.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid objective type',
          message: `Objective type must be one of: ${validObjectiveTypes.join(', ')}`
        },
        { status: 400 }
      )
    }
    
    // Validate game mode
    const validGameModes: GameMode[] = ['classic', 'timed', 'survival', 'zen']
    if (!validGameModes.includes(body.objective.gameMode)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid game mode',
          message: `Game mode must be one of: ${validGameModes.join(', ')}`
        },
        { status: 400 }
      )
    }
    
    // Validate difficulty
    const validDifficulties: Difficulty[] = ['easy', 'medium', 'hard']
    if (!validDifficulties.includes(body.objective.difficulty)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid difficulty',
          message: `Difficulty must be one of: ${validDifficulties.join(', ')}`
        },
        { status: 400 }
      )
    }
    
    // Validate reward
    if (!body.reward.type || body.reward.value === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid reward',
          message: 'Reward must have type and value'
        },
        { status: 400 }
      )
    }
    
    // Validate reward type
    const validRewardTypes = ['points', 'achievement', 'theme']
    if (!validRewardTypes.includes(body.reward.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid reward type',
          message: `Reward type must be one of: ${validRewardTypes.join(', ')}`
        },
        { status: 400 }
      )
    }
    
    // Create challenge
    const challenge: DailyChallenge = {
      id: body.id || `daily-${new Date().toISOString().split('T')[0]}-${Math.random().toString(36).substr(2, 9)}`,
      date: body.date ? new Date(body.date) : new Date(),
      title: body.title,
      description: body.description,
      objective: {
        type: body.objective.type,
        target: body.objective.target,
        gameMode: body.objective.gameMode,
        difficulty: body.objective.difficulty
      },
      reward: {
        type: body.reward.type,
        value: body.reward.value
      },
      participants: body.participants || 0,
      completions: body.completions || 0
    }
    
    // Check if challenge for this date already exists
    const existingChallenge = dailyChallenges.find(c => 
      c.date.toDateString() === challenge.date.toDateString()
    )
    
    if (existingChallenge) {
      return NextResponse.json(
        {
          success: false,
          error: 'Challenge already exists',
          message: 'A challenge for this date already exists'
        },
        { status: 409 }
      )
    }
    
    // Store challenge
    dailyChallenges.push(challenge)
    
    // Sort challenges by date
    dailyChallenges.sort((a, b) => a.date.getTime() - b.date.getTime())
    
    return NextResponse.json({
      success: true,
      data: challenge,
      message: 'Daily challenge created successfully'
    })
    
  } catch (error) {
    console.error('Error creating daily challenge:', error)
    
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