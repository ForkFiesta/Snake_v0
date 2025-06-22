import { test, expect } from '@playwright/test'

test.describe('Health Endpoint E2E', () => {
  test('should respond to health check via HTTP', async ({ request }) => {
    const response = await request.get('/api/health')
    
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(data).toHaveProperty('status', 'ok')
    expect(data).toHaveProperty('timestamp')
    expect(data).toHaveProperty('version', '1.0.0')
    
    // Verify timestamp is recent (within last minute)
    const timestamp = new Date(data.timestamp)
    const now = new Date()
    const timeDiff = now.getTime() - timestamp.getTime()
    expect(timeDiff).toBeLessThan(60000) // Less than 1 minute
  })
  
  test('should return correct content-type header via HTTP', async ({ request }) => {
    const response = await request.get('/api/health')
    
    expect(response.headers()['content-type']).toContain('application/json')
  })
  
  test('should handle multiple concurrent requests via HTTP', async ({ request }) => {
    const requests = Array(5).fill(null).map(() => request.get('/api/health'))
    const responses = await Promise.all(requests)
    
    responses.forEach(response => {
      expect(response.status()).toBe(200)
    })
  })
  
  test('should not accept POST method', async ({ request }) => {
    const response = await request.post('/api/health', {
      data: { test: 'data' }
    })
    
    expect(response.status()).toBe(405) // Method Not Allowed
  })
  
  test('should not accept PUT method', async ({ request }) => {
    const response = await request.put('/api/health', {
      data: { test: 'data' }
    })
    
    expect(response.status()).toBe(405) // Method Not Allowed
  })
  
  test('should not accept DELETE method', async ({ request }) => {
    const response = await request.delete('/api/health')
    
    expect(response.status()).toBe(405) // Method Not Allowed
  })
}) 