// Global setup for Jest tests
module.exports = async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test'
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
  
  // Mock console methods for cleaner test output
  const originalConsoleError = console.error
  const originalConsoleWarn = console.warn
  
  console.error = (...args) => {
    // Suppress known React warnings in tests
    const message = args[0]
    if (typeof message === 'string') {
      if (
        message.includes('Warning: ReactDOM.render is no longer supported') ||
        message.includes('Warning: componentWillReceiveProps has been renamed') ||
        message.includes('Warning: componentWillMount has been renamed')
      ) {
        return
      }
    }
    originalConsoleError.apply(console, args)
  }
  
  console.warn = (...args) => {
    // Suppress known warnings
    const message = args[0]
    if (typeof message === 'string') {
      if (
        message.includes('componentWillReceiveProps has been renamed') ||
        message.includes('componentWillMount has been renamed')
      ) {
        return
      }
    }
    originalConsoleWarn.apply(console, args)
  }
  
  // Setup global test utilities
  global.testUtils = {
    createMockGameState: () => ({
      gameStatus: 'idle',
      score: 0,
      highScore: 0,
      level: 1,
      snake: [{ x: 10, y: 10 }],
      food: { x: 15, y: 15 },
      direction: 'right',
      nextDirection: 'right',
      difficulty: 'medium',
      gameMode: 'classic',
      boardSize: { width: 20, height: 20 },
    }),
    
    createMockCanvasContext: () => ({
      fillRect: jest.fn(),
      clearRect: jest.fn(),
      getImageData: jest.fn(() => ({ data: new Array(4) })),
      putImageData: jest.fn(),
      createImageData: jest.fn(() => ({ data: new Array(4) })),
      setTransform: jest.fn(),
      drawImage: jest.fn(),
      save: jest.fn(),
      fillText: jest.fn(),
      restore: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      closePath: jest.fn(),
      stroke: jest.fn(),
      translate: jest.fn(),
      scale: jest.fn(),
      rotate: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      measureText: jest.fn(() => ({ width: 0 })),
      transform: jest.fn(),
      rect: jest.fn(),
      clip: jest.fn(),
    }),
    
    waitForNextTick: () => new Promise(resolve => setTimeout(resolve, 0)),
    
    flushPromises: () => new Promise(resolve => setImmediate(resolve)),
  }
  
  console.log('🧪 Jest global setup completed')
} 