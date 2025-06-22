import { Position, GameState, Direction } from '@/types/game'

export class GameEngine {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private gameState!: GameState
  private lastFrameTime: number = 0
  private gameSpeed: number = 150 // ms per frame
  private animationId: number | null = null
  private cellSize: number = 20
  private boardWidth: number
  private boardHeight: number
  private onGameOver?: (score: number) => void

  constructor(canvas: HTMLCanvasElement, onGameOver?: (score: number) => void) {
    this.canvas = canvas
    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('Could not get 2D context from canvas')
    }
    this.ctx = context
    this.onGameOver = onGameOver
    this.boardWidth = Math.floor(canvas.width / this.cellSize)
    this.boardHeight = Math.floor(canvas.height / this.cellSize)
    this.initializeGame()
  }

  private initializeGame(): void {
    const centerX = Math.floor(this.boardWidth / 2)
    const centerY = Math.floor(this.boardHeight / 2)
    
    let highScore = 0
    try {
      const storedHighScore = (typeof window !== 'undefined' ? window.localStorage : localStorage).getItem('snake-high-score')
      if (storedHighScore) {
        const parsed = parseInt(storedHighScore)
        if (!isNaN(parsed)) {
          highScore = parsed
        }
      }
    } catch (error) {
      // localStorage not available or error reading
      highScore = 0
    }
    
    this.gameState = {
      gameStatus: 'idle',
      score: 0,
      highScore: highScore,
      level: 1,
      snake: [
        { x: centerX, y: centerY },
        { x: centerX - 1, y: centerY },
        { x: centerX - 2, y: centerY }
      ],
      food: this.generateRandomFood([{ x: centerX, y: centerY }]),
      direction: 'right',
      nextDirection: 'right',
      gameMode: 'classic',
      difficulty: 'medium',
      boardSize: { width: this.boardWidth, height: this.boardHeight }
    }
  }

  private generateRandomFood(snakePositions: Position[]): Position {
    let food: Position
    let attempts = 0
    const maxAttempts = 100

    do {
      food = {
        x: Math.floor(Math.random() * this.boardWidth),
        y: Math.floor(Math.random() * this.boardHeight)
      }
      attempts++
    } while (
      attempts < maxAttempts &&
      snakePositions.some(segment => segment.x === food.x && segment.y === food.y)
    )

    return food
  }

  public startGame(): void {
    if (this.gameState.gameStatus === 'idle') {
      this.initializeGame()
    }
    this.gameState.gameStatus = 'playing'
    if (!this.animationId) {
      this.lastFrameTime = performance.now()
      this.animationId = requestAnimationFrame(this.gameLoop)
    }
  }

  public pauseGame(): void {
    this.gameState.gameStatus = 'paused'
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  public endGame(): void {
    this.gameState.gameStatus = 'gameOver'
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    
    // Update high score
    if (this.gameState.score > this.gameState.highScore) {
      this.gameState.highScore = this.gameState.score
      try {
        (typeof window !== 'undefined' ? window.localStorage : localStorage).setItem('snake-high-score', this.gameState.score.toString())
      } catch (error) {
        // localStorage not available
      }
    }

    // Call game over callback
    if (this.onGameOver) {
      this.onGameOver(this.gameState.score)
    }
  }

  private gameLoop = (currentTime: number): void => {
    const deltaTime = currentTime - this.lastFrameTime

    if (deltaTime >= this.gameSpeed) {
      this.update(deltaTime)
      this.render()
      this.lastFrameTime = currentTime
    }

    if (this.gameState.gameStatus === 'playing') {
      this.animationId = requestAnimationFrame(this.gameLoop)
    }
  }



  private updateDirection(): void {
    // Prevent reversing into itself
    const oppositeDirections: Record<Direction, Direction> = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left'
    }

    // Only apply direction change if it's not the opposite direction
    if (this.gameState.nextDirection !== oppositeDirections[this.gameState.direction]) {
      this.gameState.direction = this.gameState.nextDirection
    }
  }

  private moveSnake(): void {
    const head = { ...this.gameState.snake[0] }
    
    switch (this.gameState.direction) {
      case 'up':
        head.y -= 1
        break
      case 'down':
        head.y += 1
        break
      case 'left':
        head.x -= 1
        break
      case 'right':
        head.x += 1
        break
    }

    this.gameState.snake.unshift(head)
    
    // Check if food was eaten
    if (head.x === this.gameState.food.x && head.y === this.gameState.food.y) {
      // Don't remove tail (snake grows)
      this.gameState.score += 10
      this.gameState.food = this.generateRandomFood(this.gameState.snake)
    } else {
      // Remove tail (normal movement)
      this.gameState.snake.pop()
    }
  }

  private checkCollisions(): boolean {
    const head = this.gameState.snake[0]
    
    // Wall collision
    if (head.x < 0 || head.x >= this.boardWidth || head.y < 0 || head.y >= this.boardHeight) {
      return true
    }
    
    // Self collision
    for (let i = 1; i < this.gameState.snake.length; i++) {
      if (head.x === this.gameState.snake[i].x && head.y === this.gameState.snake[i].y) {
        return true
      }
    }
    
    return false
  }

  private checkFoodConsumption(): void {
    // Food consumption is already handled in moveSnake method
    // This method is kept for potential future enhancements
  }

  private updateLevel(): void {
    const newLevel = Math.floor(this.gameState.score / 100) + 1
    if (newLevel > this.gameState.level) {
      this.gameState.level = newLevel
      // Increase speed slightly with each level
      this.gameSpeed = Math.max(50, 150 - (newLevel - 1) * 10)
    }
  }



  private clearCanvas(): void {
    this.ctx.fillStyle = '#000000'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  private drawBoard(): void {
    // Draw grid lines
    this.ctx.strokeStyle = '#333333'
    this.ctx.lineWidth = 1
    
    // Vertical lines
    for (let x = 0; x <= this.boardWidth; x++) {
      this.ctx.beginPath()
      this.ctx.moveTo(x * this.cellSize, 0)
      this.ctx.lineTo(x * this.cellSize, this.canvas.height)
      this.ctx.stroke()
    }
    
    // Horizontal lines
    for (let y = 0; y <= this.boardHeight; y++) {
      this.ctx.beginPath()
      this.ctx.moveTo(0, y * this.cellSize)
      this.ctx.lineTo(this.canvas.width, y * this.cellSize)
      this.ctx.stroke()
    }
  }

  private drawSnake(): void {
    this.gameState.snake.forEach((segment, index) => {
      const x = segment.x * this.cellSize
      const y = segment.y * this.cellSize
      
      if (index === 0) {
        // Snake head
        this.ctx.fillStyle = '#4ade80' // Green-400
        this.ctx.fillRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2)
        
        // Draw eyes
        this.ctx.fillStyle = '#000000'
        const eyeSize = 3
        const eyeOffset = 6
        
        switch (this.gameState.direction) {
          case 'right':
            this.ctx.fillRect(x + eyeOffset + 4, y + 4, eyeSize, eyeSize)
            this.ctx.fillRect(x + eyeOffset + 4, y + 13, eyeSize, eyeSize)
            break
          case 'left':
            this.ctx.fillRect(x + 4, y + 4, eyeSize, eyeSize)
            this.ctx.fillRect(x + 4, y + 13, eyeSize, eyeSize)
            break
          case 'up':
            this.ctx.fillRect(x + 4, y + 4, eyeSize, eyeSize)
            this.ctx.fillRect(x + 13, y + 4, eyeSize, eyeSize)
            break
          case 'down':
            this.ctx.fillRect(x + 4, y + eyeOffset + 4, eyeSize, eyeSize)
            this.ctx.fillRect(x + 13, y + eyeOffset + 4, eyeSize, eyeSize)
            break
        }
      } else {
        // Snake body
        this.ctx.fillStyle = '#22c55e' // Green-500
        this.ctx.fillRect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4)
      }
    })
  }

  private drawFood(): void {
    const x = this.gameState.food.x * this.cellSize
    const y = this.gameState.food.y * this.cellSize
    
    this.ctx.fillStyle = '#ef4444' // Red-500
    this.ctx.beginPath()
    this.ctx.arc(
      x + this.cellSize / 2,
      y + this.cellSize / 2,
      (this.cellSize - 4) / 2,
      0,
      2 * Math.PI
    )
    this.ctx.fill()
  }

  public changeDirection(direction: Direction): void {
    this.gameState.nextDirection = direction
  }

  public getGameState(): GameState {
    return { ...this.gameState }
  }

  public resetGame(): void {
    this.endGame()
    this.initializeGame()
  }

  // Public methods for testing and external control
  public setScore(score: number): void {
    this.gameState.score = score
  }

  public setLevel(level: number): void {
    this.gameState.level = level
  }

  public setSnakePosition(positions: Position[]): void {
    this.gameState.snake = [...positions]
    // If only head is provided, add a minimal body
    if (positions.length === 1) {
      this.gameState.snake.push({ x: positions[0].x + 1, y: positions[0].y })
      this.gameState.snake.push({ x: positions[0].x + 2, y: positions[0].y })
    }
    // Regenerate food to ensure it's not on the new snake position
    this.gameState.food = this.generateRandomFood(this.gameState.snake)
  }

  public setFoodPosition(position: Position): void {
    this.gameState.food = { ...position }
  }

  public getGameSpeed(): number {
    return this.gameSpeed
  }

  public render(): void {
    this.clearCanvas()
    this.drawBoard()
    this.drawSnake()
    this.drawFood()
  }

  public update(deltaTime: number): void {
    if (this.gameState.gameStatus !== 'playing') return

    this.updateDirection()
    this.moveSnake()
    
    if (this.checkCollisions()) {
      this.endGame()
      return
    }
    
    this.checkFoodConsumption()
    this.updateLevel()
  }
} 