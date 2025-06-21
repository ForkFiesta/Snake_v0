// Global teardown for Jest tests
module.exports = async () => {
  // Clean up any global resources
  if (global.testUtils) {
    delete global.testUtils
  }
  
  // Reset console methods
  if (global.originalConsoleError) {
    console.error = global.originalConsoleError
  }
  if (global.originalConsoleWarn) {
    console.warn = global.originalConsoleWarn
  }
  
  // Clean up any timers
  jest.clearAllTimers()
  
  console.log('🧪 Jest global teardown completed')
} 