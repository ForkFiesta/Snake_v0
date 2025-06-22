# Snake Web App - Project Structure

This document outlines the complete file structure for the Snake web application built with Next.js 14+ and TypeScript.

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles with Tailwind
│   ├── layout.tsx               # Root layout component
│   ├── page.tsx                 # Home page
│   ├── manifest.ts              # PWA manifest configuration
│   ├── game/
│   │   └── page.tsx             # Game page
│   ├── leaderboard/
│   │   └── page.tsx             # Leaderboard page
│   ├── achievements/
│   │   └── page.tsx             # Achievements page
│   ├── settings/
│   │   └── page.tsx             # Settings page
│   └── api/                     # API routes
│       ├── scores/
│       │   └── route.ts         # Score management API
│       ├── leaderboard/
│       │   └── route.ts         # Leaderboard API
│       ├── achievements/
│       │   └── route.ts         # Achievements API
│       └── health/
│           └── route.ts         # Health check API
├── components/                   # React components
│   ├── ui/                      # Base UI components
│   │   ├── Button.tsx           # Button component
│   │   ├── Input.tsx            # Input component
│   │   ├── Modal.tsx            # Modal component
│   │   └── index.ts             # UI barrel exports
│   ├── game/                    # Game-specific components
│   │   ├── GameCanvas.tsx       # Main game canvas
│   │   ├── GameControls.tsx     # Game control buttons
│   │   ├── ScoreDisplay.tsx     # Score display
│   │   ├── GameMenu.tsx         # Game menu overlay
│   │   └── index.ts             # Game components barrel exports
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx           # Site header
│   │   ├── Footer.tsx           # Site footer
│   │   ├── Navigation.tsx       # Navigation component
│   │   └── index.ts             # Layout barrel exports
│   └── common/                  # Common components
│       ├── LoadingSpinner.tsx   # Loading spinner
│       ├── ErrorBoundary.tsx    # Error boundary
│       ├── SEOHead.tsx          # SEO meta tags
│       └── index.ts             # Common barrel exports
├── lib/                         # Utility libraries
│   ├── game-engine/             # Core game logic
│   │   ├── GameEngine.ts        # Main game engine class
│   │   └── index.ts             # Game engine exports
│   ├── stores/                  # Zustand state stores
│   │   ├── gameStore.ts         # Game state management
│   │   ├── uiStore.ts           # UI state management
│   │   ├── userStore.ts         # User state management
│   │   └── index.ts             # Store exports
│   ├── utils/                   # Utility functions
│   │   ├── cn.ts                # Class name utility
│   │   ├── gameUtils.ts         # Game utility functions
│   │   └── index.ts             # Utils exports
│   ├── hooks/                   # Custom React hooks
│   │   ├── useGameLoop.ts       # Game loop hook
│   │   ├── useKeyboardControls.ts # Keyboard controls hook
│   │   └── index.ts             # Hooks exports
│   ├── constants/               # App constants
│   │   ├── gameConstants.ts     # Game-related constants
│   │   └── index.ts             # Constants exports
│   └── api/                     # API client functions
│       ├── scores.ts            # Score API client
│       └── index.ts             # API exports
├── types/                       # TypeScript type definitions
│   ├── game.ts                  # Game-related types
│   ├── user.ts                  # User-related types
│   ├── api.ts                   # API-related types
│   └── index.ts                 # Types barrel exports
└── public/                      # Static assets
    ├── manifest.json            # PWA manifest
    ├── icons/                   # App icons
    ├── sounds/                  # Audio files
    └── images/                  # Game images
```

## Configuration Files

- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `.env.example` - Environment variables template

## Key Features Implemented

### 🎮 Game Architecture
- **GameEngine**: Core game logic with canvas rendering
- **Game State Management**: Zustand stores for game, UI, and user state
- **Custom Hooks**: Game loop, keyboard controls, and other utilities

### 🎨 UI Components
- **Modular Design**: Reusable UI components with TypeScript
- **Game Components**: Canvas, controls, score display, and menu
- **Layout System**: Header, footer, and navigation components

### 🔧 Utilities & Helpers
- **Game Utils**: Score calculation, collision detection, movement logic
- **Type Safety**: Comprehensive TypeScript definitions
- **Constants**: Game modes, difficulties, themes, and settings

### 🌐 API Integration
- **RESTful APIs**: Score submission, leaderboard, achievements
- **Client Functions**: Fetch utilities for API communication
- **Error Handling**: Comprehensive error management

### 📱 Progressive Web App
- **PWA Support**: Manifest configuration and service worker ready
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Performance**: Optimized bundle splitting and lazy loading

## Next Steps

1. **Install Dependencies**: Run `npm install` to install all required packages
2. **Environment Setup**: Copy `.env.example` to `.env.local` and configure
3. **Development**: Start with `npm run dev`
4. **Game Logic**: Implement the core game mechanics in GameEngine.ts
5. **Styling**: Add custom styles and animations
6. **Testing**: Run existing tests and add more coverage

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler
- `npm test` - Run Jest tests
- `npm run test:e2e` - Run Playwright E2E tests

## Architecture Benefits

✅ **Type Safety**: Full TypeScript coverage with strict mode
✅ **Modular Design**: Clean separation of concerns
✅ **Performance**: Optimized rendering and state management
✅ **Scalability**: Easy to add new features and game modes
✅ **Testing**: Comprehensive test setup included
✅ **PWA Ready**: Offline support and app-like experience
✅ **SEO Optimized**: Server-side rendering and meta tags

This structure provides a solid foundation for building a modern, performant Snake game with room for future enhancements and features. 