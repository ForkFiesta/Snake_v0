import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  console.log('🎭 Starting Playwright global setup...')
  
  // Set up test environment
  // NODE_ENV is set by the test runner
  
  // Launch browser for setup tasks
  const browser = await chromium.launch()
  const page = await browser.newPage()
  
  try {
    // Wait for the development server to be ready
    const baseURL = config.projects[0].use?.baseURL || 'http://localhost:3000'
    console.log(`⏳ Waiting for dev server at ${baseURL}...`)
    
    let retries = 0
    const maxRetries = 30
    
    while (retries < maxRetries) {
      try {
        const response = await page.goto(baseURL, { timeout: 5000 })
        if (response?.ok()) {
          console.log('✅ Dev server is ready!')
          break
        }
      } catch (error) {
        retries++
        if (retries >= maxRetries) {
          throw new Error(`Dev server not ready after ${maxRetries} attempts`)
        }
        console.log(`⏳ Attempt ${retries}/${maxRetries} - waiting for dev server...`)
        await page.waitForTimeout(2000)
      }
    }
    
    // Pre-populate test data if needed
    console.log('📝 Setting up test data...')
    
    // Clear any existing localStorage data
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    
    // Set up test user data
    await page.evaluate(() => {
      localStorage.setItem('snake-test-user', JSON.stringify({
        id: 'test-user-123',
        username: 'testuser',
        preferences: {
          theme: 'classic',
          soundEnabled: false,
          difficulty: 'medium'
        }
      }))
      
      localStorage.setItem('snake-high-scores', JSON.stringify({
        classic: { easy: 150, medium: 100, hard: 50 },
        timed: { easy: 120, medium: 80, hard: 40 },
        survival: { easy: 90, medium: 60, hard: 30 }
      }))
    })
    
    console.log('✅ Test data setup completed')
    
  } catch (error) {
    console.error('❌ Global setup failed:', error)
    throw error
  } finally {
    await browser.close()
  }
  
  console.log('🎭 Playwright global setup completed')
}

export default globalSetup 