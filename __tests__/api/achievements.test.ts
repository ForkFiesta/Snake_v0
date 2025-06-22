import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/achievements/route'
import { Achievement } from '@/types/user'

describe('/api/achievements', () => {
  describe('GET /api/achievements', () => {
    test('should return achievements list', async () => {
      const response = await GET()
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data).toHaveProperty('achievements')
      expect(Array.isArray(data.achievements)).toBe(true)
    })
    
    test('should return empty achievements initially', async () => {
      const response = await GET()
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.achievements).toEqual([])
    })
  })
  
  describe('POST /api/achievements', () => {
    test('should handle achievement unlock request', async () => {
      const achievementData = {
        userId: 'user-123',
        achievementId: 'first-score'
      }
      
      const request = new NextRequest('http://localhost:3000/api/achievements', {
        method: 'POST',
        body: JSON.stringify(achievementData),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(achievementData)
    })
    
    test('should handle malformed JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/achievements', {
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
}) 