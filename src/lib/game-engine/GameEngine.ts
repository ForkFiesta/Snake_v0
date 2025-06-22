import { Position, GameState, Direction } from '@/types/game'

export class GameEngine {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private gameState!: GameState
  private lastFrameTime: number = 0
  private gameSpeed: number = 150 // ms per frame
  private animationId: number | null = null

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('Could not get 2D context from canvas')
    }
    this.ctx = context
    this.initializeGame()
  }

  private initializeGame(): void {
    // TODO: Initialize game state
    this.gameState = {
      gameStatus: 'idle',
      score: 0,
      highScore: 0,
      level: 1,
      snake: [{ x: 10, y: 10 }],
      food: { x: 15, y: 15 },
      direction: 'right',
      nextDirection: 'right'
    }
  }

  public startGame(): void {
    this.gameState.gameStatus = 'playing'
    this.gameLoop(performance.now())
  }

  public pauseGame(): void {
    this.gameState.gameStatus = 'paused'
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
  }

  public endGame(): void {
    this.gameState.gameStatus = 'gameOver'
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
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

  private update(deltaTime: number): void {
    // TODO: Implement game logic updates
    this.moveSnake()
    this.checkCollisions()
    this.checkFoodConsumption()
    this.updateScore()
  }

  private render(): void {
    // TODO: Implement rendering logic
    this.clearCanvas()
    this.drawBoard()
    this.drawSnake()
    this.drawFood()
  }

  private moveSnake(): void {
    // TODO: Implement snake movement
  }

  private checkCollisions(): boolean {
    // TODO: Implement collision detection
    return false
  }

  private checkFoodConsumption(): void {
    // TODO: Implement food consumption logic
  }

  private updateScore(): void {
    // TODO: Implement score update logic
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  private drawBoard(): void {
    // TODO: Implement board drawing
  }

  private drawSnake(): void {
    // TODO: Implement snake drawing
  }

  private drawFood(): void {
    // TODO: Implement food drawing
  }

  public changeDirection(direction: Direction): void {
    // TODO: Implement direction change logic
    this.gameState.nextDirection = direction
  }

  public getGameState(): GameState {
    return { ...this.gameState }
  }
} 