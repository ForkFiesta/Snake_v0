import Link from 'next/link'
import { cn } from '@/lib/utils'

interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  return (
    <nav className={cn('navigation', className)}>
      <Link href="/" className="nav-item">
        Home
      </Link>
      <Link href="/game" className="nav-item">
        Play
      </Link>
      <Link href="/leaderboard" className="nav-item">
        Leaderboard
      </Link>
      <Link href="/achievements" className="nav-item">
        Achievements
      </Link>
      <Link href="/settings" className="nav-item">
        Settings
      </Link>
    </nav>
  )
} 