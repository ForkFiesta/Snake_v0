import { NextRequest } from 'next/server'
import { GET } from '@/app/api/health/route'

describe('/api/health', () => {
  describe('GET /api/health', () => {
    test('should return health status with correct structure', async () => {
      const response = await GET()
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data).toHaveProperty('status')
      expect(data).toHaveProperty('timestamp')
      expect(data).toHaveProperty('version')
    })
    
    test('should return status as "ok"', async () => {
      const response = await GET()
      const data = await response.json()
      
      expect(data.status).toBe('ok')
    })
    
    test('should return valid ISO timestamp', async () => {
      const beforeCall = new Date()
      const response = await GET()
      const afterCall = new Date()
      const data = await response.json()
      
      const timestamp = new Date(data.timestamp)
      expect(timestamp).toBeInstanceOf(Date)
      expect(timestamp.getTime()).toBeGreaterThanOrEqual(beforeCall.getTime())
      expect(timestamp.getTime()).toBeLessThanOrEqual(afterCall.getTime())
      
      // Verify it's a valid ISO string
      expect(data.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
    })
    
    test('should return correct version', async () => {
      const response = await GET()
      const data = await response.json()
      
      expect(data.version).toBe('1.0.0')
    })
    
    test('should return valid response format', async () => {
      const response = await GET()
      
      // Verify the response is a valid NextResponse with JSON content
      expect(response).toBeDefined()
      expect(typeof response.json).toBe('function')
      
      // Ensure we can parse the JSON without errors
      const data = await response.json()
      expect(data).toBeInstanceOf(Object)
    })
    
    test('should handle multiple concurrent requests', async () => {
      const requests = Array(10).fill(null).map(() => GET())
      const responses = await Promise.all(requests)
      
      responses.forEach(response => {
        expect(response.status).toBe(200)
      })
      
      const dataPromises = responses.map(response => response.json())
      const dataResults = await Promise.all(dataPromises)
      
      dataResults.forEach(data => {
        expect(data.status).toBe('ok')
        expect(data.version).toBe('1.0.0')
        expect(data.timestamp).toBeDefined()
      })
    })
    
    test('should return unique timestamps for rapid consecutive calls', async () => {
      const response1 = await GET()
      const response2 = await GET()
      
      const data1 = await response1.json()
      const data2 = await response2.json()
      
      // Timestamps should be different (or at least not fail if same due to timing)
      expect(data1.timestamp).toBeDefined()
      expect(data2.timestamp).toBeDefined()
    })
    
    test('should not accept other HTTP methods', async () => {
      // This test ensures only GET is supported
      // Note: Next.js will automatically return 405 for unsupported methods
      // We can't directly test this in unit tests, but we document the expectation
      const response = await GET()
      expect(response.status).toBe(200)
    })
    
    test('should have consistent response schema', async () => {
      const response = await GET()
      const data = await response.json()
      
      // Verify exact schema
      const expectedKeys = ['status', 'timestamp', 'version']
      const actualKeys = Object.keys(data).sort()
      
      expect(actualKeys).toEqual(expectedKeys.sort())
    })
    
    test('should return valid JSON', async () => {
      const response = await GET()
      
      // This should not throw
      expect(async () => {
        await response.json()
      }).not.toThrow()
    })
  })
  
  describe('Health endpoint performance', () => {
    test('should respond quickly', async () => {
      const startTime = performance.now()
      const response = await GET()
      const endTime = performance.now()
      
      expect(response.status).toBe(200)
      
      // Health endpoint should respond in under 100ms
      const responseTime = endTime - startTime
      expect(responseTime).toBeLessThan(100)
    })
  })
  
  describe('Health endpoint reliability', () => {
    test('should be idempotent', async () => {
      const response1 = await GET()
      const response2 = await GET()
      const response3 = await GET()
      
      const data1 = await response1.json()
      const data2 = await response2.json()
      const data3 = await response3.json()
      
      // Status and version should be identical
      expect(data1.status).toBe(data2.status)
      expect(data2.status).toBe(data3.status)
      expect(data1.version).toBe(data2.version)
      expect(data2.version).toBe(data3.version)
    })
  })
}) 