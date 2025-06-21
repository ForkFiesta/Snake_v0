// Test fixtures for consistent test data across the application

export const mockGameState = {
  gameStatus: 'idle' as const,
  score: 0,
  highScore: 100,
  level: 1,
  snake: [{ x: 10, y: 10 }],
  food: { x: 15, y: 15 },
  direction: 'right' as const,
  nextDirection: 'right' as const,
  difficulty: 'medium' as const,
  gameMode: 'classic' as const,
  boardSize: { width: 20, height: 20 },
}

export const mockUserData = {
  id: 'test-user-123',
  username: 'testuser',
  email: 'test@example.com',
  createdAt: new Date('2024-01-01'),
  lastActive: new Date('2024-01-15'),
  preferences: {
    theme: 'classic' as const,
    soundEnabled: false,
    musicEnabled: false,
    difficulty: 'medium' as const,
    defaultGameMode: 'classic' as const,
    controlScheme: 'arrows' as const,
    boardSize: { width: 20, height: 20 },
  }
}

export const mockUserStatistics = {
  totalGames: 50,
  totalScore: 5000,
  highScore: 250,
  averageScore: 100,
  totalPlayTime: 3600, // in seconds
  gamesWon: 25,
  currentStreak: 3,
  longestStreak: 8,
  favoriteGameMode: 'classic' as const,
  achievementsUnlocked: 5,
}

export const mockLeaderboardEntries = [
  {
    id: '1',
    userId: 'user-1',
    username: 'player1',
    score: 250,
    gameMode: 'classic' as const,
    difficulty: 'hard' as const,
    achievedAt: new Date('2024-01-15'),
    rank: 1,
  },
  {
    id: '2',
    userId: 'user-2',
    username: 'player2',
    score: 200,
    gameMode: 'classic' as const,
    difficulty: 'hard' as const,
    achievedAt: new Date('2024-01-14'),
    rank: 2,
  },
  {
    id: '3',
    userId: 'user-3',
    username: 'player3',
    score: 180,
    gameMode: 'classic' as const,
    difficulty: 'medium' as const,
    achievedAt: new Date('2024-01-13'),
    rank: 3,
  },
]

export const mockAchievements = [
  {
    id: 'first-score',
    name: 'First Score',
    description: 'Score your first point',
    icon: '🎯',
    category: 'score' as const,
    condition: { type: 'score', value: 1 },
    reward: { type: 'badge', value: 'first-score' },
    unlockedAt: new Date('2024-01-01'),
  },
  {
    id: 'high-scorer',
    name: 'High Scorer',
    description: 'Score 100 points in a single game',
    icon: '🏆',
    category: 'score' as const,
    condition: { type: 'score', value: 100 },
    reward: { type: 'badge', value: 'high-scorer' },
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete a game in under 60 seconds',
    icon: '⚡',
    category: 'gameplay' as const,
    condition: { type: 'time', value: 60 },
    reward: { type: 'badge', value: 'speed-demon' },
  },
]

export const mockGameSession = {
  id: 'session-123',
  userId: 'test-user-123',
  score: 150,
  duration: 300, // 5 minutes in seconds
  gameMode: 'classic' as const,
  difficulty: 'medium' as const,
  startedAt: new Date('2024-01-15T10:00:00Z'),
  endedAt: new Date('2024-01-15T10:05:00Z'),
  moves: 75,
  foodConsumed: 15,
  sessionData: {
    maxSnakeLength: 16,
    collisionType: 'wall',
    powerUpsUsed: 0,
  }
}

export const mockApiResponses = {
  scores: {
    success: { 
      success: true, 
      sessionId: 'mock-session-id-123',
      score: 150,
      isNewHighScore: false 
    },
    error: { 
      error: 'Invalid score',
      code: 'INVALID_SCORE' 
    },
    highScore: {
      success: true,
      sessionId: 'mock-session-id-456',
      score: 250,
      isNewHighScore: true
    }
  },
  leaderboard: {
    data: mockLeaderboardEntries,
    total: mockLeaderboardEntries.length,
    userRank: 5,
    userBestScore: 180
  },
  achievements: {
    unlocked: mockAchievements.filter(a => a.unlockedAt),
    available: mockAchievements,
    progress: {
      'high-scorer': { current: 85, target: 100 },
      'speed-demon': { current: 75, target: 60 }
    }
  }
}

// Helper functions for creating test data
export const createMockGameState = (overrides: Partial<typeof mockGameState> = {}) => ({
  ...mockGameState,
  ...overrides
})

export const createMockUser = (overrides: Partial<typeof mockUserData> = {}) => ({
  ...mockUserData,
  ...overrides
})

export const createMockLeaderboardEntry = (overrides: Partial<typeof mockLeaderboardEntries[0]> = {}) => ({
  ...mockLeaderboardEntries[0],
  ...overrides
})

export const createMockGameSession = (overrides: Partial<typeof mockGameSession> = {}) => ({
  ...mockGameSession,
  ...overrides
}) 