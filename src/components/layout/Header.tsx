import Link from 'next/link'

export function Header() {
  return (
    <header className="header">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="logo">
            Snake Game
          </Link>
          <div className="nav-links">
            <Link href="/game" className="nav-link">
              Play
            </Link>
            <Link href="/leaderboard" className="nav-link">
              Leaderboard
            </Link>
            <Link href="/achievements" className="nav-link">
              Achievements
            </Link>
            <Link href="/settings" className="nav-link">
              Settings
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
} 