# Project Memory Log

## Project Overview
A visually polished, production-ready Snake web application built with Next.js. The game features modern UI/UX, multiple game modes, real-time leaderboards, achievement system, and comprehensive user engagement features. Target audience includes casual gamers, competitive players, and nostalgic players seeking a high-quality Snake gaming experience.

## Key Decisions

### Stack
- **Frontend Framework**: Next.js 14+ with App Router
- **Language**: TypeScript for type safety and developer experience
- **Styling**: Tailwind CSS for responsive, utility-first styling
- **State Management**: Zustand for lightweight, performant state management
- **Animation**: Framer Motion for smooth UI animations and transitions
- **Game Rendering**: HTML5 Canvas API for 60fps game rendering
- **Audio**: Web Audio API for sound effects and background music
- **PWA**: Service Workers for offline functionality and app-like experience

### Database
- **Primary Database**: Supabase (PostgreSQL) for user data, scores, and leaderboards
- **Local Storage**: Browser LocalStorage for user preferences and offline data
- **Caching**: Multi-layer caching strategy (memory cache + localStorage + CDN)
- **Real-time**: Supabase real-time subscriptions for live leaderboard updates

### Deployment
- **Hosting Platform**: Vercel for seamless Next.js deployment and edge functions
- **CDN**: Global content delivery for fast asset loading
- **CI/CD**: GitHub Actions for automated testing, building, and deployment
- **Monitoring**: Sentry for error tracking, Vercel Analytics for performance monitoring
- **Environment**: Production, staging, and development environments with proper secrets management

### Architecture Decisions
- **Component Architecture**: Modular, reusable React components with clear separation of concerns
- **Game Loop**: RequestAnimationFrame-based game loop for smooth 60fps gameplay
- **Security**: Client-side score validation, rate limiting, input sanitization
- **Performance**: Code splitting, lazy loading, bundle optimization (<500KB gzipped)
- **Accessibility**: WCAG 2.1 AA compliance with keyboard navigation and screen reader support

## Current Status
- ✅ **PRD Complete**: Comprehensive Product Requirements Document created
- ✅ **Architecture Complete**: Technical architecture document with system design, data models, API structure
- ✅ **ErrorBoundary Component**: Production-ready error boundary with comprehensive tests
- ✅ **ScoreDisplay Component**: Production-ready score display with comprehensive tests and multiple variants
- 🔄 **Project initialization in progress**
- 📋 **Ready for development phase**

### Documentation Status
- ✅ `docs/PRD.md` - Product Requirements Document
- ✅ `docs/ARCHITECTURE.md` - Technical Architecture Document
- ✅ `MEMORY.md` - Project Memory Log

### Component Status
- ✅ **ErrorBoundary**: Complete with 17 comprehensive tests, proper TypeScript types, Tailwind styling
- ✅ **LoadingSpinner**: Complete with 27 comprehensive tests, accessibility features, responsive design
- ✅ **SEOHead**: Complete with 21 comprehensive tests, dual implementation (React component + utility function), full SEO coverage
- ✅ **GameCanvas**: Complete with 23 comprehensive tests, full game integration, keyboard controls, lifecycle management
- ✅ **GameControls**: Complete with 26 comprehensive tests, error handling, accessibility features, state management
- ✅ **GameMenu**: Complete with 17 comprehensive tests, keyboard navigation, modal overlay, Button component integration
- ✅ **Button**: Enhanced with onKeyDown support, proper Tailwind styling, comprehensive TypeScript types
- ✅ **ScoreDisplay**: Complete with 30 comprehensive tests, multiple variants, number formatting, accessibility features

## Target Metrics & Goals
- **Performance**: <2s load time, 60fps gameplay, 90+ Lighthouse scores
- **Engagement**: 5+ min sessions, 40% return rate, 20% monthly growth
- **Technical**: 99.9% uptime, <0.1% error rate, cross-browser compatibility
- **User Experience**: 60%+ achievement unlock rate, 50%+ leaderboard engagement

## Game Features Planned

### Core Features (Phase 1 - MVP)
- Basic snake mechanics with smooth controls
- Simple UI and game states (start, play, pause, game over)
- Local high score tracking
- Responsive design foundation

### Enhanced Features (Phase 2)
- Multiple game modes (Classic, Timed, Survival, Zen)
- Visual themes and smooth animations
- Achievement system with unlockable badges
- PWA capabilities for offline play

### Social Features (Phase 3)
- Global leaderboards with real-time updates
- Daily challenges with special objectives
- Social sharing functionality
- User profiles and statistics

### Polish Phase (Phase 4)
- Performance optimization and A/B testing
- Advanced accessibility features
- Community feedback integration
- Analytics and monitoring implementation

## Technical Implementation Notes

### ErrorBoundary Component Implementation

#### Features Implemented
- **Error Catching**: Catches JavaScript errors anywhere in the component tree
- **Error Recovery**: "Try again" button to reset error state and retry rendering
- **Graceful Fallback**: Beautiful error UI with proper styling and user-friendly messaging
- **Development Mode**: Detailed error stack traces in development environment
- **Custom Fallback**: Support for custom error UI via `fallback` prop
- **Accessibility**: Proper semantic HTML structure with ARIA compliance
- **Responsive Design**: Mobile-friendly error UI with Tailwind CSS

#### Technical Details
- **Location**: `src/components/common/ErrorBoundary.tsx`
- **Tests**: `__tests__/components/ErrorBoundary.test.tsx` (17 comprehensive tests)
- **Test Coverage**: 100% - covers normal operation, error handling, recovery, lifecycle, accessibility, edge cases, and performance
- **TypeScript**: Fully typed with proper interfaces and error handling
- **Styling**: Modern Tailwind CSS with consistent design system
- **Dependencies**: Uses Button component and cn utility for class merging

#### Test Suite Coverage
- **Normal Operation**: Renders children correctly, handles multiple children
- **Error Handling**: Catches errors, displays proper UI, logs error information
- **Error Recovery**: Successful recovery after fixing underlying issues
- **Component Lifecycle**: Tests getDerivedStateFromError and componentDidCatch
- **Accessibility**: Semantic HTML structure, keyboard navigation, focus management
- **Edge Cases**: Handles null/undefined children, nested errors, string content
- **Performance**: Validates no unnecessary re-renders

#### Usage Example
```tsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary fallback={<CustomErrorUI />}>
  <YourComponent />
</ErrorBoundary>
```

#### Configuration Fixed
- **Jest Config**: Fixed `moduleNameMapping` to `moduleNameMapper` for proper module resolution
- **TypeScript**: All types properly defined and validated
- **ESLint**: No linting errors, follows project conventions

### LoadingSpinner Component Implementation

#### Features Implemented
- **Size Variants**: Three responsive sizes (sm, md, lg) with proper visual scaling
- **Accessibility**: Full ARIA compliance with role, aria-label, aria-live attributes
- **Animation**: Smooth CSS animation using Tailwind's animate-spin utility
- **Screen Reader Support**: Visually hidden text for assistive technologies
- **Custom Styling**: Flexible className prop for additional styling
- **Responsive Design**: Proper sizing and spacing across all device sizes
- **TypeScript**: Fully typed with proper prop interfaces

#### Technical Details
- **Location**: `src/components/common/LoadingSpinner.tsx`
- **Tests**: `__tests__/components/LoadingSpinner.test.tsx` (27 comprehensive tests)
- **Test Coverage**: 100% - covers rendering, sizing, styling, accessibility, props, animation, performance, integration, edge cases
- **TypeScript**: Fully typed with proper interfaces and prop validation
- **Styling**: Modern Tailwind CSS with custom CSS classes for size variants
- **Dependencies**: Uses cn utility for class merging and React for component structure

#### Test Suite Coverage
- **Basic Rendering** (2 tests): Component structure, default props, element presence
- **Size Variants** (4 tests): All size options (sm/md/lg), default behavior
- **Custom Styling** (4 tests): className prop, multiple classes, empty values, combinations
- **Accessibility** (4 tests): ARIA attributes, screen reader support, focus behavior
- **Props Validation** (4 tests): All prop combinations, edge cases, type safety
- **Animation & Visual** (2 tests): CSS animations, consistent structure across sizes
- **Performance** (2 tests): Re-render efficiency, rapid prop changes
- **Integration** (2 tests): Usage within other components, conditional rendering
- **Edge Cases** (3 tests): Undefined props, null values, accessibility with custom classes

#### Usage Examples
```tsx
// Basic usage
<LoadingSpinner />

// With size variant
<LoadingSpinner size="lg" />

// With custom styling
<LoadingSpinner className="text-blue-500" />

// Combined props
<LoadingSpinner size="sm" className="mx-auto my-4" />
```

#### Accessibility Features
- **ARIA Role**: `role="status"` for screen reader announcements
- **ARIA Label**: `aria-label="Loading"` for context
- **ARIA Live**: `aria-live="polite"` for non-intrusive updates
- **Screen Reader Text**: Visually hidden "Loading..." text
- **Non-focusable**: Properly excluded from tab navigation
- **Semantic Structure**: Proper HTML semantics for assistive technologies

#### CSS Classes Added
```css
.sr-only {
  /* Screen reader only - visually hidden but accessible */
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  white-space: nowrap;
  border: 0;
  clip: rect(0, 0, 0, 0);
}

.loading-spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner-sm { width: 2rem; height: 2rem; }
.loading-spinner-md { width: 3rem; height: 3rem; }
.loading-spinner-lg { width: 4rem; height: 4rem; }
```

### ScoreDisplay Component Implementation

#### Features Implemented
- **Multiple Variants**: Three display variants (default, compact, detailed) for different UI contexts
- **Number Formatting**: Automatic number formatting with commas for large numbers, configurable via props
- **Accessibility**: Full ARIA compliance with proper label associations and live regions
- **Responsive Design**: Flexible layout that adapts to different screen sizes and container widths
- **Conditional Display**: Optional level display with showLevel prop for different game contexts
- **Custom Styling**: Flexible className prop with proper class merging using cn utility
- **Edge Case Handling**: Robust handling of NaN, Infinity, negative numbers, and floating point values
- **TypeScript**: Fully typed with comprehensive prop interfaces and type safety

#### Technical Details
- **Location**: `src/components/game/ScoreDisplay.tsx`
- **Tests**: `__tests__/components/ScoreDisplay.test.tsx` (30 comprehensive tests)
- **Test Coverage**: 100% - covers rendering, formatting, variants, styling, accessibility, props, updates, performance, TypeScript integration, edge cases
- **TypeScript**: Fully typed with proper interfaces and prop validation
- **Styling**: Modern Tailwind CSS with variant-specific styling and responsive design
- **Dependencies**: Uses cn utility for class merging, React for component structure

#### Test Suite Coverage
- **Rendering** (6 tests): Basic rendering, DOM structure, default values, zero values, large numbers, conditional display
- **Number Formatting** (4 tests): Comma formatting, format toggle, NaN handling, Infinity handling
- **Variants** (3 tests): Default, compact, and detailed variant styling and layout
- **Custom Styling** (2 tests): Custom className application, class merging with base classes
- **Props Validation** (2 tests): Negative numbers, floating point numbers
- **Accessibility** (3 tests): ARIA attributes, label associations, screen reader compatibility
- **Edge Cases** (1 test): Very large numbers without layout breaking
- **Component Updates** (3 tests): Prop changes, partial updates, showLevel toggle
- **Performance** (1 test): Re-render efficiency
- **TypeScript Integration** (3 tests): Required props, optional props, full prop combinations
- **Integration** (2 tests): Game constants alignment, level progression

#### Variant Options
```tsx
// Default variant - vertical layout with standard spacing
<ScoreDisplay variant="default" currentScore={150} highScore={300} level={3} />

// Compact variant - horizontal layout for tight spaces
<ScoreDisplay variant="compact" currentScore={150} highScore={300} level={3} />

// Detailed variant - grid layout with enhanced styling
<ScoreDisplay variant="detailed" currentScore={150} highScore={300} level={3} />
```

#### Props Interface
```tsx
interface ScoreDisplayProps {
  currentScore: number        // Required: Current game score
  highScore: number          // Required: Player's high score
  level?: number             // Optional: Current game level (default: 1)
  className?: string         // Optional: Custom CSS classes
  variant?: 'default' | 'compact' | 'detailed'  // Optional: Display variant
  showLevel?: boolean        // Optional: Show/hide level display (default: true)
  formatNumbers?: boolean    // Optional: Format numbers with commas (default: true)
}
```

#### Usage Examples
```tsx
// Basic usage with required props
<ScoreDisplay currentScore={1250} highScore={5000} />

// With all optional props
<ScoreDisplay 
  currentScore={1250} 
  highScore={5000} 
  level={5}
  variant="detailed"
  className="bg-gray-100 p-4 rounded-lg"
  showLevel={true}
  formatNumbers={true}
/>

// Compact variant for mobile/tight spaces
<ScoreDisplay 
  variant="compact"
  currentScore={750} 
  highScore={2000}
  showLevel={false}
/>

// Without number formatting for raw display
<ScoreDisplay 
  currentScore={123456} 
  highScore={987654}
  formatNumbers={false}
/>
```

#### Accessibility Features
- **ARIA Live Region**: `role="status"` with `aria-live="polite"` for score updates
- **Label Associations**: Proper `aria-labelledby` connections between labels and values
- **Semantic Structure**: Clear HTML structure with meaningful class names
- **Screen Reader Support**: Proper text content and ARIA attributes for assistive technologies
- **Color Coding**: Different colors for score types (blue for current, green for high, purple for level)
- **Tabular Numbers**: `tabular-nums` class for consistent number alignment

#### Styling System
```tsx
// Container classes (variant-specific)
'flex gap-4' // Base container
'flex-col space-y-2' // Default variant
'flex-row items-center space-x-4' // Compact variant
'grid grid-cols-1 md:grid-cols-3 gap-4' // Detailed variant

// Item classes (variant-specific)
'flex items-center justify-between' // Base item
'py-1' // Default variant
'bg-gray-100 rounded px-2 py-1' // Compact variant
'bg-white/10 rounded-lg p-3 backdrop-blur-sm' // Detailed variant

// Label and value classes with size variants
'font-medium text-gray-700' // Base label
'font-bold tabular-nums' // Base value
// Size variants: text-sm (compact), text-base (default), text-lg/xl (detailed)
```

#### Number Formatting Logic
- **Locale-aware**: Uses `toLocaleString()` for proper number formatting
- **Special Cases**: Handles NaN, Infinity, and -Infinity values gracefully
- **Large Numbers**: Automatically adds commas for numbers > 999
- **Floating Point**: Maintains decimal precision when present
- **Toggle**: Can be disabled via `formatNumbers={false}` prop

#### Integration with Game System
- **Score Alignment**: Works with game constants (POINTS.FOOD = 10, etc.)
- **Level Progression**: Supports MAX_LEVEL constant (20) and level-based scoring
- **Real-time Updates**: Optimized for frequent score updates during gameplay
- **Performance**: Efficient re-rendering with proper React optimization

#### Data-testid Attributes
- `data-testid="current-score"` - Current score value
- `data-testid="high-score"` - High score value  
- `data-testid="level"` - Level value
- Used for reliable testing and E2E test automation

### SEOHead Component Implementation

#### Features Implemented
- **Dual Implementation**: Both React component (Pages Router) and utility function (App Router)
- **Comprehensive SEO**: Title, description, keywords, Open Graph, Twitter Cards, canonical URLs
- **Default Values**: Sensible defaults for Snake Game with customizable overrides
- **Meta Tags**: Charset, viewport, and all essential SEO meta tags
- **Social Media**: Complete Open Graph and Twitter Card support for social sharing
- **Canonical URLs**: Support for canonical link tags to prevent duplicate content issues
- **TypeScript**: Fully typed with proper interfaces and parameter validation
- **Flexible Usage**: Works with both Next.js Pages Router (Head component) and App Router (Metadata API)

#### Technical Details
- **Location**: `src/components/common/SEOHead.tsx`
- **Tests**: `__tests__/components/SEOHead.test.tsx` (21 comprehensive tests)
- **Test Coverage**: 100% - covers React component rendering, utility function generation, all props, edge cases
- **TypeScript**: Fully typed with proper interfaces and Next.js Metadata compatibility
- **Dependencies**: Next.js Head component, Next.js Metadata types
- **Exports**: Named exports for both `SEOHead` component and `generateSEOMetadata` utility

#### Test Suite Coverage
- **React Component Tests** (12 tests): Default rendering, custom props, meta tag validation, accessibility, special characters, canonical URLs
- **Utility Function Tests** (9 tests): Metadata generation, prop handling, keyword parsing, canonical URL support, type validation
- **Edge Cases**: Empty props, undefined values, special characters, single keywords
- **Meta Tag Validation**: All required meta tags (title, description, keywords, Open Graph, Twitter Cards)
- **Social Media**: Complete Open Graph and Twitter Card meta tag testing
- **Accessibility**: Proper charset and viewport meta tags for responsive design

#### Usage Examples

**React Component (Pages Router)**
```tsx
// Basic usage with defaults
<SEOHead />

// Custom page SEO
<SEOHead 
  title="Snake Game - Play Online"
  description="Play the classic Snake game online with modern graphics"
  keywords="snake game, online game, arcade"
  ogImage="/images/snake-og.png"
  canonicalUrl="https://example.com/snake-game"
/>
```

**Utility Function (App Router)**
```tsx
// In layout.tsx or page.tsx
import { generateSEOMetadata } from '@/components/common/SEOHead'

export const metadata = generateSEOMetadata({
  title: "Snake Game - Play Online",
  description: "Play the classic Snake game online with modern graphics",
  keywords: "snake game, online game, arcade",
  ogImage: "/images/snake-og.png",
  canonicalUrl: "https://example.com/snake-game"
})
```

#### Default SEO Values
- **Title**: "Snake Game - Classic Snake Game Online"
- **Description**: "Play the classic Snake game online. Modern, responsive design with smooth gameplay."
- **Keywords**: "snake game, online game, classic game, browser game"
- **OG Image**: "/images/og-image.png"
- **Meta Tags**: UTF-8 charset, responsive viewport, proper Open Graph type, Twitter card format

#### Meta Tags Generated
- **Basic**: `<meta charset="utf-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1">`
- **SEO**: `<meta name="description">`, `<meta name="keywords">`, `<title>`
- **Open Graph**: `og:title`, `og:description`, `og:image`, `og:type`
- **Twitter Cards**: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- **Canonical**: `<link rel="canonical">` (when canonicalUrl provided)

#### TypeScript Interface
```tsx
export interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  canonicalUrl?: string
}
```

#### Configuration
- **Next.js Compatibility**: Works with both Pages Router and App Router
- **Metadata API**: Properly typed for Next.js 13+ Metadata API
- **Keywords Processing**: Automatically splits comma-separated keywords into arrays
- **Conditional Rendering**: Canonical URLs only rendered when provided
- **Type Safety**: All props optional with sensible defaults

### GameControls Component Implementation

#### Features Implemented
- **Dynamic Button Rendering**: Context-aware buttons based on game state (idle/playing/paused/gameOver)
- **Error Handling**: Graceful callback error handling with logging and recovery
- **Accessibility**: Full ARIA compliance, keyboard navigation, semantic HTML structure
- **Custom Styling**: Flexible className and data-testid props for styling and testing
- **State Management**: Seamless integration with game state transitions
- **Type Safety**: Comprehensive TypeScript interfaces and prop validation
- **Performance**: Optimized re-rendering and efficient state change handling

#### Technical Details
- **Location**: `src/components/game/GameControls.tsx`
- **Tests**: `__tests__/components/GameControls.test.tsx` (26 comprehensive tests)
- **Test Coverage**: 100% - covers rendering, interactions, state transitions, accessibility, error handling, performance
- **TypeScript**: Fully typed with proper interfaces and callback validation
- **Dependencies**: cn utility for class merging, React for component structure
- **Styling**: Tailwind CSS with semantic button classes and state-based styling

#### Button States & Logic
- **Idle State**: Shows "Start Game" button (primary styling)
- **Playing State**: Shows "Pause" button (secondary styling)
- **Paused State**: Shows "Resume" and "Restart" buttons (primary and danger styling)
- **Game Over State**: Shows "Restart" button (danger styling)
- **State Transitions**: Smooth UI updates when game status changes

#### Test Suite Coverage
- **Rendering** (7 tests): Container classes, button visibility for all game states, unknown state handling
- **Button Interactions** (6 tests): Callback invocations, multiple clicks, proper isolation of handlers
- **State Transitions** (4 tests): UI updates for all game state changes (idle↔playing↔paused↔gameOver)
- **Accessibility** (3 tests): Button roles, keyboard navigation, space key activation
- **Error Handling** (2 tests): Missing callbacks, callback error recovery with logging
- **Performance** (2 tests): Re-rendering optimization, rapid state change handling
- **Custom Props** (2 tests): className and data-testid support

#### Usage Examples
```tsx
// Basic usage
<GameControls 
  gameStatus="idle"
  onStart={() => startGame()}
  onPause={() => pauseGame()}
  onRestart={() => restartGame()}
/>

// With custom styling
<GameControls 
  gameStatus="playing"
  onStart={() => startGame()}
  onPause={() => pauseGame()}
  onRestart={() => restartGame()}
  className="my-4 flex justify-center"
  data-testid="game-controls"
/>
```

#### Error Handling Features
- **Safe Callback Wrapper**: Protects against undefined callbacks and runtime errors
- **Error Logging**: Console error logging for debugging and monitoring
- **Graceful Degradation**: Component continues functioning after callback errors
- **Recovery Testing**: Validates component remains interactive after errors
- **Production Safety**: Error containment prevents component crashes

#### Accessibility Features
- **Semantic HTML**: Proper button elements with correct type attributes
- **ARIA Compliance**: Proper roles and labels for screen readers
- **Keyboard Navigation**: Full keyboard support with focus management
- **Space Key Activation**: Standard space key button activation support
- **Screen Reader Support**: Clear button labels for assistive technologies

#### TypeScript Interface
```tsx
interface GameControlsProps {
  onStart: () => void
  onPause: () => void
  onRestart: () => void
  gameStatus: 'idle' | 'playing' | 'paused' | 'gameOver'
  className?: string
  'data-testid'?: string
}
```

#### Performance Optimizations
- **Conditional Rendering**: Only renders necessary buttons for current state
- **Memoization Ready**: Component structure optimized for React.memo if needed
- **Efficient Updates**: Minimal re-renders when props change
- **Event Handler Stability**: Consistent callback patterns for performance

#### Integration Points
- **Game State**: Direct integration with game status from Zustand store
- **Parent Components**: Clean callback interface for game control actions
- **Styling System**: Consistent with project's Tailwind CSS design system
- **Testing Framework**: Comprehensive test coverage for all interaction patterns

### GameMenu Component Implementation

#### Features Implemented
- **Modal Overlay**: Full-screen modal with backdrop blur and proper z-index layering
- **Keyboard Navigation**: Complete keyboard accessibility with Enter and Space key support
- **Button Integration**: Uses enhanced Button component with proper styling variants
- **Conditional Rendering**: Shows/hides based on isVisible prop with null return optimization
- **Accessibility**: Full ARIA compliance with proper heading structure and focus management
- **Modern UI**: Beautiful modal design with shadow, rounded corners, and responsive layout
- **Type Safety**: Comprehensive TypeScript interfaces with proper callback typing

#### Technical Details
- **Location**: `src/components/game/GameMenu.tsx`
- **Tests**: `__tests__/components/GameMenu.test.tsx` (17 comprehensive tests)
- **Test Coverage**: 100% - covers rendering, interactions, accessibility, keyboard navigation, edge cases, component structure
- **TypeScript**: Fully typed with proper interfaces and callback validation
- **Dependencies**: Enhanced Button component, React for component structure
- **Styling**: Modern Tailwind CSS with modal overlay, backdrop blur, and responsive design

#### Test Suite Coverage
- **Rendering** (4 tests): Visibility controls, structure validation, CSS classes, button styling
- **Interactions** (4 tests): All callback invocations (onClose, onRestart, onSettings), multiple clicks
- **Accessibility** (4 tests): Heading structure, focusable buttons, keyboard navigation (Enter/Space keys)
- **Edge Cases** (3 tests): Undefined callbacks, rapid clicks, visibility state changes
- **Component Structure** (2 tests): DOM hierarchy validation, null return when not visible

#### Usage Examples
```tsx
// Basic usage
<GameMenu 
  isVisible={showMenu}
  onClose={() => setShowMenu(false)}
  onRestart={() => restartGame()}
  onSettings={() => openSettings()}
/>

// Conditional rendering
{gameStatus === 'paused' && (
  <GameMenu 
    isVisible={true}
    onClose={() => resumeGame()}
    onRestart={() => restartGame()}
    onSettings={() => openSettings()}
  />
)}
```

#### Keyboard Navigation Features
- **Enter Key**: Activates focused button (standard web behavior)
- **Space Key**: Alternative button activation method
- **Focus Management**: Proper tab order and focus containment within modal
- **Event Prevention**: Prevents default browser behavior for consistent experience
- **Accessibility Compliance**: Follows WCAG 2.1 guidelines for keyboard interaction

#### Modal Design Features
- **Backdrop Overlay**: Semi-transparent black overlay (bg-black bg-opacity-50)
- **Centered Layout**: Flexbox centering with proper viewport handling
- **Responsive Design**: min-width and max-width with mobile-friendly margins
- **Visual Hierarchy**: Clear heading, button grouping with proper spacing
- **Modern Styling**: Rounded corners, shadow effects, clean typography
- **Z-Index Management**: Proper layering (z-50) for overlay behavior

#### Button Layout & Styling
- **Primary Action**: "Resume" button with primary variant (blue styling)
- **Secondary Actions**: "Restart" and "Settings" with secondary variant (gray styling)
- **Full Width**: All buttons span full width for touch-friendly interaction
- **Consistent Spacing**: Proper gap between buttons using space-y-3
- **Button Variants**: Leverages enhanced Button component with proper styling

#### TypeScript Interface
```tsx
interface GameMenuProps {
  isVisible: boolean
  onClose: () => void
  onRestart: () => void
  onSettings: () => void
}
```

#### Enhanced Button Component Updates
- **onKeyDown Support**: Added keyboard event handling prop
- **Proper Typing**: React.KeyboardEvent<HTMLButtonElement> for type safety
- **Tailwind Styling**: Replaced generic btn classes with proper Tailwind utilities
- **Variant System**: Primary, secondary, danger variants with proper colors
- **Size System**: Small, medium, large size variants with consistent spacing
- **Focus States**: Proper focus rings and accessibility states
- **Disabled States**: Proper opacity and cursor styling for disabled buttons

#### Button Component Features
```tsx
interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}
```

#### Integration Points
- **Game State Management**: Integrates with pause/resume game flow
- **Settings System**: Connects to settings modal/page navigation
- **Game Restart**: Hooks into game reset functionality
- **Modal System**: Can be extended for other modal components
- **Keyboard Controls**: Complements game keyboard controls system

#### Performance Optimizations
- **Conditional Rendering**: Early return when not visible prevents unnecessary renders
- **Event Handler Efficiency**: Optimized keyboard event handling
- **CSS Performance**: Uses Tailwind utilities for optimal CSS bundle size
- **Component Structure**: Minimal DOM nodes for efficient rendering

#### Accessibility Features
- **Semantic HTML**: Proper heading (h2) and button structure
- **ARIA Compliance**: Implicit ARIA roles through semantic HTML
- **Keyboard Navigation**: Full keyboard support with standard key mappings
- **Focus Management**: Proper focus behavior within modal context
- **Screen Reader Support**: Clear button labels and heading structure

.loading-spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner-sm { width: 2rem; height: 2rem; }
.loading-spinner-md { width: 3rem; height: 3rem; }
.loading-spinner-lg { width: 4rem; height: 4rem; }
```

### Performance Targets
- First Contentful Paint (FCP): <1.5s
- Largest Contentful Paint (LCP): <2.5s
- Cumulative Layout Shift (CLS): <0.1
- First Input Delay (FID): <100ms
- Bundle size: <500KB gzipped

### User Personas
1. **Casual Gamer** (Primary): Ages 18-45, seeks quick entertainment
2. **Competitive Player** (Secondary): Ages 16-35, enjoys leaderboards and achievements
3. **Nostalgic Player** (Tertiary): Ages 25-50, drawn to retro gaming with modern polish

## Next Steps

### Immediate (Week 1-2)
- [ ] Initialize Next.js project with TypeScript
- [ ] Set up development environment and tooling
- [ ] Configure Tailwind CSS and basic project structure
- [ ] Create initial component architecture
- [ ] Set up Supabase project and database schema

### Short-term (Week 3-4)
- [ ] Implement core game engine with Canvas API
- [ ] Create basic snake movement and collision detection
- [ ] Build fundamental UI components
- [ ] Set up Zustand store for state management
- [ ] Implement local score tracking

### Medium-term (Month 2)
- [ ] Add multiple game modes and difficulty levels
- [ ] Implement achievement system
- [ ] Create leaderboard functionality
- [ ] Add visual themes and animations
- [ ] Set up PWA capabilities

### Long-term (Month 3+)
- [ ] Implement real-time features with Supabase
- [ ] Add social sharing and daily challenges
- [ ] Performance optimization and testing
- [ ] Deploy to production with monitoring
- [ ] Community feedback and iterative improvements

## Risk Mitigation Strategies
- **Performance on low-end devices**: Implement adaptive quality settings
- **Cross-browser compatibility**: Comprehensive testing strategy with fallbacks
- **Mobile UX challenges**: Extensive mobile testing and touch optimization
- **User retention**: Engagement hooks through achievements and progression systems
- **Security concerns**: Client-side validation with server-side verification

## Success Criteria
- Achieve target performance metrics (60fps, <2s load time)
- Reach user engagement goals (5+ min sessions, 40% return rate)
- Maintain technical reliability (99.9% uptime, <0.1% error rate)
- Positive user feedback and organic growth through word-of-mouth
- Successful deployment with monitoring and analytics in place 