import { DailyChallenge, ChallengeObjective, ChallengeReward, ApiResponse } from '@/types/api'
import { GameMode, Difficulty } from '@/types/game'
import { GET, POST } from '@/app/api/daily-challenges/route'

describe('Daily Challenges API Routes', () => {
  // Helper function to create a valid challenge request
  const createChallengeRequest = (data: any) => {
    return new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  }

  const validChallengeData = {
    title: 'Test Challenge',
    description: 'A test challenge for validation',
    objective: {
      type: 'score' as const,
      target: 500,
      gameMode: 'classic' as GameMode,
      difficulty: 'medium' as Difficulty
    },
    reward: {
      type: 'points' as const,
      value: 150
    }
  }

  describe('GET /api/daily-challenges', () => {
    test('should return success response with data array', async () => {
      const response = await GET()
      const responseData = await response.json()
      
      expect(responseData.success).toBe(true)
      expect(Array.isArray(responseData.data)).toBe(true)
      expect(typeof responseData.total).toBe('number')
    })

    test('should filter active challenges only', async () => {
      // Create a future challenge
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      const futureChallengeData = {
        ...validChallengeData,
        title: 'Future Challenge',
        date: tomorrow.toISOString()
      }

      const createRequest = createChallengeRequest(futureChallengeData)
      await POST(createRequest)

      const response = await GET()
      const responseData = await response.json()
      
      expect(responseData.success).toBe(true)
      expect(responseData.data.length).toBeGreaterThan(0)
      
      // Check that all returned challenges are active (today or future)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      responseData.data.forEach((challenge: DailyChallenge) => {
        const challengeDate = new Date(challenge.date)
        challengeDate.setHours(0, 0, 0, 0)
        expect(challengeDate.getTime()).toBeGreaterThanOrEqual(today.getTime())
      })
    })
  })

  describe('POST /api/daily-challenges', () => {
    test('should create a valid challenge successfully', async () => {
      const request = createChallengeRequest(validChallengeData)
      const response = await POST(request)
      const responseData = await response.json()

      expect(responseData.success).toBe(true)
      expect(responseData.data).toBeDefined()
      expect(responseData.data.title).toBe('Test Challenge')
      expect(responseData.data.description).toBe('A test challenge for validation')
      expect(responseData.data.objective).toEqual(validChallengeData.objective)
      expect(responseData.data.reward).toEqual(validChallengeData.reward)
      expect(responseData.data.participants).toBe(0)
      expect(responseData.data.completions).toBe(0)
      expect(responseData.data.id).toMatch(/^daily-\d{4}-\d{2}-\d{2}-[a-z0-9]+$/)
      expect(responseData.message).toBe('Daily challenge created successfully')
    })

    test('should validate required fields', async () => {
      const invalidData = {
        title: 'Test Challenge'
        // Missing description, objective, reward
      }

      const request = createChallengeRequest(invalidData)
      const response = await POST(request)
      const responseData = await response.json()

      expect(responseData.success).toBe(false)
      expect(responseData.error).toBe('Missing required fields')
      expect(responseData.message).toContain('Missing fields: description, objective, reward')
      expect(response.status).toBe(400)
    })

    test('should validate objective structure', async () => {
      const invalidObjectiveData = {
        ...validChallengeData,
        objective: {
          type: 'score',
          target: 500
          // Missing gameMode and difficulty
        }
      }

      const request = createChallengeRequest(invalidObjectiveData)
      const response = await POST(request)
      const responseData = await response.json()

      expect(responseData.success).toBe(false)
      expect(responseData.error).toBe('Invalid objective')
      expect(responseData.message).toBe('Objective must have type, target, gameMode, and difficulty')
      expect(response.status).toBe(400)
    })

    test('should validate objective type', async () => {
      const invalidTypeData = {
        ...validChallengeData,
        objective: {
          ...validChallengeData.objective,
          type: 'invalid' as any
        }
      }

      const request = createChallengeRequest(invalidTypeData)
      const response = await POST(request)
      const responseData = await response.json()

      expect(responseData.success).toBe(false)
      expect(responseData.error).toBe('Invalid objective type')
      expect(responseData.message).toBe('Objective type must be one of: score, time, food, survival')
      expect(response.status).toBe(400)
    })

    test('should validate game mode', async () => {
      const invalidGameModeData = {
        ...validChallengeData,
        objective: {
          ...validChallengeData.objective,
          gameMode: 'invalid' as any
        }
      }

      const request = createChallengeRequest(invalidGameModeData)
      const response = await POST(request)
      const responseData = await response.json()

      expect(responseData.success).toBe(false)
      expect(responseData.error).toBe('Invalid game mode')
      expect(responseData.message).toBe('Game mode must be one of: classic, timed, survival, zen')
      expect(response.status).toBe(400)
    })

    test('should validate difficulty', async () => {
      const invalidDifficultyData = {
        ...validChallengeData,
        objective: {
          ...validChallengeData.objective,
          difficulty: 'invalid' as any
        }
      }

      const request = createChallengeRequest(invalidDifficultyData)
      const response = await POST(request)
      const responseData = await response.json()

      expect(responseData.success).toBe(false)
      expect(responseData.error).toBe('Invalid difficulty')
      expect(responseData.message).toBe('Difficulty must be one of: easy, medium, hard')
      expect(response.status).toBe(400)
    })

    test('should validate reward structure', async () => {
      const invalidRewardData = {
        ...validChallengeData,
        reward: {
          type: 'points'
          // Missing value
        }
      }

      const request = createChallengeRequest(invalidRewardData)
      const response = await POST(request)
      const responseData = await response.json()

      expect(responseData.success).toBe(false)
      expect(responseData.error).toBe('Invalid reward')
      expect(responseData.message).toBe('Reward must have type and value')
      expect(response.status).toBe(400)
    })

    test('should validate reward type', async () => {
      const invalidRewardTypeData = {
        ...validChallengeData,
        reward: {
          type: 'invalid' as any,
          value: 100
        }
      }

      const request = createChallengeRequest(invalidRewardTypeData)
      const response = await POST(request)
      const responseData = await response.json()

      expect(responseData.success).toBe(false)
      expect(responseData.error).toBe('Invalid reward type')
      expect(responseData.message).toBe('Reward type must be one of: points, achievement, theme')
      expect(response.status).toBe(400)
    })

    test('should prevent duplicate challenges for same date', async () => {
      const challengeDate = '2024-01-15'
      const challengeData = {
        ...validChallengeData,
        date: challengeDate
      }

      // Create first challenge
      const request1 = createChallengeRequest(challengeData)
      const response1 = await POST(request1)
      const responseData1 = await response1.json()
      
      expect(responseData1.success).toBe(true)

      // Try to create second challenge for same date
      const request2 = createChallengeRequest({
        ...challengeData,
        title: 'Different Title'
      })
      const response2 = await POST(request2)
      const responseData2 = await response2.json()

      expect(responseData2.success).toBe(false)
      expect(responseData2.error).toBe('Challenge already exists')
      expect(responseData2.message).toBe('A challenge for this date already exists')
      expect(response2.status).toBe(409)
    })

    test('should handle different objective types', async () => {
      const objectiveTypes = [
        { type: 'score' as const, target: 1000 },
        { type: 'time' as const, target: 120 },
        { type: 'food' as const, target: 25 },
        { type: 'survival' as const, target: 300 }
      ]

      for (let index = 0; index < objectiveTypes.length; index++) {
        const objective = objectiveTypes[index]
        const challengeData = {
          ...validChallengeData,
          title: `Challenge ${index + 1}`,
          date: `2024-01-${(index + 1).toString().padStart(2, '0')}`,
          objective: {
            ...objective,
            gameMode: 'classic' as GameMode,
            difficulty: 'medium' as Difficulty
          }
        }

        const request = createChallengeRequest(challengeData)
        const response = await POST(request)
        const responseData = await response.json()

        expect(responseData.success).toBe(true)
        expect(responseData.data.objective.type).toBe(objective.type)
        expect(responseData.data.objective.target).toBe(objective.target)
        expect(responseData.message).toBe('Daily challenge created successfully')
      }
    })

    test('should handle different reward types', async () => {
      const rewardTypes = [
        { type: 'points' as const, value: 150 },
        { type: 'achievement' as const, value: 'daily-master' },
        { type: 'theme' as const, value: 'golden-snake' }
      ]

      for (let index = 0; index < rewardTypes.length; index++) {
        const reward = rewardTypes[index]
        const challengeData = {
          ...validChallengeData,
          title: `Reward Challenge ${index + 1}`,
          date: `2024-02-${(index + 1).toString().padStart(2, '0')}`,
          reward
        }

        const request = createChallengeRequest(challengeData)
        const response = await POST(request)
        const responseData = await response.json()

        expect(responseData.success).toBe(true)
        expect(responseData.data.reward.type).toBe(reward.type)
        expect(responseData.data.reward.value).toBe(reward.value)
        expect(responseData.message).toBe('Daily challenge created successfully')
      }
    })

    test('should handle invalid JSON', async () => {
      const request = new Request('http://localhost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json'
      })

      const response = await POST(request)
      const responseData = await response.json()

      expect(responseData.success).toBe(false)
      expect(responseData.error).toBe('Invalid JSON')
      expect(responseData.message).toBe('Request body must be valid JSON')
      expect(response.status).toBe(400)
    })

    test('should handle server errors', async () => {
      // Create a request that will cause JSON parsing to fail
      const request = {
        json: jest.fn().mockRejectedValue(new Error('Server error'))
      } as any

      const response = await POST(request)
      const responseData = await response.json()

      expect(responseData.success).toBe(false)
      expect(responseData.error).toBe('Internal server error')
      expect(responseData.message).toBe('Server error')
      expect(response.status).toBe(500)
    })

    test('should sort challenges by date', async () => {
      // Create challenges with unique timestamps to avoid duplicates
      const baseTime = Date.now()
      const challenges = [
        {
          ...validChallengeData,
          title: 'SortChallenge A',
          date: new Date(baseTime + 3 * 24 * 60 * 60 * 1000).toISOString() // +3 days
        },
        {
          ...validChallengeData,
          title: 'SortChallenge B',
          date: new Date(baseTime + 1 * 24 * 60 * 60 * 1000).toISOString() // +1 day
        },
        {
          ...validChallengeData,
          title: 'SortChallenge C',
          date: new Date(baseTime + 2 * 24 * 60 * 60 * 1000).toISOString() // +2 days
        }
      ]
      
      // Create all challenges
      for (const challengeData of challenges) {
        const request = createChallengeRequest(challengeData)
        await POST(request)
      }

      // Get all challenges and verify they're sorted
      const getResponse = await GET()
      const responseData = await getResponse.json()
      
      expect(responseData.success).toBe(true)
      
      // Find our test challenges
      const testChallenges = responseData.data.filter((c: DailyChallenge) => 
        c.title.startsWith('SortChallenge')
      )
      
      expect(testChallenges.length).toBeGreaterThan(0)
      
      // Verify they're sorted by date (the API should return them sorted)
      if (testChallenges.length > 1) {
        for (let i = 1; i < testChallenges.length; i++) {
          const prevDate = new Date(testChallenges[i - 1].date)
          const currDate = new Date(testChallenges[i].date)
          expect(prevDate.getTime()).toBeLessThanOrEqual(currDate.getTime())
        }
      }
    })
  })

  describe('Challenge Data Validation', () => {
    test('should validate challenge structure', () => {
      const challenge: DailyChallenge = {
        id: 'daily-2024-01-15',
        date: new Date('2024-01-15'),
        title: 'Speed Master',
        description: 'Score 1000 points in classic mode',
        objective: {
          type: 'score',
          target: 1000,
          gameMode: 'classic',
          difficulty: 'medium'
        },
        reward: {
          type: 'points',
          value: 150
        },
        participants: 0,
        completions: 0
      }
      
      expect(challenge.id).toBe('daily-2024-01-15')
      expect(challenge.date).toBeInstanceOf(Date)
      expect(challenge.title).toBe('Speed Master')
      expect(challenge.description).toBe('Score 1000 points in classic mode')
      expect(challenge.objective.type).toBe('score')
      expect(challenge.objective.target).toBe(1000)
      expect(challenge.reward.type).toBe('points')
      expect(challenge.reward.value).toBe(150)
    })
    
    test('should validate different objective types', () => {
      const scoreObjective: ChallengeObjective = {
        type: 'score',
        target: 500,
        gameMode: 'classic',
        difficulty: 'easy'
      }
      
      const timeObjective: ChallengeObjective = {
        type: 'time',
        target: 120,
        gameMode: 'timed',
        difficulty: 'medium'
      }
      
      const foodObjective: ChallengeObjective = {
        type: 'food',
        target: 25,
        gameMode: 'classic',
        difficulty: 'hard'
      }
      
      const survivalObjective: ChallengeObjective = {
        type: 'survival',
        target: 300,
        gameMode: 'survival',
        difficulty: 'hard'
      }
      
      expect(scoreObjective.type).toBe('score')
      expect(timeObjective.type).toBe('time')
      expect(foodObjective.type).toBe('food')
      expect(survivalObjective.type).toBe('survival')
    })
    
    test('should validate different reward types', () => {
      const pointsReward: ChallengeReward = {
        type: 'points',
        value: 200
      }
      
      const achievementReward: ChallengeReward = {
        type: 'achievement',
        value: 'daily-champion'
      }
      
      const themeReward: ChallengeReward = {
        type: 'theme',
        value: 'golden-snake'
      }
      
      expect(pointsReward.type).toBe('points')
      expect(typeof pointsReward.value).toBe('number')
      expect(achievementReward.type).toBe('achievement')
      expect(typeof achievementReward.value).toBe('string')
      expect(themeReward.type).toBe('theme')
      expect(typeof themeReward.value).toBe('string')
    })
  })
}) 