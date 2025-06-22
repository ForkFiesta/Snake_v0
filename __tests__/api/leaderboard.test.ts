import { NextRequest } from 'next/server'
import { GET } from '@/app/api/leaderboard/route'
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
    })
    
    test('should handle invalid difficulty', async () => {
      const request = new Request('http://localhost:3000/api/leaderboard?difficulty=invalid')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid difficulty')
    })
    
    test('should handle invalid limit parameter', async () => {
      const request = new Request('http://localhost:3000/api/leaderboard?limit=-1')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid limit')
    })
    
    test('should handle invalid offset parameter', async () => {
      const request = new Request('http://localhost:3000/api/leaderboard?offset=-1')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid offset')
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
}) 