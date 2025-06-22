import { Achievement } from '@/types/user'
import { cn } from '@/lib/utils'

interface AchievementCardProps {
  achievement: Achievement
  isUnlocked: boolean
  progress?: number
  className?: string
}

export function AchievementCard({ achievement, isUnlocked, progress = 0, className }: AchievementCardProps) {
  const progressPercentage = Math.min((progress / achievement.condition.target) * 100, 100)
  
  const formatReward = (reward?: Achievement['reward']) => {
    if (!reward) return null
    
    switch (reward.type) {
      case 'points':
        return `${reward.value} points`
      case 'theme':
        return `${reward.value.toString().replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Theme`
      case 'title':
        return `${reward.value} Title`
      default:
        return reward.value.toString()
    }
  }
  
  const formatCondition = (condition: Achievement['condition']) => {
    switch (condition.type) {
      case 'score':
        return `Score ${condition.target} points`
      case 'games_played':
        return `Play ${condition.target} games`
      case 'streak':
        return `Win ${condition.target} games in a row`
      case 'time_played':
        return `Complete in under ${condition.target} seconds`
      default:
        return `Reach ${condition.target}`
    }
  }
  
  return (
    <div
      data-testid={`achievement-${achievement.id}`}
      className={cn(
        'relative overflow-hidden rounded-lg border bg-card p-6 transition-all duration-200',
        isUnlocked
          ? 'border-green-200 bg-green-50 shadow-md unlocked dark:border-green-800 dark:bg-green-950'
          : 'border-gray-200 bg-gray-50 shadow-sm locked hover:shadow-md dark:border-gray-700 dark:bg-gray-900',
        className
      )}
    >
      {/* Achievement Icon */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-4xl">{achievement.icon}</div>
        <div className={cn(
          'rounded-full px-3 py-1 text-xs font-medium',
          isUnlocked
            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
        )}>
          {isUnlocked ? 'Unlocked' : 'Locked'}
        </div>
      </div>
      
      {/* Achievement Details */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {achievement.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {achievement.description}
        </p>
        
        {/* Condition */}
        <p className="text-xs text-gray-500 dark:text-gray-500">
          {formatCondition(achievement.condition)}
        </p>
      </div>
      
      {/* Progress Bar (only for locked achievements) */}
      {!isUnlocked && (
        <div className="mt-4">
          <div className="mb-2 flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div
            data-testid={`achievement-progress-${achievement.id}`}
            className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
          >
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">
            {progress} / {achievement.condition.target}
          </div>
        </div>
      )}
      
      {/* Reward */}
      {achievement.reward && (
        <div className="mt-4 rounded-md bg-white/50 p-3 dark:bg-gray-800/50">
          <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300">Reward</h4>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            {formatReward(achievement.reward)}
          </p>
        </div>
      )}
      
      {/* Unlocked Date */}
      {isUnlocked && achievement.unlockedAt && (
        <div className="mt-4 text-xs text-green-600 dark:text-green-400">
          Unlocked on {achievement.unlockedAt.toLocaleDateString()}
        </div>
      )}
      
      {/* Category Badge */}
      <div className="absolute right-2 top-2">
        <span className={cn(
          'rounded-full px-2 py-1 text-xs font-medium capitalize',
          achievement.category === 'score' && 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
          achievement.category === 'gameplay' && 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
          achievement.category === 'social' && 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
          achievement.category === 'streak' && 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
        )}>
          {achievement.category}
        </span>
      </div>
    </div>
  )
} 