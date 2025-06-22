import { NextResponse } from 'next/server'
import { LeaderboardEntry, LeaderboardQuery, LeaderboardEntrySubmission, ApiResponse } from '@/types/api'
import { GameMode, Difficulty } from '@/types/game'

// In-memory storage for development (replace with database in production)
let leaderboardEntries: LeaderboardEntry[] = []

// Reset function for testing (not exported as it's not a valid Route export)
function resetLeaderboard(): void {
  leaderboardEntries = []
}

export async function GET(request: Request): Promise<NextResponse<ApiResponse<LeaderboardEntry[]>>> {
  try {
    const { searchParams } = new URL(request.url || 'http://localhost:3000')
    
    // Parse query parameters
    const query: LeaderboardQuery = {}
    
    // Game mode filter
    const gameMode = searchParams.get('gameMode')
    if (gameMode) {
      const validGameModes: GameMode[] = ['classic', 'timed', 'survival', 'zen']
      if (!validGameModes.includes(gameMode as GameMode)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid game mode',
            message: `Game mode must be one of: ${validGameModes.join(', ')}`
          },
          { status: 400 }
        )
      }
      query.gameMode = gameMode as GameMode
    }
    
    // Difficulty filter
    const difficulty = searchParams.get('difficulty')
    if (difficulty) {
      const validDifficulties: Difficulty[] = ['easy', 'medium', 'hard']
      if (!validDifficulties.includes(difficulty as Difficulty)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid difficulty',
            message: `Difficulty must be one of: ${validDifficulties.join(', ')}`
          },
          { status: 400 }
        )
      }
      query.difficulty = difficulty as Difficulty
    }
    
    // Pagination parameters
    const limitParam = searchParams.get('limit')
    if (limitParam) {
      const limit = parseInt(limitParam, 10)
      if (isNaN(limit) || limit < 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid limit',
            message: 'Limit must be a non-negative number'
          },
          { status: 400 }
        )
      }
      query.limit = limit
    }
    
    const offsetParam = searchParams.get('offset')
    if (offsetParam) {
      const offset = parseInt(offsetParam, 10)
      if (isNaN(offset) || offset < 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid offset',
            message: 'Offset must be a non-negative number'
          },
          { status: 400 }
        )
      }
      query.offset = offset
    }
    
    // Filter entries based on query parameters
    let filteredEntries = leaderboardEntries
    
    if (query.gameMode) {
      filteredEntries = filteredEntries.filter(entry => entry.gameMode === query.gameMode)
    }
    
    if (query.difficulty) {
      filteredEntries = filteredEntries.filter(entry => entry.difficulty === query.difficulty)
    }
    
    // Sort by rank (ascending)
    filteredEntries.sort((a, b) => a.rank - b.rank)
    
    // Apply pagination
    const total = filteredEntries.length
    const offset = query.offset || 0
    const limit = query.limit || 50 // Default limit
    
    const paginatedEntries = filteredEntries.slice(offset, offset + limit)
    
    return NextResponse.json({
      success: true,
      data: paginatedEntries,
      total,
      leaderboard: paginatedEntries // For backward compatibility
    })
    
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch leaderboard',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request): Promise<NextResponse<ApiResponse<LeaderboardEntry>>> {
  try {
    const body: LeaderboardEntrySubmission = await request.json()
    
    // Validate required fields
    const requiredFields: (keyof LeaderboardEntrySubmission)[] = ['userId', 'username', 'score', 'gameMode', 'difficulty']
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
    
    // Validate username
    if (typeof body.username !== 'string' || body.username.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid username',
          message: 'Username cannot be empty'
        },
        { status: 400 }
      )
    }
    
    if (body.username.length > 50) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid username',
          message: 'Username must be 50 characters or less'
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
    
    // Create leaderboard entry
    const newEntry: LeaderboardEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: body.userId,
      username: body.username.trim(),
      score: body.score,
      gameMode: body.gameMode,
      difficulty: body.difficulty,
      achievedAt: new Date(),
      rank: 1 // Temporary rank, will be calculated below
    }
    
    // Add to leaderboard
    leaderboardEntries.push(newEntry)
    
    // Sort by score descending to calculate ranks
    leaderboardEntries.sort((a, b) => b.score - a.score)
    
    // Recalculate ranks for all entries
    leaderboardEntries.forEach((entry, index) => {
      entry.rank = index + 1
    })
    
    // Find the newly created entry to return
    const createdEntry = leaderboardEntries.find(entry => entry.id === newEntry.id)!
    
    return NextResponse.json(
      {
        success: true,
        data: createdEntry,
        message: 'Leaderboard entry created successfully'
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Error creating leaderboard entry:', error)
    
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

// DELETE method for testing - clears all leaderboard entries
export async function DELETE(): Promise<NextResponse<ApiResponse<null>>> {
  try {
    leaderboardEntries = []
    
    return NextResponse.json({
      success: true,
      data: null,
      message: 'Leaderboard cleared successfully'
    })
  } catch (error) {
    console.error('Error clearing leaderboard:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to clear leaderboard',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 