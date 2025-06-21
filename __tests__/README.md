# Testing Documentation

This document provides comprehensive information about the testing setup for the Snake Web App.

## Table of Contents

- [Overview](#overview)
- [Test Types](#test-types)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [CI/CD Pipeline](#cicd-pipeline)
- [Coverage Reports](#coverage-reports)
- [Troubleshooting](#troubleshooting)

## Overview

Our testing strategy follows a comprehensive approach with multiple layers:

- **Unit Tests**: Test individual functions and components in isolation
- **Integration Tests**: Test API routes and component interactions
- **End-to-End Tests**: Test complete user workflows across browsers
- **Performance Tests**: Validate load times and Core Web Vitals
- **Accessibility Tests**: Ensure WCAG compliance and keyboard navigation

## Test Types

### Unit Tests (`__tests__/lib/`, `__tests__/components/`)

**Purpose**: Test individual functions, utilities, and React components in isolation.

**Tools**: Jest + React Testing Library

**Examples**:
```bash
# Run all unit tests
npm run test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test file
npm test -- gameUtils.test.ts
```

**File Structure**:
```
__tests__/
├── lib/
│   ├── utils/
│   │   └── gameUtils.test.ts
│   ├── hooks/
│   │   └── useGameLoop.test.ts
│   └── stores/
│       └── gameStore.test.ts
└── components/
    ├── Button.test.tsx
    ├── GameCanvas.test.tsx
    └── ScoreDisplay.test.tsx
```

### Integration Tests (`__tests__/api/`)

**Purpose**: Test API routes, database operations, and service integrations.

**Tools**: Jest + Next.js testing utilities

**Examples**:
```bash
# Run integration tests
npm test -- --testPathPattern=api

# Test specific API route
npm test -- scores.test.ts
```

### End-to-End Tests (`__tests__/e2e/`)

**Purpose**: Test complete user workflows across different browsers and devices.

**Tools**: Playwright

**Examples**:
```bash
# Run all E2E tests
npm run test:e2e

# Run on specific browser
npx playwright test --project=chromium

# Run on mobile devices
npx playwright test --project="Mobile Chrome"

# Run with UI mode
npx playwright test --ui

# Debug mode
npx playwright test --debug
```

**Test Categories**:
- Game flow (start, play, pause, game over)
- User interactions (keyboard, touch, mouse)
- Settings and preferences
- Performance and responsiveness
- Accessibility compliance

### Performance Tests

**Purpose**: Validate Core Web Vitals and performance metrics.

**Tools**: Lighthouse CI

**Examples**:
```bash
# Run Lighthouse locally
npm install -g @lhci/cli
lhci autorun

# Run performance tests in CI
# (Automatically runs on push/PR)
```

**Metrics Tracked**:
- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.5s
- Cumulative Layout Shift (CLS) < 0.1
- Total Blocking Time (TBT) < 200ms
- Bundle size < 500KB gzipped

## Running Tests

### Local Development

```bash
# Install dependencies
npm ci

# Run all test types
npm run test:all

# Run specific test suites
npm run test              # Unit tests only
npm run test:e2e          # E2E tests only
npm run test:coverage     # Unit tests with coverage

# Continuous testing during development
npm run test:watch        # Jest watch mode
npx playwright test --ui  # Playwright UI mode
```

### Environment Setup

```bash
# Set up test environment variables
cp .env.example .env.test.local

# Install Playwright browsers
npx playwright install

# Verify setup
npm run test:setup
```

## Writing Tests

### Unit Test Guidelines

```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Button } from '@/components/ui/Button'

describe('Button Component', () => {
  test('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('applies correct styles for variants', () => {
    render(<Button variant="primary">Primary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600')
  })
})
```

### Integration Test Guidelines

```typescript
// __tests__/api/scores.test.ts
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/scores/route'

describe('/api/scores', () => {
  test('saves valid score', async () => {
    const request = new NextRequest('http://localhost/api/scores', {
      method: 'POST',
      body: JSON.stringify({
        score: 100,
        gameMode: 'classic',
        difficulty: 'medium'
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
  })
})
```

### E2E Test Guidelines

```typescript
// __tests__/e2e/game-flow.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Game Flow', () => {
  test('completes full game session', async ({ page }) => {
    await page.goto('/')
    
    // Start game
    await page.click('[data-testid="start-game-button"]')
    await expect(page.locator('[data-testid="game-canvas"]')).toBeVisible()
    
    // Play game
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowDown')
    
    // Verify game state
    await expect(page.locator('[data-testid="current-score"]')).toBeVisible()
  })
})
```

### Best Practices

#### Unit Tests
- Test one thing at a time
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies
- Test edge cases and error conditions

#### Integration Tests
- Test real API endpoints
- Use test databases when possible
- Clean up after tests
- Test authentication and authorization
- Validate request/response formats

#### E2E Tests
- Use data-testid attributes for reliable selectors
- Test critical user journeys
- Handle async operations properly
- Test across different browsers and devices
- Keep tests independent and isolated

## CI/CD Pipeline

### GitHub Actions Workflow

Our CI/CD pipeline runs comprehensive tests on every push and pull request:

```yaml
# .github/workflows/test.yml
- Lint & Type Check
- Unit & Integration Tests
- Build Test
- E2E Tests (Chrome, Firefox, Safari)
- Mobile E2E Tests
- Performance Tests
- Security Tests
```

### Test Stages

1. **Pre-flight Checks**
   - ESLint validation
   - TypeScript type checking
   - Code formatting verification

2. **Unit Testing**
   - Jest test execution
   - Coverage report generation
   - Coverage threshold validation (80%)

3. **Build Verification**
   - Next.js build process
   - Bundle size analysis
   - Asset optimization check

4. **E2E Testing**
   - Cross-browser testing (Chrome, Firefox, Safari)
   - Mobile device testing
   - Accessibility validation

5. **Performance Testing**
   - Lighthouse CI execution
   - Core Web Vitals validation
   - Bundle size monitoring

6. **Security Testing**
   - npm audit for vulnerabilities
   - CodeQL security analysis

### Pipeline Configuration

```bash
# Environment variables for CI
NODE_VERSION: '18'
PLAYWRIGHT_BROWSERS_PATH: '0'
CI: true

# Test timeouts
JEST_TIMEOUT: 30000
PLAYWRIGHT_TIMEOUT: 30000
```

## Coverage Reports

### Viewing Coverage

```bash
# Generate coverage report
npm run test:coverage

# Open HTML report
open coverage/lcov-report/index.html

# View summary in terminal
npm run test:coverage -- --verbose
```

### Coverage Thresholds

```javascript
// jest.config.js
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
}
```

### Coverage Exclusions

Files excluded from coverage:
- Type definitions (`*.d.ts`)
- Configuration files
- Test files themselves
- Storybook stories
- Build artifacts

## Troubleshooting

### Common Issues

#### Jest Tests Failing

```bash
# Clear Jest cache
npm test -- --clearCache

# Run with verbose output
npm test -- --verbose

# Debug specific test
npm test -- --testNamePattern="specific test name"
```

#### Playwright Tests Failing

```bash
# Update browsers
npx playwright install

# Run with debug mode
npx playwright test --debug

# Generate test traces
npx playwright test --trace on

# View test report
npx playwright show-report
```

#### Performance Tests Failing

```bash
# Check Lighthouse configuration
cat lighthouserc.js

# Run Lighthouse manually
npm install -g lighthouse
lighthouse http://localhost:3000 --view

# Debug build size
npm run analyze
```

### Environment Issues

#### Node.js Version Mismatch
```bash
# Check Node version
node --version

# Use correct version
nvm use 18
# or
nvm install 18
```

#### Missing Dependencies
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Install Playwright browsers
npx playwright install --with-deps
```

#### Test Database Issues
```bash
# Reset test database
npm run db:reset:test

# Run migrations
npm run db:migrate:test
```

### Getting Help

1. **Check the logs**: Most issues are revealed in test output
2. **Review the documentation**: This file and tool-specific docs
3. **Run tests in isolation**: Identify which specific test is failing
4. **Check environment**: Ensure all dependencies are installed
5. **Ask for help**: Create an issue with detailed error information

## Test Data Management

### Test Fixtures

```typescript
// __tests__/fixtures/gameData.ts
export const mockGameState = {
  gameStatus: 'idle' as const,
  score: 0,
  highScore: 100,
  snake: [{ x: 10, y: 10 }],
  food: { x: 15, y: 15 },
  // ... other properties
}

export const mockUserData = {
  id: 'test-user-123',
  username: 'testuser',
  preferences: {
    theme: 'classic',
    soundEnabled: false
  }
}
```

### Mock Data

```typescript
// __tests__/__mocks__/api.ts
export const mockApiResponses = {
  scores: {
    success: { success: true, sessionId: 'mock-id' },
    error: { error: 'Invalid score' }
  },
  leaderboard: {
    data: [
      { id: '1', score: 150, username: 'player1' },
      { id: '2', score: 120, username: 'player2' }
    ]
  }
}
```

## Maintenance

### Regular Tasks

- **Weekly**: Review test coverage reports
- **Monthly**: Update test dependencies
- **Quarterly**: Review and update test strategies
- **As needed**: Add tests for new features

### Updating Dependencies

```bash
# Update Jest and testing library
npm update jest @testing-library/react @testing-library/jest-dom

# Update Playwright
npm update @playwright/test
npx playwright install

# Check for security updates
npm audit fix
```

This testing setup ensures high code quality, prevents regressions, and maintains confidence in our application's reliability across all supported environments and use cases. 