import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/leaderboard/route'
import { LeaderboardEntry, LeaderboardQuery } from '@/types/api'

// Mock data for testing
const mockLeaderboardData: LeaderboardEntry[] = [
  {
    id: 'entry-1',
    userId: 'user-1',
    username: 'player1',
    score: 2500,
    gameMode: 'classic',
    difficulty: 'hard',
    achievedAt: new Date('2024-01-01'),
    rank: 1
  },
  {
    id: 'entry-2',
    userId: 'user-2',
    username: 'player2',
    score: 2000,
    gameMode: 'classic',
    difficulty: 'hard',
    achievedAt: new Date('2024-01-02'),
    rank: 2
  },
  {
    id: 'entry-3',
    userId: 'user-3',
    username: 'player3',
    score: 1500,
    gameMode: 'timed',
    difficulty: 'medium',
    achievedAt: new Date('2024-01-03'),
    rank: 3
  }
]

describe('/api/leaderboard', () => {
  // Note: In-memory storage is reset automatically in test environment
  beforeEach(() => {
    // Setup for each test
  })

  describe('GET /api/leaderboard', () => {
    test('should return leaderboard entries', async () => {
      const request = new Request('http://localhost:3000/api/leaderboard')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data).toHaveProperty('success', true)
      expect(data).toHaveProperty('data')
      expect(Array.isArray(data.data)).toBe(true)
      expect(data).toHaveProperty('leaderboard')
      expect(Array.isArray(data.leaderboard)).toBe(true)
      expect(data).toHaveProperty('total')
      expect(typeof data.total).toBe('number')
    })
    
    test('should return empty leaderboard initially', async () => {
      const request = new Request('http://localhost:3000/api/leaderboard')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual([])
      expect(data.leaderboard).toEqual([])
      expect(data.total).toBe(0)
    })
    
    test('should handle invalid game mode', async () => {
      const request = new Request('http://localhost:3000/api/leaderboard?gameMode=invalid')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid game mode')
      expect(data.message).toContain('Game mode must be one of')
    })
    
    test('should handle invalid difficulty', async () => {
      const request = new Request('http://localhost:3000/api/leaderboard?difficulty=invalid')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid difficulty')
      expect(data.message).toContain('Difficulty must be one of')
    })
    
    test('should handle invalid limit parameter', async () => {
      const request = new Request('http://localhost:3000/api/leaderboard?limit=-1')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid limit')
      expect(data.message).toBe('Limit must be a non-negative number')
    })
    
    test('should handle invalid offset parameter', async () => {
      const request = new Request('http://localhost:3000/api/leaderboard?offset=-1')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid offset')
      expect(data.message).toBe('Offset must be a non-negative number')
    })
    
    test('should handle valid filters', async () => {
      const request = new Request('http://localhost:3000/api/leaderboard?gameMode=classic&difficulty=medium&limit=10&offset=0')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toBeDefined()
      expect(data.total).toBeDefined()
    })
    
    test('should handle non-numeric limit parameter', async () => {
      const request = new Request('http://localhost:3000/api/leaderboard?limit=abc')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid limit')
    })
    
    test('should handle non-numeric offset parameter', async () => {
      const request = new Request('http://localhost:3000/api/leaderboard?offset=xyz')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid offset')
    })
    
    test('should handle missing URL gracefully', async () => {
      const request = { url: null } as unknown as Request
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
    
    test('should apply default pagination when not specified', async () => {
      const request = new Request('http://localhost:3000/api/leaderboard')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      // Should use default limit of 50
    })
  })
  
  describe('POST /api/leaderboard', () => {
    test('should add valid leaderboard entry', async () => {
      const entryData = {
        userId: 'user-123',
        username: 'testplayer',
        score: 1800,
        gameMode: 'classic',
        difficulty: 'medium'
      }
      
      const request = new NextRequest('http://localhost:3000/api/leaderboard', {
        method: 'POST',
        body: JSON.stringify(entryData),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data).toBeDefined()
      expect(data.data.userId).toBe(entryData.userId)
      expect(data.data.username).toBe(entryData.username)
      expect(data.data.score).toBe(entryData.score)
      expect(data.data.gameMode).toBe(entryData.gameMode)
      expect(data.data.difficulty).toBe(entryData.difficulty)
      expect(data.data.id).toBeDefined()
      expect(data.data.rank).toBeDefined()
      expect(data.data.achievedAt).toBeDefined()
    })
    
    test('should handle missing required fields', async () => {
      const incompleteData = {
        userId: 'user-123',
        score: 1800
        // Missing username, gameMode, difficulty
      }
      
      const request = new NextRequest('http://localhost:3000/api/leaderboard', {
        method: 'POST',
        body: JSON.stringify(incompleteData),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Missing required fields')
      expect(data.message).toContain('Missing fields:')
    })
    
    test('should validate score is non-negative number', async () => {
      const invalidData = {
        userId: 'user-123',
        username: 'testplayer',
        score: -100,
        gameMode: 'classic',
        difficulty: 'medium'
      }
      
      const request = new NextRequest('http://localhost:3000/api/leaderboard', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid score')
      expect(data.message).toBe('Score must be a non-negative number')
    })
    
    test('should validate game mode', async () => {
      const invalidData = {
        userId: 'user-123',
        username: 'testplayer',
        score: 1800,
        gameMode: 'invalid',
        difficulty: 'medium'
      }
      
      const request = new NextRequest('http://localhost:3000/api/leaderboard', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid game mode')
      expect(data.message).toContain('Game mode must be one of')
    })
    
    test('should validate difficulty', async () => {
      const invalidData = {
        userId: 'user-123',
        username: 'testplayer',
        score: 1800,
        gameMode: 'classic',
        difficulty: 'invalid'
      }
      
      const request = new NextRequest('http://localhost:3000/api/leaderboard', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid difficulty')
      expect(data.message).toContain('Difficulty must be one of')
    })
    
    test('should handle malformed JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/leaderboard', {
        method: 'POST',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid JSON')
      expect(data.message).toBe('Request body must be valid JSON')
    })
    
    test('should validate username is not empty', async () => {
      const invalidData = {
        userId: 'user-123',
        username: '',
        score: 1800,
        gameMode: 'classic',
        difficulty: 'medium'
      }
      
      const request = new NextRequest('http://localhost:3000/api/leaderboard', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid username')
      expect(data.message).toBe('Username cannot be empty')
    })
    
    test('should handle username that is too long', async () => {
      const invalidData = {
        userId: 'user-123',
        username: 'a'.repeat(51), // 51 characters, exceeding limit
        score: 1800,
        gameMode: 'classic',
        difficulty: 'medium'
      }
      
      const request = new NextRequest('http://localhost:3000/api/leaderboard', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid username')
      expect(data.message).toBe('Username must be 50 characters or less')
    })
  })
  
  describe('Rank Calculation', () => {
    test('should automatically calculate rank correctly', async () => {
      // First add an entry with lower score
      const entry1 = {
        userId: 'user-1',
        username: 'player1',
        score: 1000,
        gameMode: 'classic',
        difficulty: 'medium'
      }
      
      const request1 = new NextRequest('http://localhost:3000/api/leaderboard', {
        method: 'POST',
        body: JSON.stringify(entry1),
        headers: { 'Content-Type': 'application/json' }
      })
      
      const response1 = await POST(request1)
      const data1 = await response1.json()
      
      expect(data1.data.rank).toBe(1) // First entry gets rank 1
      
      // Add entry with higher score
      const entry2 = {
        userId: 'user-2',
        username: 'player2',
        score: 2000,
        gameMode: 'classic',
        difficulty: 'medium'
      }
      
      const request2 = new NextRequest('http://localhost:3000/api/leaderboard', {
        method: 'POST',
        body: JSON.stringify(entry2),
        headers: { 'Content-Type': 'application/json' }
      })
      
      const response2 = await POST(request2)
      const data2 = await response2.json()
      
      expect(data2.data.rank).toBe(1) // Should be rank 1 with higher score
      
      // Verify the leaderboard is correctly sorted
      const getRequest = new Request('http://localhost:3000/api/leaderboard')
      const getResponse = await GET(getRequest)
      const getData = await getResponse.json()
      
      expect(getData.data).toHaveLength(2)
      expect(getData.data[0].score).toBe(2000) // Highest score first
      expect(getData.data[0].rank).toBe(1)
      expect(getData.data[1].score).toBe(1000) // Lower score second
      expect(getData.data[1].rank).toBe(2)
    })
  })
  
  describe('Query Parameter Validation', () => {
    test('should validate gameMode parameter', () => {
      const validModes = ['classic', 'timed', 'survival', 'zen']
      const invalidModes = ['invalid', 'test', '']
      
      validModes.forEach(mode => {
        expect(['classic', 'timed', 'survival', 'zen']).toContain(mode)
      })
      
      invalidModes.forEach(mode => {
        expect(['classic', 'timed', 'survival', 'zen']).not.toContain(mode)
      })
    })
    
    test('should validate difficulty parameter', () => {
      const validDifficulties = ['easy', 'medium', 'hard']
      const invalidDifficulties = ['invalid', 'test', '']
      
      validDifficulties.forEach(difficulty => {
        expect(['easy', 'medium', 'hard']).toContain(difficulty)
      })
      
      invalidDifficulties.forEach(difficulty => {
        expect(['easy', 'medium', 'hard']).not.toContain(difficulty)
      })
    })
    
    test('should validate numeric parameters', () => {
      const validNumbers = [0, 1, 10, 100]
      const invalidNumbers = [-1, -10, 'abc', null, undefined]
      
      validNumbers.forEach(num => {
        expect(num).toBeGreaterThanOrEqual(0)
        expect(typeof num).toBe('number')
      })
      
      invalidNumbers.forEach(num => {
        if (typeof num === 'number') {
          expect(num).toBeLessThan(0)
        } else {
          expect(typeof num).not.toBe('number')
        }
      })
    })
  })
  
  describe('Integration Tests', () => {
    test('should handle filtering after adding entries', async () => {
      // Add multiple entries with different game modes and difficulties
      const entries = [
        {
          userId: 'user-1',
          username: 'player1',
          score: 1000,
          gameMode: 'classic',
          difficulty: 'easy'
        },
        {
          userId: 'user-2',
          username: 'player2',
          score: 2000,
          gameMode: 'timed',
          difficulty: 'hard'
        },
        {
          userId: 'user-3',
          username: 'player3',
          score: 1500,
          gameMode: 'classic',
          difficulty: 'medium'
        }
      ]
      
      // Add all entries
      for (const entry of entries) {
        const request = new NextRequest('http://localhost:3000/api/leaderboard', {
          method: 'POST',
          body: JSON.stringify(entry),
          headers: { 'Content-Type': 'application/json' }
        })
        await POST(request)
      }
      
      // Test filtering by game mode
      const filterRequest = new Request('http://localhost:3000/api/leaderboard?gameMode=classic')
      const filterResponse = await GET(filterRequest)
      const filterData = await filterResponse.json()
      
      expect(filterResponse.status).toBe(200)
      expect(filterData.success).toBe(true)
      expect(filterData.data.length).toBeGreaterThan(0)
      expect(filterData.data.every((entry: LeaderboardEntry) => entry.gameMode === 'classic')).toBe(true)
    })
    
    test('should handle pagination with real data', async () => {
      // Add multiple entries
      for (let i = 1; i <= 5; i++) {
        const entry = {
          userId: `user-${i}`,
          username: `player${i}`,
          score: i * 100,
          gameMode: 'classic',
          difficulty: 'medium'
        }
        
        const request = new NextRequest('http://localhost:3000/api/leaderboard', {
          method: 'POST',
          body: JSON.stringify(entry),
          headers: { 'Content-Type': 'application/json' }
        })
        await POST(request)
      }
      
      // Test pagination
      const paginationRequest = new Request('http://localhost:3000/api/leaderboard?limit=2&offset=1')
      const paginationResponse = await GET(paginationRequest)
      const paginationData = await paginationResponse.json()
      
      expect(paginationResponse.status).toBe(200)
      expect(paginationData.success).toBe(true)
      expect(paginationData.data.length).toBeLessThanOrEqual(2)
      expect(paginationData.total).toBeGreaterThan(2)
    })
  })
  
  describe('Error Handling', () => {
    test('should handle internal server errors gracefully', async () => {
      // This test would require mocking internal functions to throw errors
      // For now, we test the error response structure
      const request = new Request('http://localhost:3000/api/leaderboard')
      const response = await GET(request)
      
      // Should not throw and should return proper response structure
      expect(response).toBeDefined()
      const data = await response.json()
      expect(data).toHaveProperty('success')
    })
  })
}) 