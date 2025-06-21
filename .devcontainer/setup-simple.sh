#!/bin/bash

# Snake Web App Development Environment Setup Script
# This script runs after the devcontainer is created

set -e

echo "🎮 Setting up Snake Web App Development Environment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Set up proper permissions
print_step "Setting up permissions..."
sudo chown -R node:node /workspace || true
sudo chown -R node:node /home/node || true

# Create basic directory structure if it doesn't exist
print_step "Creating directory structure..."
mkdir -p src/{app,components,lib,types}
mkdir -p public/{icons,sounds,images}
mkdir -p __tests__/{components,lib,e2e}

# Set up git configuration
print_step "Configuring git..."
git config --global --add safe.directory /workspace
git config --global user.name "Dev Container User" || true
git config --global user.email "dev@example.com" || true

print_status "Development environment setup complete! 🚀"
print_status "You can now start developing your Snake Web App."
print_status ""
print_status "Next steps:"
print_status "1. Run 'npm install' to install dependencies"
print_status "2. Run 'npm run dev' to start the development server"
print_status "3. Open http://localhost:3000 to view your app" 