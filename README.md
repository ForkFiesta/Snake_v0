# Snake Web App

A modern Snake game built with Next.js, TypeScript, and Tailwind CSS.

## Development Environment

This project uses Docker Compose and Dev Containers for a consistent development environment.

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd snake_v0
   ```

2. **Start the development environment**
   ```bash
   docker-compose up -d
   ```

3. **Open in VS Code with Dev Containers**
   - Install the "Dev Containers" extension
   - Press `F1` and select "Dev Containers: Reopen in Container"
   - Or use the command palette: "Remote-Containers: Reopen in Container"

### Services

- **App**: Next.js development server (http://localhost:3000)
- **Database**: PostgreSQL (localhost:5432)
- **Redis**: For caching and sessions (localhost:6379)

### Fixed Issues

The following issues were resolved in the Docker setup:

1. **Volume Mount Path**: Fixed path from `..:/workspace` to `.:/workspace`
2. **Node.js Version**: Updated from Node 18.16 to Node 20 to support latest packages
3. **Network Configuration**: Removed `network_mode: service:db` to fix networking issues
4. **Missing Directories**: Created required directories (`database/init`, `nginx`, `monitoring`)
5. **Simplified Package Installation**: Removed problematic global packages from Dockerfile
6. **Docker Compose Version**: Removed obsolete `version` field
7. **Supabase Service**: Temporarily removed to focus on core functionality

### Project Structure

```
snake_v0/
├── .devcontainer/          # Dev container configuration
├── database/               # Database initialization scripts
├── docs/                   # Documentation
├── nginx/                  # Nginx configuration
├── monitoring/             # Monitoring configuration
├── docker-compose.yml      # Docker services
└── package.json           # Node.js dependencies
```

### Development Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f app

# Rebuild services
docker-compose build

# Access the app container
docker-compose exec app bash
```

### Next Steps

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Begin implementing the Snake game logic
4. Set up testing framework
5. Configure Supabase integration

## Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animation**: Framer Motion
- **Database**: PostgreSQL with Supabase
- **Testing**: Jest + Playwright
- **Deployment**: Vercel 