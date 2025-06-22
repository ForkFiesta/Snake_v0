// Jest DOM matchers
import '@testing-library/jest-dom'

// Polyfill Web APIs for Node.js environment
import { TextEncoder, TextDecoder } from 'util'
import { ReadableStream } from 'stream/web'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
global.ReadableStream = ReadableStream

// Mock NextRequest and NextResponse for API testing
jest.mock('next/server', () => {
  // Create a proper NextResponse mock
  const createMockResponse = (data, options = {}) => {
    const status = options?.status || 200
    const response = {
      status,
      statusText: options?.statusText || 'OK',
      headers: new Map([
        ['content-type', 'application/json'],
        ...Object.entries(options?.headers || {})
      ]),
      ok: status >= 200 && status < 300,
      json: jest.fn().mockResolvedValue(data)
    }
    
    // Add getter for headers
    response.headers.get = jest.fn((name) => {
      const entries = Array.from(response.headers.entries())
      const entry = entries.find(([key]) => key.toLowerCase() === name.toLowerCase())
      return entry ? entry[1] : null
    })
    
    return response
  }

  return {
    NextRequest: jest.fn().mockImplementation((url, options = {}) => ({
      url,
      method: options.method || 'GET',
      headers: new Map(Object.entries(options.headers || {})),
      body: options.body,
      json: jest.fn().mockImplementation(async () => {
        if (options.body) {
          return JSON.parse(options.body)
        }
        return {}
      })
    })),
    NextResponse: {
      json: jest.fn().mockImplementation((data, options = {}) => {
        return createMockResponse(data, options)
      })
    }
  }
})

// Mock Request and Response for Web API compatibility
global.Request = class Request {
  constructor(url, options = {}) {
    Object.defineProperty(this, 'url', { value: url, writable: false })
    this.method = options.method || 'GET'
    this.headers = new Map(Object.entries(options.headers || {}))
    this.body = options.body
  }
  
  async json() {
    return JSON.parse(this.body)
  }
}

global.Response = class Response {
  constructor(body, options = {}) {
    this.body = body
    this.status = options.status || 200
    this.statusText = options.statusText || 'OK'
    this.headers = new Map(Object.entries(options.headers || {}))
    this.ok = this.status >= 200 && this.status < 300
  }
  
  async json() {
    return JSON.parse(this.body)
  }
  
  async text() {
    return this.body
  }
  
  // Add static json method that NextResponse uses
  static json(data, options = {}) {
    const status = options?.status || 200
    const response = new Response(JSON.stringify(data), {
      status,
      statusText: options?.statusText || 'OK',
      headers: {
        'content-type': 'application/json',
        ...options?.headers
      }
    })
    return response
  }
}

// Mock URL and URLSearchParams
global.URL = URL
global.URLSearchParams = URLSearchParams

// Mock fetch API
global.fetch = jest.fn()

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
}))

// Mock Next.js navigation (App Router)
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    span: 'span',
    button: 'button',
    canvas: 'canvas',
    img: 'img',
  },
  AnimatePresence: ({ children }) => children,
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn(),
  }),
}))

// Mock Web Audio API
Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    createOscillator: jest.fn(() => ({
      connect: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
      frequency: { value: 0 },
      type: 'sine',
    })),
    createGain: jest.fn(() => ({
      connect: jest.fn(),
      gain: { value: 0 },
    })),
    destination: {},
    currentTime: 0,
    sampleRate: 44100,
    state: 'running',
    suspend: jest.fn(),
    resume: jest.fn(),
    close: jest.fn(),
  })),
})

// Mock Canvas API
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
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
}))

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => {
  setTimeout(cb, 16)
  return 1
})

global.cancelAnimationFrame = jest.fn()

// Mock performance.now
Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByName: jest.fn(() => []),
    getEntriesByType: jest.fn(() => []),
  },
})

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock,
})

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Custom matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      }
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      }
    }
  },
})

// Console error/warning suppression for tests
const originalError = console.error
const originalWarn = console.warn

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
  
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('componentWillReceiveProps has been renamed')
    ) {
      return
    }
    originalWarn.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
  console.warn = originalWarn
}) 