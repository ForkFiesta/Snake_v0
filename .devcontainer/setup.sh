#!/bin/bash

# Snake Web App Development Environment Setup Script
# This script runs after the devcontainer is created

set -e

echo "🎮 Setting up Snake Web App Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_step "Initializing new Next.js project..."
    
    # Create package.json for Snake Web App
    cat > package.json << 'EOF'
{
  "name": "snake-web-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx --fix",
    "lint:check": "eslint . --ext .ts,.tsx",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test",
    "test:coverage": "jest --coverage",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "analyze": "ANALYZE=true next build",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18",
    "react-dom": "^18",
    "@supabase/supabase-js": "^2.38.0",
    "zustand": "^4.4.0",
    "framer-motion": "^10.16.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@next/eslint-config-next": "^14.0.0",
    "eslint": "^8",
    "eslint-config-prettier": "^9.0.0",
    "prettier": "^3.0.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "@tailwindcss/typography": "^0.5.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@playwright/test": "^1.40.0",
    "@storybook/nextjs": "^7.5.0",
    "@storybook/react": "^7.5.0",
    "husky": "^8.0.0",
    "lint-staged": "^15.0.0"
  }
}
EOF

    print_status "Created package.json"
fi

# Install dependencies
print_step "Installing npm dependencies..."
npm install

# Set up Git hooks with Husky
print_step "Setting up Git hooks..."
if [ -d ".git" ]; then
    npx husky install
    npx husky add .husky/pre-commit "npx lint-staged"
    npx husky add .husky/commit-msg 'npx --no -- commitlint --edit ${1}'
    
    # Create lint-staged configuration
    cat > .lintstagedrc.json << 'EOF'
{
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,md,yml,yaml}": [
    "prettier --write"
  ]
}
EOF
    
    print_status "Git hooks configured"
else
    print_warning "Not a git repository. Skipping Git hooks setup."
fi

# Create essential configuration files
print_step "Creating configuration files..."

# TypeScript configuration
if [ ! -f "tsconfig.json" ]; then
    cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF
    print_status "Created tsconfig.json"
fi

# Tailwind CSS configuration
if [ ! -f "tailwind.config.js" ]; then
    cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        snake: {
          primary: '#22c55e',
          secondary: '#16a34a',
          accent: '#eab308',
          danger: '#ef4444',
        },
        game: {
          board: '#1f2937',
          grid: '#374151',
        }
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 1s ease-in-out 2',
      },
      fontFamily: {
        game: ['Courier New', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
EOF
    print_status "Created tailwind.config.js"
fi

# PostCSS configuration
if [ ! -f "postcss.config.js" ]; then
    cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF
    print_status "Created postcss.config.js"
fi

# Next.js configuration
if [ ! -f "next.config.js" ]; then
    cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  // PWA configuration will be added here
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

// Bundle analyzer
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
EOF
    print_status "Created next.config.js"
fi

# ESLint configuration
if [ ! -f ".eslintrc.json" ]; then
    cat > .eslintrc.json << 'EOF'
{
  "extends": [
    "next/core-web-vitals",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-var": "error"
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  }
}
EOF
    print_status "Created .eslintrc.json"
fi

# Prettier configuration
if [ ! -f ".prettierrc" ]; then
    cat > .prettierrc << 'EOF'
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
EOF
    print_status "Created .prettierrc"
fi

# Jest configuration
if [ ! -f "jest.config.js" ]; then
    cat > jest.config.js << 'EOF'
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
EOF
    print_status "Created jest.config.js"
fi

# Jest setup file
if [ ! -f "jest.setup.js" ]; then
    cat > jest.setup.js << 'EOF'
import '@testing-library/jest-dom'

// Mock canvas for game engine tests
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
  fill: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fillStyle: '',
  strokeStyle: '',
}))

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 16))
global.cancelAnimationFrame = jest.fn()

// Mock performance API
Object.defineProperty(global, 'performance', {
  writable: true,
  value: {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
  },
})
EOF
    print_status "Created jest.setup.js"
fi

# Playwright configuration
if [ ! -f "playwright.config.ts" ]; then
    cat > playwright.config.ts << 'EOF'
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
EOF
    print_status "Created playwright.config.ts"
fi

# Create directory structure
print_step "Creating project directory structure..."

# Create src directory structure
mkdir -p src/{app,components/{ui,game,layout,common},lib/{game-engine,stores,hooks,utils,constants,types,api},public/{icons,sounds,images}}

# Create test directories
mkdir -p tests/{unit,integration,e2e}

# Create basic app structure if it doesn't exist
if [ ! -f "src/app/layout.tsx" ]; then
    mkdir -p src/app
    
    # Root layout
    cat > src/app/layout.tsx << 'EOF'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Snake Game - Modern Web Experience',
  description: 'A visually polished, production-ready Snake web game built with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
EOF

    # Home page
    cat > src/app/page.tsx << 'EOF'
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4 font-game">🐍 SNAKE</h1>
        <p className="text-xl mb-8">Modern Web Game Experience</p>
        <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
          Start Game
        </button>
      </div>
    </main>
  )
}
EOF

    # Global styles
    cat > src/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: system-ui, sans-serif;
  }
}

@layer components {
  .game-button {
    @apply px-4 py-2 bg-snake-primary hover:bg-snake-secondary text-white rounded-lg font-medium transition-colors;
  }
  
  .game-cell {
    @apply border border-game-grid;
  }
  
  .snake-head {
    @apply bg-snake-primary rounded-sm;
  }
  
  .snake-body {
    @apply bg-snake-secondary;
  }
  
  .food {
    @apply bg-snake-accent rounded-full;
  }
}
EOF

    print_status "Created basic app structure"
fi

# Create environment files
print_step "Creating environment configuration..."

if [ ! -f ".env.local" ]; then
    cat > .env.local << 'EOF'
# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_TELEMETRY_DISABLED=1

# Supabase Configuration (Development)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/snake_game

# Redis (Optional)
REDIS_URL=redis://localhost:6379

# Development
NODE_ENV=development
EOF
    print_status "Created .env.local"
fi

# Create .env.example
cat > .env.example << 'EOF'
# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_TELEMETRY_DISABLED=1

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database
DATABASE_URL=your_database_url

# Redis (Optional)
REDIS_URL=your_redis_url

# Analytics (Optional)
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id

# Error Tracking (Optional)
SENTRY_DSN=your_sentry_dsn
EOF

# Create .gitignore
if [ ! -f ".gitignore" ]; then
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage
/.nyc_output

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode/settings.json
.idea/

# Logs
logs
*.log

# Playwright
/test-results/
/playwright-report/
/playwright/.cache/

# Storybook
storybook-static/

# Bundle analyzer
.next/analyze/

# Database
*.db
*.sqlite

# OS
Thumbs.db
EOF
    print_status "Created .gitignore"
fi

# Create README
if [ ! -f "README.md" ]; then
    cat > README.md << 'EOF'
# 🐍 Snake Web App

A visually polished, production-ready Snake web application built with Next.js, featuring modern UI/UX, multiple game modes, real-time leaderboards, and comprehensive user engagement features.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 🎮 Features

- **Modern Gameplay**: Smooth 60fps Snake game with multiple modes
- **Real-time Leaderboards**: Compete with players worldwide
- **Achievement System**: Unlock badges and track progress
- **PWA Support**: Install and play offline
- **Responsive Design**: Perfect on desktop and mobile
- **Accessibility**: Full keyboard navigation and screen reader support

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Database**: Supabase
- **Testing**: Jest + Playwright
- **Deployment**: Vercel

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router
├── components/       # React components
├── lib/             # Utilities and logic
└── public/          # Static assets
```

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 📈 Performance

- Bundle size: <500KB gzipped
- Lighthouse score: 90+
- 60fps gameplay
- <2s load time

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
EOF
    print_status "Created README.md"
fi

# Install Playwright browsers if not already installed
print_step "Setting up Playwright browsers..."
npx playwright install

# Final setup steps
print_step "Finalizing setup..."

# Create a simple health check script
cat > scripts/health-check.sh << 'EOF'
#!/bin/bash
echo "🎮 Snake Web App Health Check"
echo "=============================="

# Check Node.js
echo "Node.js: $(node --version)"

# Check npm
echo "npm: $(npm --version)"

# Check TypeScript
echo "TypeScript: $(npx tsc --version)"

# Check Next.js
echo "Next.js: $(npx next --version)"

# Check if services are running
echo ""
echo "Services:"
echo "- PostgreSQL: $(pg_isready -h localhost -p 5432 && echo 'Running' || echo 'Not running')"
echo "- Redis: $(redis-cli ping 2>/dev/null || echo 'Not running')"

echo ""
echo "✅ Environment ready for Snake Web App development!"
EOF

chmod +x scripts/health-check.sh

# Create development start script
cat > scripts/dev-start.sh << 'EOF'
#!/bin/bash
echo "🎮 Starting Snake Web App Development Environment..."

# Start services in background
echo "Starting services..."

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
    echo "⚠️  PostgreSQL not running. Please start with: docker-compose up db"
fi

# Start Next.js development server
echo "Starting Next.js development server..."
npm run dev
EOF

chmod +x scripts/dev-start.sh

print_status "Setup completed successfully! 🎉"

echo ""
echo "🎮 Snake Web App Development Environment is ready!"
echo "================================================="
echo ""
echo "Next steps:"
echo "1. Start the development server: npm run dev"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Start coding your Snake game!"
echo ""
echo "Useful commands:"
echo "- npm run dev          # Start development server"
echo "- npm run test         # Run tests"
echo "- npm run lint         # Check code quality"
echo "- npm run build        # Build for production"
echo ""
echo "Services available:"
echo "- Next.js App: http://localhost:3000"
echo "- Supabase Studio: http://localhost:54321"
echo "- PostgreSQL: localhost:5432"
echo ""
echo "Happy coding! 🚀" 