import {
  ApiResponse,
  LeaderboardEntry,
  ScoreSubmission,
  LeaderboardQuery,
  DailyChallenge,
  ChallengeObjective,
  ChallengeReward
} from '@/types/api'
import { GameMode, Difficulty } from '@/types/game'

describe('API Types', () => {
  describe('ApiResponse', () => {
    test('should accept generic success response', () => {
      const response: ApiResponse<{ score: number }> = {
        success: true,
        data: { score: 100 }
      }
      
      expect(response.success).toBe(true)
      expect(response.data?.score).toBe(100)
    })
    
    test('should accept error response', () => {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid input',
        message: 'Score must be positive'
      }
      
      expect(response.success).toBe(false)
      expect(response.error).toBe('Invalid input')
      expect(response.message).toBe('Score must be positive')
    })
    
    test('should accept response without data', () => {
      const response: ApiResponse = {
        success: true,
        message: 'Operation completed'
      }
      
      expect(response.success).toBe(true)
      expect(response.data).toBeUndefined()
      expect(response.message).toBe('Operation completed')
    })
    
    test('should accept any type for data', () => {
      const stringResponse: ApiResponse<string> = {
        success: true,
        data: 'test'
      }
      
      const arrayResponse: ApiResponse<number[]> = {
        success: true,
        data: [1, 2, 3]
      }
      
      expect(stringResponse.data).toBe('test')
      expect(arrayResponse.data).toEqual([1, 2, 3])
    })
  })
  
  describe('LeaderboardEntry', () => {
    test('should create valid leaderboard entry', () => {
      const entry: LeaderboardEntry = {
        id: 'entry-123',
        userId: 'user-456',
        username: 'testuser',
        score: 1500,
        gameMode: 'classic',
        difficulty: 'medium',
        achievedAt: new Date('2024-01-01'),
        rank: 5
      }
      
      expect(entry.id).toBe('entry-123')
      expect(entry.userId).toBe('user-456')
      expect(entry.username).toBe('testuser')
      expect(entry.score).toBe(1500)
      expect(entry.gameMode).toBe('classic')
      expect(entry.difficulty).toBe('medium')
      expect(entry.achievedAt).toBeInstanceOf(Date)
      expect(entry.rank).toBe(5)
    })
    
    test('should accept all valid game modes', () => {
      const gameModes: GameMode[] = ['classic', 'timed', 'survival', 'zen']
      
      gameModes.forEach((mode, index) => {
        const entry: LeaderboardEntry = {
          id: `entry-${index}`,
          userId: `user-${index}`,
          username: `user${index}`,
          score: 100 * index,
          gameMode: mode,
          difficulty: 'medium',
          achievedAt: new Date(),
          rank: index + 1
        }
        
        expect(entry.gameMode).toBe(mode)
      })
    })
    
    test('should accept all valid difficulties', () => {
      const difficulties: Difficulty[] = ['easy', 'medium', 'hard']
      
      difficulties.forEach((diff, index) => {
        const entry: LeaderboardEntry = {
          id: `entry-${index}`,
          userId: `user-${index}`,
          username: `user${index}`,
          score: 100 * index,
          gameMode: 'classic',
          difficulty: diff,
          achievedAt: new Date(),
          rank: index + 1
        }
        
        expect(entry.difficulty).toBe(diff)
      })
    })
  })
  
  describe('ScoreSubmission', () => {
    test('should create valid score submission', () => {
      const submission: ScoreSubmission = {
        score: 2500,
        gameMode: 'classic',
        difficulty: 'hard',
        duration: 300,
        moves: 150,
        foodConsumed: 25
      }
      
      expect(submission.score).toBe(2500)
      expect(submission.gameMode).toBe('classic')
      expect(submission.difficulty).toBe('hard')
      expect(submission.duration).toBe(300)
      expect(submission.moves).toBe(150)
      expect(submission.foodConsumed).toBe(25)
    })
    
    test('should accept all game modes and difficulties', () => {
      const submission: ScoreSubmission = {
        score: 1000,
        gameMode: 'timed',
        difficulty: 'easy',
        duration: 180,
        moves: 80,
        foodConsumed: 10
      }
      
      expect(submission.gameMode).toBe('timed')
      expect(submission.difficulty).toBe('easy')
    })
    
    test('should handle edge values', () => {
      const minSubmission: ScoreSubmission = {
        score: 0,
        gameMode: 'zen',
        difficulty: 'easy',
        duration: 0,
        moves: 0,
        foodConsumed: 0
      }
      
      const maxSubmission: ScoreSubmission = {
        score: 999999,
        gameMode: 'survival',
        difficulty: 'hard',
        duration: 3600,
        moves: 10000,
        foodConsumed: 1000
      }
      
      expect(minSubmission.score).toBe(0)
      expect(maxSubmission.score).toBe(999999)
    })
  })
  
  describe('LeaderboardQuery', () => {
    test('should create query with all optional fields', () => {
      const query: LeaderboardQuery = {
        gameMode: 'classic',
        difficulty: 'medium',
        limit: 10,
        offset: 0
      }
      
      expect(query.gameMode).toBe('classic')
      expect(query.difficulty).toBe('medium')
      expect(query.limit).toBe(10)
      expect(query.offset).toBe(0)
    })
    
    test('should create empty query', () => {
      const query: LeaderboardQuery = {}
      
      expect(query.gameMode).toBeUndefined()
      expect(query.difficulty).toBeUndefined()
      expect(query.limit).toBeUndefined()
      expect(query.offset).toBeUndefined()
    })
    
    test('should create partial query', () => {
      const query: LeaderboardQuery = {
        gameMode: 'timed',
        limit: 5
      }
      
      expect(query.gameMode).toBe('timed')
      expect(query.limit).toBe(5)
      expect(query.difficulty).toBeUndefined()
      expect(query.offset).toBeUndefined()
    })
    
    test('should handle pagination parameters', () => {
      const paginationQuery: LeaderboardQuery = {
        limit: 20,
        offset: 40
      }
      
      expect(paginationQuery.limit).toBe(20)
      expect(paginationQuery.offset).toBe(40)
    })
  })
  
  describe('DailyChallenge', () => {
    test('should create valid daily challenge', () => {
      const challenge: DailyChallenge = {
        id: 'challenge-123',
        date: new Date('2024-01-15'),
        title: 'Speed Run Challenge',
        description: 'Score 500 points in under 2 minutes',
        objective: {
          type: 'score',
          target: 500,
          gameMode: 'timed',
          difficulty: 'medium'
        },
        reward: {
          type: 'points',
          value: 100
        },
        participants: 150,
        completions: 45
      }
      
      expect(challenge.id).toBe('challenge-123')
      expect(challenge.date).toBeInstanceOf(Date)
      expect(challenge.title).toBe('Speed Run Challenge')
      expect(challenge.description).toBe('Score 500 points in under 2 minutes')
      expect(challenge.participants).toBe(150)
      expect(challenge.completions).toBe(45)
    })
    
    test('should validate objective types', () => {
      const objectives: Array<ChallengeObjective['type']> = ['score', 'time', 'food', 'survival']
      
      objectives.forEach((type, index) => {
        const challenge: DailyChallenge = {
          id: `challenge-${index}`,
          date: new Date(),
          title: `${type} Challenge`,
          description: `Complete ${type} objective`,
          objective: {
            type,
            target: 100,
            gameMode: 'classic',
            difficulty: 'medium'
          },
          reward: {
            type: 'points',
            value: 50
          },
          participants: 0,
          completions: 0
        }
        
        expect(challenge.objective.type).toBe(type)
      })
    })
    
    test('should validate reward types', () => {
      const rewardTypes: Array<ChallengeReward['type']> = ['points', 'achievement', 'theme']
      
      rewardTypes.forEach((type, index) => {
        const challenge: DailyChallenge = {
          id: `challenge-${index}`,
          date: new Date(),
          title: `Reward Challenge`,
          description: `Earn ${type} reward`,
          objective: {
            type: 'score',
            target: 100,
            gameMode: 'classic',
            difficulty: 'medium'
          },
          reward: {
            type,
            value: type === 'points' ? 100 : 'reward-name'
          },
          participants: 0,
          completions: 0
        }
        
        expect(challenge.reward.type).toBe(type)
      })
    })
  })
  
  describe('ChallengeObjective', () => {
    test('should create score objective', () => {
      const objective: ChallengeObjective = {
        type: 'score',
        target: 1000,
        gameMode: 'classic',
        difficulty: 'hard'
      }
      
      expect(objective.type).toBe('score')
      expect(objective.target).toBe(1000)
      expect(objective.gameMode).toBe('classic')
      expect(objective.difficulty).toBe('hard')
    })
    
    test('should create time objective', () => {
      const objective: ChallengeObjective = {
        type: 'time',
        target: 120, // 2 minutes
        gameMode: 'timed',
        difficulty: 'medium'
      }
      
      expect(objective.type).toBe('time')
      expect(objective.target).toBe(120)
    })
    
    test('should create food objective', () => {
      const objective: ChallengeObjective = {
        type: 'food',
        target: 50,
        gameMode: 'classic',
        difficulty: 'easy'
      }
      
      expect(objective.type).toBe('food')
      expect(objective.target).toBe(50)
    })
    
    test('should create survival objective', () => {
      const objective: ChallengeObjective = {
        type: 'survival',
        target: 300, // 5 minutes
        gameMode: 'survival',
        difficulty: 'hard'
      }
      
      expect(objective.type).toBe('survival')
      expect(objective.target).toBe(300)
    })
  })
  
  describe('ChallengeReward', () => {
    test('should create points reward', () => {
      const reward: ChallengeReward = {
        type: 'points',
        value: 250
      }
      
      expect(reward.type).toBe('points')
      expect(reward.value).toBe(250)
      expect(typeof reward.value).toBe('number')
    })
    
    test('should create achievement reward', () => {
      const reward: ChallengeReward = {
        type: 'achievement',
        value: 'speed-demon'
      }
      
      expect(reward.type).toBe('achievement')
      expect(reward.value).toBe('speed-demon')
      expect(typeof reward.value).toBe('string')
    })
    
    test('should create theme reward', () => {
      const reward: ChallengeReward = {
        type: 'theme',
        value: 'neon-glow'
      }
      
      expect(reward.type).toBe('theme')
      expect(reward.value).toBe('neon-glow')
      expect(typeof reward.value).toBe('string')
    })
    
    test('should accept both string and number values', () => {
      const numberReward: ChallengeReward = {
        type: 'points',
        value: 100
      }
      
      const stringReward: ChallengeReward = {
        type: 'achievement',
        value: 'achievement-id'
      }
      
      expect(typeof numberReward.value).toBe('number')
      expect(typeof stringReward.value).toBe('string')
    })
  })
  
  describe('Type Integration', () => {
    test('should work together in complex scenarios', () => {
      const leaderboardResponse: ApiResponse<LeaderboardEntry[]> = {
        success: true,
        data: [
          {
            id: 'entry-1',
            userId: 'user-1',
            username: 'player1',
            score: 2000,
            gameMode: 'classic',
            difficulty: 'hard',
            achievedAt: new Date(),
            rank: 1
          }
        ]
      }
      
      const challengeResponse: ApiResponse<DailyChallenge> = {
        success: true,
        data: {
          id: 'daily-1',
          date: new Date(),
          title: 'Daily Challenge',
          description: 'Test challenge',
          objective: {
            type: 'score',
            target: 500,
            gameMode: 'classic',
            difficulty: 'medium'
          },
          reward: {
            type: 'points',
            value: 100
          },
          participants: 50,
          completions: 15
        }
      }
      
      expect(leaderboardResponse.success).toBe(true)
      expect(leaderboardResponse.data).toHaveLength(1)
      expect(challengeResponse.success).toBe(true)
      expect(challengeResponse.data?.objective.type).toBe('score')
    })
    
    test('should handle error responses consistently', () => {
      const scoreError: ApiResponse<ScoreSubmission> = {
        success: false,
        error: 'INVALID_SCORE',
        message: 'Score must be non-negative'
      }
      
      const leaderboardError: ApiResponse<LeaderboardEntry[]> = {
        success: false,
        error: 'DATABASE_ERROR',
        message: 'Unable to fetch leaderboard'
      }
      
      expect(scoreError.success).toBe(false)
      expect(scoreError.error).toBe('INVALID_SCORE')
      expect(leaderboardError.success).toBe(false)
      expect(leaderboardError.error).toBe('DATABASE_ERROR')
    })
  })
}) 