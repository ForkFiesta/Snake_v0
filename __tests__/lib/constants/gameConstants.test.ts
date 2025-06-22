import { 
  GAME_MODES, 
  DIFFICULTIES, 
  THEMES, 
  BOARD_SIZES, 
  GAME_SPEEDS, 
  POINTS, 
  POWERUP_DURATION, 
  INITIAL_SNAKE_LENGTH, 
  FOOD_SPAWN_DELAY, 
  MAX_LEVEL, 
  LEVEL_UP_THRESHOLD 
} from '@/lib/constants/gameConstants'
import { GameMode, Difficulty, Theme } from '@/types/game'

describe('gameConstants', () => {
  describe('GAME_MODES', () => {
    test('should contain all valid game modes', () => {
      expect(GAME_MODES).toEqual(['classic', 'timed', 'survival', 'zen'])
    })
    
    test('should have correct length', () => {
      expect(GAME_MODES).toHaveLength(4)
    })
    
    test('should contain only unique values', () => {
      const uniqueModes = Array.from(new Set(GAME_MODES))
      expect(uniqueModes).toHaveLength(GAME_MODES.length)
    })
    
    test('should match GameMode type definition', () => {
      const validModes: GameMode[] = ['classic', 'timed', 'survival', 'zen']
      expect(GAME_MODES).toEqual(expect.arrayContaining(validModes))
    })
    
    test('should be readonly array', () => {
      expect(() => {
        // Arrays are frozen, so this should throw
        (GAME_MODES as any).push('invalid')
      }).toThrow()
      
      expect(() => {
        // Individual elements should also be immutable
        (GAME_MODES as any)[0] = 'invalid'
      }).toThrow()
      
      expect(GAME_MODES).toHaveLength(4)
    })
  })

  describe('DIFFICULTIES', () => {
    test('should contain all valid difficulty levels', () => {
      expect(DIFFICULTIES).toEqual(['easy', 'medium', 'hard'])
    })
    
    test('should have correct length', () => {
      expect(DIFFICULTIES).toHaveLength(3)
    })
    
    test('should be ordered from easiest to hardest', () => {
      expect(DIFFICULTIES[0]).toBe('easy')
      expect(DIFFICULTIES[1]).toBe('medium')
      expect(DIFFICULTIES[2]).toBe('hard')
    })
    
    test('should match Difficulty type definition', () => {
      const validDifficulties: Difficulty[] = ['easy', 'medium', 'hard']
      expect(DIFFICULTIES).toEqual(expect.arrayContaining(validDifficulties))
    })
    
    test('should contain only unique values', () => {
      const uniqueDifficulties = Array.from(new Set(DIFFICULTIES))
      expect(uniqueDifficulties).toHaveLength(DIFFICULTIES.length)
    })
  })

  describe('THEMES', () => {
    test('should contain all valid themes', () => {
      expect(THEMES).toEqual(['classic', 'dark', 'neon', 'retro'])
    })
    
    test('should have correct length', () => {
      expect(THEMES).toHaveLength(4)
    })
    
    test('should match Theme type definition', () => {
      const validThemes: Theme[] = ['classic', 'dark', 'neon', 'retro']
      expect(THEMES).toEqual(expect.arrayContaining(validThemes))
    })
    
    test('should contain only unique values', () => {
      const uniqueThemes = Array.from(new Set(THEMES))
      expect(uniqueThemes).toHaveLength(THEMES.length)
    })
    
    test('should have classic as first theme (default)', () => {
      expect(THEMES[0]).toBe('classic')
    })
  })

  describe('BOARD_SIZES', () => {
    test('should have all required board sizes', () => {
      expect(BOARD_SIZES).toHaveProperty('small')
      expect(BOARD_SIZES).toHaveProperty('medium')
      expect(BOARD_SIZES).toHaveProperty('large')
    })
    
    test('should have valid dimensions for small board', () => {
      expect(BOARD_SIZES.small).toEqual({ width: 15, height: 15 })
      expect(BOARD_SIZES.small.width).toBeGreaterThan(0)
      expect(BOARD_SIZES.small.height).toBeGreaterThan(0)
    })
    
    test('should have valid dimensions for medium board', () => {
      expect(BOARD_SIZES.medium).toEqual({ width: 20, height: 20 })
      expect(BOARD_SIZES.medium.width).toBeGreaterThan(BOARD_SIZES.small.width)
      expect(BOARD_SIZES.medium.height).toBeGreaterThan(BOARD_SIZES.small.height)
    })
    
    test('should have valid dimensions for large board', () => {
      expect(BOARD_SIZES.large).toEqual({ width: 25, height: 25 })
      expect(BOARD_SIZES.large.width).toBeGreaterThan(BOARD_SIZES.medium.width)
      expect(BOARD_SIZES.large.height).toBeGreaterThan(BOARD_SIZES.medium.height)
    })
    
    test('should have square boards (width equals height)', () => {
      Object.values(BOARD_SIZES).forEach(size => {
        expect(size.width).toBe(size.height)
      })
    })
    
    test('should have ascending board sizes', () => {
      const { small, medium, large } = BOARD_SIZES
      expect(small.width < medium.width).toBe(true)
      expect(medium.width < large.width).toBe(true)
    })
    
    test('should have reasonable minimum board size', () => {
      // Minimum board should allow for initial snake + food
      expect(BOARD_SIZES.small.width).toBeGreaterThanOrEqual(10)
      expect(BOARD_SIZES.small.height).toBeGreaterThanOrEqual(10)
    })
  })

  describe('GAME_SPEEDS', () => {
    test('should have speeds for all difficulty levels', () => {
      expect(GAME_SPEEDS).toHaveProperty('easy')
      expect(GAME_SPEEDS).toHaveProperty('medium')
      expect(GAME_SPEEDS).toHaveProperty('hard')
    })
    
    test('should have valid speed values', () => {
      expect(GAME_SPEEDS.easy).toBe(200)
      expect(GAME_SPEEDS.medium).toBe(150)
      expect(GAME_SPEEDS.hard).toBe(100)
    })
    
    test('should have descending speeds (higher difficulty = faster game)', () => {
      expect(GAME_SPEEDS.easy > GAME_SPEEDS.medium).toBe(true)
      expect(GAME_SPEEDS.medium > GAME_SPEEDS.hard).toBe(true)
    })
    
    test('should have positive speed values', () => {
      Object.values(GAME_SPEEDS).forEach(speed => {
        expect(speed).toBeGreaterThan(0)
      })
    })
    
    test('should correspond to difficulties array', () => {
      DIFFICULTIES.forEach(difficulty => {
        expect(GAME_SPEEDS).toHaveProperty(difficulty)
        expect(typeof GAME_SPEEDS[difficulty]).toBe('number')
      })
    })
    
    test('should have reasonable speed ranges', () => {
      // Speeds should be in reasonable millisecond ranges for game loops
      Object.values(GAME_SPEEDS).forEach(speed => {
        expect(speed).toBeGreaterThan(50)  // Not too fast
        expect(speed).toBeLessThan(500)    // Not too slow
      })
    })
  })

  describe('POINTS', () => {
    test('should have all point types defined', () => {
      expect(POINTS).toHaveProperty('FOOD')
      expect(POINTS).toHaveProperty('POWERUP')
      expect(POINTS).toHaveProperty('BONUS')
      expect(POINTS).toHaveProperty('TIME_BONUS')
    })
    
    test('should have correct point values', () => {
      expect(POINTS.FOOD).toBe(10)
      expect(POINTS.POWERUP).toBe(25)
      expect(POINTS.BONUS).toBe(50)
      expect(POINTS.TIME_BONUS).toBe(1)
    })
    
    test('should have ascending point values by importance', () => {
      expect(POINTS.TIME_BONUS < POINTS.FOOD).toBe(true)
      expect(POINTS.FOOD < POINTS.POWERUP).toBe(true)
      expect(POINTS.POWERUP < POINTS.BONUS).toBe(true)
    })
    
    test('should have positive point values', () => {
      Object.values(POINTS).forEach(points => {
        expect(points).toBeGreaterThan(0)
      })
    })
    
    test('should have integer point values', () => {
      Object.values(POINTS).forEach(points => {
        expect(Number.isInteger(points)).toBe(true)
      })
    })
    
    test('should have reasonable point ranges', () => {
      // Points should be reasonable for game balance
      expect(POINTS.FOOD).toBeGreaterThanOrEqual(5)
      expect(POINTS.FOOD).toBeLessThanOrEqual(20)
      expect(POINTS.BONUS).toBeLessThanOrEqual(100)
    })
  })

  describe('POWERUP_DURATION', () => {
    test('should have correct duration value', () => {
      expect(POWERUP_DURATION).toBe(5000)
    })
    
    test('should be positive number', () => {
      expect(POWERUP_DURATION).toBeGreaterThan(0)
    })
    
    test('should be in milliseconds', () => {
      // Should be reasonable duration in milliseconds (1-10 seconds)
      expect(POWERUP_DURATION).toBeGreaterThanOrEqual(1000)
      expect(POWERUP_DURATION).toBeLessThanOrEqual(10000)
    })
    
    test('should be integer value', () => {
      expect(Number.isInteger(POWERUP_DURATION)).toBe(true)
    })
  })

  describe('INITIAL_SNAKE_LENGTH', () => {
    test('should have correct initial length', () => {
      expect(INITIAL_SNAKE_LENGTH).toBe(3)
    })
    
    test('should be positive integer', () => {
      expect(INITIAL_SNAKE_LENGTH).toBeGreaterThan(0)
      expect(Number.isInteger(INITIAL_SNAKE_LENGTH)).toBe(true)
    })
    
    test('should be reasonable for smallest board', () => {
      // Snake should fit on smallest board with room for food
      expect(INITIAL_SNAKE_LENGTH).toBeLessThan(BOARD_SIZES.small.width / 2)
    })
    
    test('should be at least 1 segment', () => {
      expect(INITIAL_SNAKE_LENGTH).toBeGreaterThanOrEqual(1)
    })
  })

  describe('FOOD_SPAWN_DELAY', () => {
    test('should have correct delay value', () => {
      expect(FOOD_SPAWN_DELAY).toBe(100)
    })
    
    test('should be positive number', () => {
      expect(FOOD_SPAWN_DELAY).toBeGreaterThan(0)
    })
    
    test('should be reasonable delay in milliseconds', () => {
      // Should be short enough for smooth gameplay
      expect(FOOD_SPAWN_DELAY).toBeLessThan(1000)
      expect(FOOD_SPAWN_DELAY).toBeGreaterThanOrEqual(10)
    })
    
    test('should be integer value', () => {
      expect(Number.isInteger(FOOD_SPAWN_DELAY)).toBe(true)
    })
  })

  describe('MAX_LEVEL', () => {
    test('should have correct maximum level', () => {
      expect(MAX_LEVEL).toBe(20)
    })
    
    test('should be positive integer', () => {
      expect(MAX_LEVEL).toBeGreaterThan(0)
      expect(Number.isInteger(MAX_LEVEL)).toBe(true)
    })
    
    test('should be reasonable maximum level', () => {
      // Should provide good progression without being too high
      expect(MAX_LEVEL).toBeGreaterThanOrEqual(10)
      expect(MAX_LEVEL).toBeLessThanOrEqual(50)
    })
  })

  describe('LEVEL_UP_THRESHOLD', () => {
    test('should have correct threshold value', () => {
      expect(LEVEL_UP_THRESHOLD).toBe(100)
    })
    
    test('should be positive integer', () => {
      expect(LEVEL_UP_THRESHOLD).toBeGreaterThan(0)
      expect(Number.isInteger(LEVEL_UP_THRESHOLD)).toBe(true)
    })
    
    test('should be achievable with food points', () => {
      // Should be reachable by eating food
      const foodNeeded = Math.ceil(LEVEL_UP_THRESHOLD / POINTS.FOOD)
      expect(foodNeeded).toBeGreaterThan(0)
      expect(foodNeeded).toBeLessThan(50) // Reasonable number of food items
    })
    
    test('should be reasonable progression threshold', () => {
      expect(LEVEL_UP_THRESHOLD).toBeGreaterThanOrEqual(50)
      expect(LEVEL_UP_THRESHOLD).toBeLessThanOrEqual(500)
    })
  })

  describe('Constants relationships and validation', () => {
    test('should have consistent game speed and difficulty mapping', () => {
      // Each difficulty should have a corresponding speed
      DIFFICULTIES.forEach(difficulty => {
        expect(GAME_SPEEDS[difficulty]).toBeDefined()
        expect(typeof GAME_SPEEDS[difficulty]).toBe('number')
      })
    })
    
    test('should have board sizes that accommodate initial snake', () => {
      Object.values(BOARD_SIZES).forEach(boardSize => {
        // Board should be large enough for initial snake + some room
        expect(boardSize.width * boardSize.height).toBeGreaterThan(INITIAL_SNAKE_LENGTH * 2)
      })
    })
    
    test('should have reasonable level progression', () => {
      // Total points to reach max level should be achievable
      const totalPointsNeeded = MAX_LEVEL * LEVEL_UP_THRESHOLD
      expect(totalPointsNeeded).toBeGreaterThan(0)
      
      // Should be achievable with reasonable gameplay
      const maxFoodOnBoard = BOARD_SIZES.large.width * BOARD_SIZES.large.height
      expect(totalPointsNeeded / POINTS.FOOD).toBeLessThan(maxFoodOnBoard * 10)
    })
    
    test('should have power-up duration longer than food spawn delay', () => {
      expect(POWERUP_DURATION).toBeGreaterThan(FOOD_SPAWN_DELAY)
    })
    
    test('should have game speeds faster than power-up duration', () => {
      // Game should update multiple times during power-up
      Object.values(GAME_SPEEDS).forEach(speed => {
        expect(POWERUP_DURATION / speed).toBeGreaterThan(10)
      })
    })
  })

  describe('Type safety and immutability', () => {
    test('should export constants as const assertions', () => {
      // These tests verify TypeScript compile-time behavior at runtime
      expect(Array.isArray(GAME_MODES)).toBe(true)
      expect(Array.isArray(DIFFICULTIES)).toBe(true)
      expect(Array.isArray(THEMES)).toBe(true)
    })
    
    test('should have immutable arrays', () => {
      // Verify arrays cannot be modified
      const originalGameModes = Array.from(GAME_MODES)
      const originalDifficulties = Array.from(DIFFICULTIES)
      const originalThemes = Array.from(THEMES)
      
      // Try to modify arrays - these should throw because they're frozen
      expect(() => {
        (GAME_MODES as any)[0] = 'invalid'
      }).toThrow()
      
      expect(() => {
        (GAME_MODES as any).push('invalid')
      }).toThrow()
      
      expect(GAME_MODES).toEqual(originalGameModes)
      expect(DIFFICULTIES).toEqual(originalDifficulties)
      expect(THEMES).toEqual(originalThemes)
    })
    
    test('should have immutable objects', () => {
      const originalBoardSizes = JSON.parse(JSON.stringify(BOARD_SIZES))
      const originalGameSpeeds = JSON.parse(JSON.stringify(GAME_SPEEDS))
      const originalPoints = JSON.parse(JSON.stringify(POINTS))
      
      // Try to modify objects - these should throw because they're frozen
      expect(() => {
        (BOARD_SIZES.small as any).width = 999
      }).toThrow()
      
      expect(() => {
        (GAME_SPEEDS as any).easy = 999
      }).toThrow()
      
      expect(() => {
        (POINTS as any).FOOD = 999
      }).toThrow()
      
      expect(BOARD_SIZES).toEqual(originalBoardSizes)
      expect(GAME_SPEEDS).toEqual(originalGameSpeeds)
      expect(POINTS).toEqual(originalPoints)
    })
  })
}) 