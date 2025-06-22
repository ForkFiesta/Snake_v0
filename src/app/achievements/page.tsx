'use client'

import { useState, useEffect, useMemo } from 'react'
import { Achievement } from '@/types/user'
import { getAchievements } from '@/lib/api/scores'
import { useUserStore } from '@/lib/stores/userStore'
import { AchievementCard } from '@/components/game'
import { LoadingSpinner } from '@/components/common'
import { Button, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui'
import { cn } from '@/lib/utils'

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState('all')
  
  const { user, achievements: userAchievements } = useUserStore()
  
  const fetchAchievements = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAchievements()
      
      if (response.success && response.data) {
        setAchievements(response.data)
      } else {
        setError(response.error || 'Failed to load achievements')
      }
    } catch (err) {
      setError('Failed to load achievements')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchAchievements()
  }, [])
  
  // Filter achievements by category
  const filteredAchievements = useMemo(() => {
    if (activeCategory === 'all') {
      return achievements
    }
    return achievements.filter(achievement => achievement.category === activeCategory)
  }, [achievements, activeCategory])
  
  // Calculate statistics
  const stats = useMemo(() => {
    const unlockedCount = achievements.filter(achievement => 
      userAchievements.some(userAch => userAch.id === achievement.id)
    ).length
    
    const totalPoints = userAchievements.reduce((sum, achievement) => {
      if (achievement.reward?.type === 'points') {
        return sum + (achievement.reward.value as number)
      }
      return sum
    }, 0)
    
    const completionPercentage = achievements.length > 0 
      ? Math.round((unlockedCount / achievements.length) * 100)
      : 0
    
    return {
      unlocked: unlockedCount,
      total: achievements.length,
      percentage: completionPercentage,
      points: totalPoints
    }
  }, [achievements, userAchievements])
  
  // Check if achievement is unlocked
  const isAchievementUnlocked = (achievementId: string) => {
    return userAchievements.some(userAch => userAch.id === achievementId)
  }
  
  // Get achievement progress (mock implementation - in real app would come from user stats)
  const getAchievementProgress = (achievement: Achievement) => {
    // Mock progress based on achievement type
    switch (achievement.condition.type) {
      case 'score':
        return Math.floor(Math.random() * achievement.condition.target)
      case 'games_played':
        return Math.floor(Math.random() * achievement.condition.target)
      case 'streak':
        return Math.floor(Math.random() * achievement.condition.target)
      case 'time_played':
        return Math.floor(Math.random() * achievement.condition.target)
      default:
        return 0
    }
  }
  
  const categories = [
    { value: 'all', label: 'All' },
    { value: 'score', label: 'Score' },
    { value: 'gameplay', label: 'Gameplay' },
    { value: 'social', label: 'Social' },
    { value: 'streak', label: 'Streak' }
  ]
  
  if (!user) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold">Achievements</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to track your achievements and unlock rewards
          </p>
        </div>
      </main>
    )
  }
  
  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center" data-testid="achievements-loading">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading achievements...</p>
        </div>
      </main>
    )
  }
  
  if (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center" data-testid="achievements-error">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-100 p-4 dark:bg-red-900">
            <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-semibold">Failed to load achievements</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">{error}</p>
          <Button onClick={fetchAchievements}>Retry</Button>
        </div>
      </main>
    )
  }
  
  if (achievements.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center" data-testid="achievements-empty">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
            <svg className="h-8 w-8 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-semibold">No achievements available</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Check back later for new achievements to unlock!
          </p>
        </div>
      </main>
    )
  }
  
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-4xl font-bold">Achievements</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Track your progress and unlock rewards as you play
        </p>
      </div>
      
      {/* Statistics */}
      <div className="mb-8" data-testid="achievements-stats">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-card p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {stats.unlocked} / {stats.total}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Unlocked</div>
          </div>
          <div className="rounded-lg bg-card p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.percentage}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Complete</div>
          </div>
          <div className="rounded-lg bg-card p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {stats.points}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Points Earned</div>
          </div>
        </div>
      </div>
      
      {/* Category Filters */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
        <TabsList className="grid w-full grid-cols-5">
          {categories.map(category => (
            <TabsTrigger key={category.value} value={category.value}>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {/* Achievements Grid */}
        <TabsContent value={activeCategory}>
          <div
            data-testid="achievements-grid"
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredAchievements.map(achievement => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                isUnlocked={isAchievementUnlocked(achievement.id)}
                progress={getAchievementProgress(achievement)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
} 