# Technical Architecture Document: Snake Web App

## 1. System Overview

This document outlines the technical architecture for the Snake web application built with Next.js, designed to deliver a high-performance, scalable gaming experience with modern web technologies.

### 1.1 Architecture Principles
- **Performance First**: 60fps gameplay with minimal latency
- **Scalability**: Horizontal scaling for user growth
- **Maintainability**: Clean, modular code architecture
- **Accessibility**: WCAG 2.1 AA compliance
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Mobile-First**: Responsive design with touch optimization

### 1.2 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                         │
├─────────────────────────────────────────────────────────────┤
│  Next.js App Router │ React Components │ Canvas Game Engine │
│  Tailwind CSS       │ Framer Motion    │ Web Audio API      │
│  Service Worker     │ Zustand Store    │ Local Storage      │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                      Edge Layer (Vercel)                   │
├─────────────────────────────────────────────────────────────┤
│  Edge Functions     │ CDN Distribution │ Static Assets      │
│  API Routes         │ Image Optimization│ Caching Strategy  │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Backend Services                       │
├─────────────────────────────────────────────────────────────┤
│  Supabase Database  │ Real-time Subs   │ Authentication    │
│  Analytics Service  │ Error Tracking   │ Performance Mon.  │
└─────────────────────────────────────────────────────────────┘
```

## 2. Frontend Architecture

### 2.1 Next.js App Structure

```
src/
├── app/                          # App Router (Next.js 14+)
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── game/
│   │   └── page.tsx             # Game page
│   ├── leaderboard/
│   │   └── page.tsx             # Leaderboard page
│   ├── api/                     # API routes
│   │   ├── scores/
│   │   │   └── route.ts         # Score management
│   │   ├── leaderboard/
│   │   │   └── route.ts         # Leaderboard data
│   │   └── achievements/
│   │       └── route.ts         # Achievement tracking
│   └── manifest.ts              # PWA manifest
├── components/                   # Reusable components
│   ├── ui/                      # Base UI components
│   ├── game/                    # Game-specific components
│   ├── layout/                  # Layout components
│   └── common/                  # Common components
├── lib/                         # Utility libraries
│   ├── game-engine/             # Core game logic
│   ├── stores/                  # Zustand stores
│   ├── utils/                   # Helper functions
│   ├── hooks/                   # Custom React hooks
│   └── constants/               # App constants
├── types/                       # TypeScript definitions
└── public/                      # Static assets
    ├── icons/                   # App icons
    ├── sounds/                  # Audio files
    └── images/                  # Game assets
```

### 2.2 Component Architecture

#### Core Game Components
```typescript
// Game Engine Architecture
GameCanvas
├── GameBoard                    # Main game rendering
├── SnakeRenderer               # Snake visualization
├── FoodRenderer                # Food item rendering
├── EffectsRenderer             # Particle effects
└── UIOverlay                   # Game UI elements

// UI Component Hierarchy
App
├── Layout
│   ├── Header
│   ├── Navigation
│   └── Footer
├── GameScreen
│   ├── GameCanvas
│   ├── GameControls
│   ├── ScoreDisplay
│   └── GameMenu
├── Leaderboard
├── Settings
└── AchievementGallery
```

### 2.3 State Management Architecture

#### Zustand Store Structure
```typescript
// stores/gameStore.ts
interface GameState {
  // Game State
  gameStatus: 'idle' | 'playing' | 'paused' | 'gameOver'
  score: number
  highScore: number
  level: number
  snake: Position[]
  food: Position
  direction: Direction
  nextDirection: Direction
  
  // Game Settings
  difficulty: 'easy' | 'medium' | 'hard'
  gameMode: 'classic' | 'timed' | 'survival' | 'zen'
  boardSize: { width: number; height: number }
  
  // Actions
  startGame: () => void
  pauseGame: () => void
  endGame: () => void
  updateScore: (points: number) => void
  changeDirection: (direction: Direction) => void
  moveSnake: () => void
  generateFood: () => void
}

// stores/uiStore.ts
interface UIState {
  theme: 'classic' | 'dark' | 'neon' | 'retro'
  soundEnabled: boolean
  musicEnabled: boolean
  showTutorial: boolean
  activeModal: string | null
  
  // Actions
  setTheme: (theme: string) => void
  toggleSound: () => void
  toggleMusic: () => void
  showModal: (modal: string) => void
  hideModal: () => void
}

// stores/userStore.ts
interface UserState {
  userId: string | null
  username: string | null
  statistics: UserStatistics
  achievements: Achievement[]
  preferences: UserPreferences
  
  // Actions
  updateStatistics: (stats: Partial<UserStatistics>) => void
  unlockAchievement: (achievementId: string) => void
  savePreferences: (prefs: UserPreferences) => void
}
```

### 2.4 Game Engine Architecture

#### Core Game Loop
```typescript
class GameEngine {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private gameState: GameState
  private lastFrameTime: number = 0
  private gameSpeed: number = 150 // ms per frame
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.initializeGame()
  }
  
  // Main game loop using requestAnimationFrame
  gameLoop = (currentTime: number) => {
    const deltaTime = currentTime - this.lastFrameTime
    
    if (deltaTime >= this.gameSpeed) {
      this.update(deltaTime)
      this.render()
      this.lastFrameTime = currentTime
    }
    
    if (this.gameState.gameStatus === 'playing') {
      requestAnimationFrame(this.gameLoop)
    }
  }
  
  private update(deltaTime: number): void {
    // Game logic updates
    this.moveSnake()
    this.checkCollisions()
    this.checkFoodConsumption()
    this.updateScore()
    this.updateGameSpeed()
  }
  
  private render(): void {
    // Rendering logic
    this.clearCanvas()
    this.drawBoard()
    this.drawSnake()
    this.drawFood()
    this.drawEffects()
  }
}
```

## 3. Data Models

### 3.1 Core Game Models

```typescript
// Game State Models
interface Position {
  x: number
  y: number
}

interface SnakeSegment extends Position {
  id: string
}

interface Food extends Position {
  type: 'normal' | 'powerup' | 'bonus'
  value: number
  effect?: PowerUpEffect
}

interface GameSession {
  id: string
  userId?: string
  score: number
  duration: number
  gameMode: GameMode
  difficulty: Difficulty
  startTime: Date
  endTime: Date
  moves: number
  foodConsumed: number
}

// User Models
interface User {
  id: string
  username: string
  email?: string
  createdAt: Date
  lastActive: Date
  preferences: UserPreferences
}

interface UserStatistics {
  totalGames: number
  totalScore: number
  highScore: number
  averageScore: number
  totalPlayTime: number // in seconds
  gamesWon: number
  currentStreak: number
  longestStreak: number
  favoriteGameMode: GameMode
  achievementsUnlocked: number
}

interface UserPreferences {
  theme: Theme
  soundEnabled: boolean
  musicEnabled: boolean
  difficulty: Difficulty
  defaultGameMode: GameMode
  controlScheme: 'arrows' | 'wasd' | 'touch'
  boardSize: BoardSize
}
```

### 3.2 Leaderboard and Social Models

```typescript
interface LeaderboardEntry {
  id: string
  userId: string
  username: string
  score: number
  gameMode: GameMode
  difficulty: Difficulty
  achievedAt: Date
  rank: number
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'score' | 'gameplay' | 'social' | 'streak'
  condition: AchievementCondition
  reward?: AchievementReward
  unlockedAt?: Date
}

interface DailyChallenge {
  id: string
  date: Date
  title: string
  description: string
  objective: ChallengeObjective
  reward: ChallengeReward
  participants: number
  completions: number
}
```

### 3.3 Database Schema (Supabase)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  preferences JSONB DEFAULT '{}'::jsonb
);

-- Game sessions table
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  score INTEGER NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL, -- in seconds
  game_mode VARCHAR(20) NOT NULL,
  difficulty VARCHAR(10) NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  moves INTEGER DEFAULT 0,
  food_consumed INTEGER DEFAULT 0,
  session_data JSONB DEFAULT '{}'::jsonb
);

-- Leaderboard table
CREATE TABLE leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  username VARCHAR(50) NOT NULL,
  score INTEGER NOT NULL,
  game_mode VARCHAR(20) NOT NULL,
  difficulty VARCHAR(10) NOT NULL,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id UUID REFERENCES game_sessions(id)
);

-- User achievements table
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  achievement_id VARCHAR(50) NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress JSONB DEFAULT '{}'::jsonb,
  UNIQUE(user_id, achievement_id)
);

-- Daily challenges table
CREATE TABLE daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE UNIQUE NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  objective JSONB NOT NULL,
  reward JSONB NOT NULL,
  active BOOLEAN DEFAULT true
);

-- User statistics (materialized view for performance)
CREATE MATERIALIZED VIEW user_statistics AS
SELECT 
  u.id as user_id,
  u.username,
  COUNT(gs.id) as total_games,
  COALESCE(SUM(gs.score), 0) as total_score,
  COALESCE(MAX(gs.score), 0) as high_score,
  COALESCE(AVG(gs.score), 0) as average_score,
  COALESCE(SUM(gs.duration), 0) as total_play_time,
  COUNT(ua.id) as achievements_unlocked
FROM users u
LEFT JOIN game_sessions gs ON u.id = gs.user_id
LEFT JOIN user_achievements ua ON u.id = ua.user_id
GROUP BY u.id, u.username;

-- Indexes for performance
CREATE INDEX idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_score ON game_sessions(score DESC);
CREATE INDEX idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX idx_leaderboard_game_mode ON leaderboard(game_mode, score DESC);
```

## 4. API Architecture

### 4.1 API Route Structure

```typescript
// app/api/scores/route.ts
export async function POST(request: Request) {
  const { score, gameMode, difficulty, duration, moves } = await request.json()
  
  // Validate score data
  const validation = validateScoreData({ score, gameMode, difficulty })
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }
  
  // Save to database
  const session = await saveGameSession({
    score,
    gameMode,
    difficulty,
    duration,
    moves,
    userId: getCurrentUserId()
  })
  
  // Update leaderboard if necessary
  await updateLeaderboard(session)
  
  // Check for achievements
  await checkAchievements(session.userId, session)
  
  return NextResponse.json({ success: true, sessionId: session.id })
}

// app/api/leaderboard/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const gameMode = searchParams.get('gameMode') || 'classic'
  const difficulty = searchParams.get('difficulty') || 'medium'
  const limit = parseInt(searchParams.get('limit') || '10')
  
  const leaderboard = await getLeaderboard({
    gameMode,
    difficulty,
    limit
  })
  
  return NextResponse.json(leaderboard)
}

// app/api/achievements/route.ts
export async function GET(request: Request) {
  const userId = getCurrentUserId()
  const achievements = await getUserAchievements(userId)
  return NextResponse.json(achievements)
}

export async function POST(request: Request) {
  const { achievementId } = await request.json()
  const userId = getCurrentUserId()
  
  const result = await unlockAchievement(userId, achievementId)
  return NextResponse.json(result)
}
```

### 4.2 Real-time Features

```typescript
// lib/realtime.ts
import { createClient } from '@supabase/supabase-js'

class RealtimeManager {
  private supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)
  
  subscribeToLeaderboard(gameMode: string, callback: (data: LeaderboardEntry[]) => void) {
    return this.supabase
      .channel(`leaderboard:${gameMode}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'leaderboard',
        filter: `game_mode=eq.${gameMode}`
      }, (payload) => {
        // Update leaderboard in real-time
        this.fetchLeaderboard(gameMode).then(callback)
      })
      .subscribe()
  }
  
  subscribeToAchievements(userId: string, callback: (achievement: Achievement) => void) {
    return this.supabase
      .channel(`achievements:${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'user_achievements',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        callback(payload.new as Achievement)
      })
      .subscribe()
  }
}
```

### 4.3 Caching Strategy

```typescript
// lib/cache.ts
class CacheManager {
  private static CACHE_KEYS = {
    LEADERBOARD: (gameMode: string) => `leaderboard:${gameMode}`,
    USER_STATS: (userId: string) => `user_stats:${userId}`,
    ACHIEVEMENTS: 'achievements:all'
  }
  
  // In-memory cache for frequently accessed data
  private memoryCache = new Map<string, { data: any; expires: number }>()
  
  async get<T>(key: string): Promise<T | null> {
    // Check memory cache first
    const cached = this.memoryCache.get(key)
    if (cached && cached.expires > Date.now()) {
      return cached.data
    }
    
    // Check localStorage for client-side caching
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(key)
      if (stored) {
        const { data, expires } = JSON.parse(stored)
        if (expires > Date.now()) {
          return data
        }
      }
    }
    
    return null
  }
  
  async set<T>(key: string, data: T, ttl: number = 300000): Promise<void> {
    const expires = Date.now() + ttl
    
    // Set in memory cache
    this.memoryCache.set(key, { data, expires })
    
    // Set in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify({ data, expires }))
    }
  }
}
```

## 5. Performance Optimization

### 5.1 Code Splitting Strategy

```typescript
// Dynamic imports for lazy loading
const GameCanvas = dynamic(() => import('@/components/game/GameCanvas'), {
  loading: () => <GameSkeleton />,
  ssr: false
})

const Leaderboard = dynamic(() => import('@/components/Leaderboard'), {
  loading: () => <LeaderboardSkeleton />
})

const AchievementGallery = dynamic(() => import('@/components/AchievementGallery'))

// Route-based code splitting
const gameRoutes = {
  '/game': () => import('./game/page'),
  '/leaderboard': () => import('./leaderboard/page'),
  '/achievements': () => import('./achievements/page')
}
```

### 5.2 Asset Optimization

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  },
  
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', 'zustand']
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  
  // Bundle analyzer
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all'
      config.optimization.splitChunks.cacheGroups = {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        },
        game: {
          test: /[\\/]lib[\\/]game-engine[\\/]/,
          name: 'game-engine',
          chunks: 'all'
        }
      }
    }
    return config
  }
}
```

### 5.3 Service Worker Implementation

```typescript
// public/sw.js
const CACHE_NAME = 'snake-game-v1'
const STATIC_ASSETS = [
  '/',
  '/game',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/sounds/eat.mp3',
  '/sounds/game-over.mp3'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
  )
})

self.addEventListener('fetch', (event) => {
  // Cache-first strategy for static assets
  if (event.request.url.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|mp3|wav)$/)) {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    )
  }
  
  // Network-first strategy for API calls
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    )
  }
})
```

## 6. Deployment Strategy

### 6.1 Vercel Deployment Configuration

```typescript
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm ci",
  "devCommand": "npm run dev",
  "framework": "nextjs",
  
  "functions": {
    "app/api/*/route.ts": {
      "maxDuration": 10
    }
  },
  
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=60, stale-while-revalidate"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ],
  
  "rewrites": [
    {
      "source": "/api/health",
      "destination": "/api/health/route"
    }
  ]
}
```

### 6.2 Environment Configuration

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Error Tracking
SENTRY_DSN=your-sentry-dsn
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project

# Performance Monitoring
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-vercel-analytics-id
```

### 6.3 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build

  deploy-preview:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-production:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 6.4 Monitoring and Analytics

```typescript
// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs'
import { Analytics } from '@vercel/analytics/react'

// Error tracking setup
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Filter out non-critical errors
    if (event.exception) {
      const error = event.exception.values?.[0]
      if (error?.type === 'ChunkLoadError') {
        return null // Ignore chunk load errors
      }
    }
    return event
  }
})

// Custom analytics events
export const trackGameEvent = (eventName: string, properties: Record<string, any>) => {
  // Vercel Analytics
  if (typeof window !== 'undefined' && window.va) {
    window.va('track', eventName, properties)
  }
  
  // Custom analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties)
  }
}

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now()
  fn()
  const duration = performance.now() - start
  
  trackGameEvent('performance_metric', {
    metric_name: name,
    duration: Math.round(duration)
  })
}
```

## 7. Security Considerations

### 7.1 Client-Side Security

```typescript
// lib/security.ts
export class SecurityManager {
  // Validate game scores to prevent cheating
  static validateScore(score: number, gameData: GameSession): boolean {
    const maxPossibleScore = this.calculateMaxScore(gameData)
    const minTimeRequired = this.calculateMinTime(score)
    
    return (
      score <= maxPossibleScore &&
      gameData.duration >= minTimeRequired &&
      this.validateGameProgression(gameData)
    )
  }
  
  // Rate limiting for API calls
  static rateLimiter = new Map<string, number[]>()
  
  static isRateLimited(userId: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now()
    const userRequests = this.rateLimiter.get(userId) || []
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => now - time < windowMs)
    
    if (validRequests.length >= maxRequests) {
      return true
    }
    
    validRequests.push(now)
    this.rateLimiter.set(userId, validRequests)
    return false
  }
  
  // Input sanitization
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .substring(0, 100) // Limit length
      .trim()
  }
}
```

### 7.2 API Security

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // CORS headers
  const response = NextResponse.next()
  response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Rate limiting check
  const clientIP = request.ip || 'unknown'
  if (SecurityManager.isRateLimited(clientIP, 100, 60000)) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }
  
  return response
}

export const config = {
  matcher: ['/api/:path*']
}
```

## 8. Testing Strategy

### 8.1 Testing Architecture

```typescript
// __tests__/game-engine.test.ts
import { GameEngine } from '@/lib/game-engine/GameEngine'

describe('GameEngine', () => {
  let canvas: HTMLCanvasElement
  let gameEngine: GameEngine
  
  beforeEach(() => {
    canvas = document.createElement('canvas')
    gameEngine = new GameEngine(canvas)
  })
  
  describe('Snake Movement', () => {
    test('should move snake in correct direction', () => {
      gameEngine.changeDirection('right')
      const initialPosition = gameEngine.getSnakePosition()
      
      gameEngine.update(16) // Simulate 16ms frame
      
      const newPosition = gameEngine.getSnakePosition()
      expect(newPosition.x).toBe(initialPosition.x + 1)
    })
    
    test('should prevent reverse direction', () => {
      gameEngine.changeDirection('right')
      gameEngine.update(16)
      gameEngine.changeDirection('left') // Should be ignored
      
      const direction = gameEngine.getCurrentDirection()
      expect(direction).toBe('right')
    })
  })
  
  describe('Collision Detection', () => {
    test('should detect wall collision', () => {
      // Move snake to edge
      gameEngine.setSnakePosition({ x: 19, y: 10 })
      gameEngine.changeDirection('right')
      gameEngine.update(16)
      
      expect(gameEngine.getGameStatus()).toBe('gameOver')
    })
    
    test('should detect self collision', () => {
      // Create scenario where snake hits itself
      const snake = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 },
        { x: 3, y: 4 },
        { x: 4, y: 4 },
        { x: 5, y: 4 }
      ]
      
      gameEngine.setSnake(snake)
      gameEngine.changeDirection('down')
      gameEngine.update(16)
      
      expect(gameEngine.getGameStatus()).toBe('gameOver')
    })
  })
})

// __tests__/api/scores.test.ts
import { POST } from '@/app/api/scores/route'

describe('/api/scores', () => {
  test('should save valid score', async () => {
    const request = new Request('http://localhost/api/scores', {
      method: 'POST',
      body: JSON.stringify({
        score: 100,
        gameMode: 'classic',
        difficulty: 'medium',
        duration: 120,
        moves: 50
      })
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.sessionId).toBeDefined()
  })
  
  test('should reject invalid score', async () => {
    const request = new Request('http://localhost/api/scores', {
      method: 'POST',
      body: JSON.stringify({
        score: -1, // Invalid score
        gameMode: 'classic',
        difficulty: 'medium'
      })
    })
    
    const response = await POST(request)
    expect(response.status).toBe(400)
  })
})
```

### 8.2 Performance Testing

```typescript
// __tests__/performance.test.ts
import { GameEngine } from '@/lib/game-engine/GameEngine'

describe('Performance Tests', () => {
  test('game loop should maintain 60fps', (done) => {
    const canvas = document.createElement('canvas')
    const gameEngine = new GameEngine(canvas)
    
    const frameCount = 60
    let frames = 0
    const startTime = performance.now()
    
    const testLoop = () => {
      gameEngine.update(16.67) // 60fps = ~16.67ms per frame
      frames++
      
      if (frames < frameCount) {
        requestAnimationFrame(testLoop)
      } else {
        const endTime = performance.now()
        const duration = endTime - startTime
        const fps = (frames / duration) * 1000
        
        expect(fps).toBeGreaterThan(55) // Allow some variance
        done()
      }
    }
    
    requestAnimationFrame(testLoop)
  })
  
  test('memory usage should remain stable', () => {
    const canvas = document.createElement('canvas')
    const gameEngine = new GameEngine(canvas)
    
    const initialMemory = performance.memory?.usedJSHeapSize || 0
    
    // Simulate 1000 game updates
    for (let i = 0; i < 1000; i++) {
      gameEngine.update(16.67)
    }
    
    const finalMemory = performance.memory?.usedJSHeapSize || 0
    const memoryIncrease = finalMemory - initialMemory
    
    // Memory increase should be minimal (less than 1MB)
    expect(memoryIncrease).toBeLessThan(1024 * 1024)
  })
})
```

## 9. Conclusion

This technical architecture provides a solid foundation for building a high-performance, scalable Snake web application. The architecture emphasizes:

- **Performance**: 60fps gameplay with optimized rendering and caching
- **Scalability**: Horizontal scaling with edge deployment and efficient data models
- **Maintainability**: Clean separation of concerns and modular architecture
- **Security**: Comprehensive security measures and input validation
- **User Experience**: Progressive enhancement and offline capabilities

The modular design allows for iterative development and easy feature additions, while the robust testing strategy ensures reliability and performance across all user scenarios. 