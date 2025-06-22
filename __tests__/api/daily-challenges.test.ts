import { DailyChallenge, ChallengeObjective, ChallengeReward } from '@/types/api'

describe('Daily Challenges API', () => {
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
  
  describe('Challenge Logic', () => {
    test('should generate unique challenge IDs', () => {
      const date1 = new Date('2024-01-15')
      const date2 = new Date('2024-01-16')
      
      const id1 = `daily-${date1.toISOString().split('T')[0]}`
      const id2 = `daily-${date2.toISOString().split('T')[0]}`
      
      expect(id1).toBe('daily-2024-01-15')
      expect(id2).toBe('daily-2024-01-16')
      expect(id1).not.toBe(id2)
    })
    
    test('should validate challenge completion criteria', () => {
      const scoreChallenge: DailyChallenge = {
        id: 'test-1',
        date: new Date(),
        title: 'Test',
        description: 'Test challenge',
        objective: {
          type: 'score',
          target: 500,
          gameMode: 'classic',
          difficulty: 'medium'
        },
        reward: { type: 'points', value: 100 },
        participants: 10,
        completions: 3
      }
      
      // Mock game session data
      const gameSession = {
        score: 600,
        gameMode: 'classic' as const,
        difficulty: 'medium' as const,
        duration: 180,
        foodConsumed: 15
      }
      
      // Challenge should be completable with this session
      const isCompleted = gameSession.score >= scoreChallenge.objective.target &&
                         gameSession.gameMode === scoreChallenge.objective.gameMode &&
                         gameSession.difficulty === scoreChallenge.objective.difficulty
      
      expect(isCompleted).toBe(true)
    })
    
    test('should track participation and completion stats', () => {
      const challenge: DailyChallenge = {
        id: 'stats-test',
        date: new Date(),
        title: 'Stats Test',
        description: 'Test stats tracking',
        objective: {
          type: 'score',
          target: 100,
          gameMode: 'classic',
          difficulty: 'easy'
        },
        reward: { type: 'points', value: 50 },
        participants: 100,
        completions: 25
      }
      
      const completionRate = (challenge.completions / challenge.participants) * 100
      
      expect(challenge.participants).toBe(100)
      expect(challenge.completions).toBe(25)
      expect(completionRate).toBe(25)
    })
  })
}) 