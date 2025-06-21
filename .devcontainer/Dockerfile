# Use the official Node.js image as base
ARG VARIANT="18-bullseye"
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-${VARIANT}

# Install additional OS packages for game development and testing
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
        # System utilities
        curl \
        wget \
        unzip \
        git \
        ca-certificates \
        gnupg \
        lsb-release \
        # Build tools
        build-essential \
        python3 \
        python3-pip \
        # Graphics and audio libraries for game development
        libgl1-mesa-glx \
        libglib2.0-0 \
        libnss3 \
        libgconf-2-4 \
        libxss1 \
        libxtst6 \
        libxrandr2 \
        libasound2 \
        libpangocairo-1.0-0 \
        libatk1.0-0 \
        libcairo-gobject2 \
        libgtk-3-0 \
        libgdk-pixbuf2.0-0 \
        # For Playwright browsers
        libxshmfence1 \
        # PostgreSQL client
        postgresql-client \
        # Redis client
        redis-tools \
        # Image optimization tools
        imagemagick \
        webp \
        # Audio processing
        ffmpeg \
        # Development tools
        jq \
        tree \
        htop \
        vim \
        nano \
    && apt-get autoremove -y && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# Install global npm packages for development
RUN npm install -g \
    # Next.js CLI
    create-next-app@latest \
    # Package managers
    yarn \
    pnpm \
    # Development tools
    nodemon \
    concurrently \
    cross-env \
    # Testing tools
    jest-cli \
    @playwright/test \
    # Linting and formatting
    eslint \
    prettier \
    # Build tools
    webpack-cli \
    # Database tools
    prisma \
    # Supabase CLI
    supabase \
    # Deployment tools
    vercel \
    # Performance monitoring
    clinic \
    # Code quality
    typescript \
    ts-node \
    # Game development specific
    canvas \
    # Utility tools
    serve \
    http-server

# Install Playwright browsers
RUN npx playwright install --with-deps chromium firefox webkit

# Set up Docker CLI for Docker-in-Docker
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null \
    && apt-get update && apt-get install -y docker-ce-cli

# Install GitHub CLI
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && apt-get update && apt-get install -y gh

# Create development directories
RUN mkdir -p /workspace/.vscode-server/extensions \
    && mkdir -p /workspace/node_modules \
    && mkdir -p /home/node/.npm-global \
    && mkdir -p /home/node/.cache

# Set up npm global directory
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# Set up environment for game development
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV DISPLAY=:99

# Configure git safe directory
RUN git config --global --add safe.directory /workspace

# Set proper permissions
RUN chown -R node:node /home/node/.npm-global \
    && chown -R node:node /home/node/.cache

# Switch to node user
USER node

# Set working directory
WORKDIR /workspace

# Install additional Node.js development tools as node user
RUN npm config set prefix '/home/node/.npm-global' \
    && npm install -g \
        # Development server with hot reload
        @next/bundle-analyzer \
        # Testing utilities
        @storybook/cli \
        # Performance tools
        lighthouse \
        # Security audit
        npm-audit-resolver \
        # Documentation
        typedoc \
        # Code analysis
        madge \
        # Environment management
        dotenv-cli

# Create useful aliases and functions
RUN echo 'alias ll="ls -alF"' >> /home/node/.bashrc \
    && echo 'alias la="ls -A"' >> /home/node/.bashrc \
    && echo 'alias l="ls -CF"' >> /home/node/.bashrc \
    && echo 'alias ..="cd .."' >> /home/node/.bashrc \
    && echo 'alias ...="cd ../.."' >> /home/node/.bashrc \
    && echo 'alias grep="grep --color=auto"' >> /home/node/.bashrc \
    && echo 'alias fgrep="fgrep --color=auto"' >> /home/node/.bashrc \
    && echo 'alias egrep="egrep --color=auto"' >> /home/node/.bashrc \
    && echo 'export PATH="$PATH:/home/node/.npm-global/bin"' >> /home/node/.bashrc

# Add helpful development functions
RUN echo 'function nuke_modules() { rm -rf node_modules package-lock.json && npm install; }' >> /home/node/.bashrc \
    && echo 'function fresh_start() { nuke_modules && npm run dev; }' >> /home/node/.bashrc \
    && echo 'function test_all() { npm run lint && npm run type-check && npm run test && npm run build; }' >> /home/node/.bashrc \
    && echo 'function game_dev() { echo "🎮 Starting Snake Game Development Environment..."; npm run dev; }' >> /home/node/.bashrc

# Set up git hooks directory
RUN mkdir -p /workspace/.git/hooks

# Default command
CMD ["sleep", "infinity"] 