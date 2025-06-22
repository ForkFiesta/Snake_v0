import { NextResponse } from 'next/server'
import { ScoreSubmission, ApiResponse } from '@/types/api'
import { GameMode, Difficulty } from '@/types/game'

// In-memory storage for development (replace with database in production)
let scores: Array<{
  id: string
  userId?: string
  score: number
  gameMode: GameMode
  difficulty: Difficulty
  duration: number
  moves: number
  foodConsumed: number
  createdAt: Date
}> = []

// Reset function for testing (not exported as it's not a valid Route export)
function resetScores() {
  scores = []
}

export async function GET(): Promise<NextResponse<ApiResponse<typeof scores>>> {
  try {
    return NextResponse.json({
      success: true,
      data: scores,
      scores: scores // For backward compatibility
    })
  } catch (error) {
    console.error('Error fetching scores:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch scores',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request): Promise<NextResponse<ApiResponse<ScoreSubmission>>> {
  try {
    const body: ScoreSubmission = await request.json()
    
    // Validate required fields
    const requiredFields: (keyof ScoreSubmission)[] = ['score', 'gameMode', 'difficulty', 'duration', 'moves', 'foodConsumed']
    const missingFields = requiredFields.filter(field => body[field] === undefined || body[field] === null)
    
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
    
    // Validate score
    if (typeof body.score !== 'number' || body.score < 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid score',
          message: 'Score must be a non-negative number'
        },
        { status: 400 }
      )
    }
    
    // Validate game mode
    const validGameModes: GameMode[] = ['classic', 'timed', 'survival', 'zen']
    if (!validGameModes.includes(body.gameMode)) {
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
    if (!validDifficulties.includes(body.difficulty)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid difficulty',
          message: `Difficulty must be one of: ${validDifficulties.join(', ')}`
        },
        { status: 400 }
      )
    }
    
    // Validate numeric fields
    const numericFields = ['duration', 'moves', 'foodConsumed'] as const
    for (const field of numericFields) {
      if (typeof body[field] !== 'number' || body[field] < 0) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid ${field}`,
            message: `${field} must be a non-negative number`
          },
          { status: 400 }
        )
      }
    }
    
    // Create score entry
    const scoreEntry = {
      id: `score-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: undefined, // TODO: Extract from authentication
      ...body,
      createdAt: new Date()
    }
    
    // Store score
    scores.push(scoreEntry)
    
    // Sort scores by score descending to maintain leaderboard order
    scores.sort((a, b) => b.score - a.score)
    
    return NextResponse.json({
      success: true,
      data: body,
      message: 'Score saved successfully'
    })
    
  } catch (error) {
    console.error('Error saving score:', error)
    
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