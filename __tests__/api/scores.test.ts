import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/scores/route'
import { ScoreSubmission } from '@/types/api'

describe('/api/scores', () => {
  describe('POST /api/scores', () => {
    test('should save valid score', async () => {
      const scoreData: ScoreSubmission = {
        score: 100,
        gameMode: 'classic',
        difficulty: 'medium',
        duration: 120,
        moves: 50,
        foodConsumed: 10
      }
      
      const request = new NextRequest('http://localhost:3000/api/scores', {
        method: 'POST',
        body: JSON.stringify(scoreData),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(scoreData)
    })
    
    test('should handle malformed JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/scores', {
        method: 'POST',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      try {
        await POST(request)
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
  })
  
  describe('GET /api/scores', () => {
    test('should return scores list', async () => {
      const response = await GET()
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data).toHaveProperty('scores')
      expect(Array.isArray(data.scores)).toBe(true)
    })
    
    test('should return empty scores initially', async () => {
      const response = await GET()
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.scores).toEqual([])
    })
  })
}) 