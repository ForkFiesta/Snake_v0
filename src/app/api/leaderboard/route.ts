import { NextResponse } from 'next/server'
import { LeaderboardEntry, LeaderboardQuery, ApiResponse } from '@/types/api'
import { GameMode, Difficulty } from '@/types/game'

// In-memory storage for development (replace with database in production)
let leaderboardEntries: LeaderboardEntry[] = []

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