export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>&copy; {currentYear} Snake Game. Built with Next.js and TypeScript.</p>
        </div>
      </div>
    </footer>
  )
} 