/**
 * Fixed timestep game loop for Snakelle
 */

export interface GameLoop {
  start(): void;
  stop(): void;
  isRunning(): boolean;
}

export interface GameLoopCallbacks {
  update: () => void;
  draw: () => void;
}

export const DEFAULT_TICK_RATE = 200; // ms per tick (5 ticks per second)

/**
 * Creates a fixed timestep game loop
 * @param callbacks - The update and draw functions to call
 * @param tickRate - Time between game ticks in milliseconds (default: 200ms)
 */
export function createGameLoop(
  callbacks: GameLoopCallbacks,
  tickRate: number = DEFAULT_TICK_RATE
): GameLoop {
  let running = false;
  let lastTickTime = 0;
  let animationFrameId: number | null = null;

  function gameLoop(currentTime: number): void {
    if (!running) return;

    // Fixed timestep logic: only update when enough time has passed
    const timeSinceLastTick = currentTime - lastTickTime;
    
    if (timeSinceLastTick >= tickRate) {
      callbacks.update();
      lastTickTime = currentTime;
    }

    // Always draw (for smooth rendering)
    callbacks.draw();

    // Schedule next frame
    animationFrameId = requestAnimationFrame(gameLoop);
  }

  return {
    start(): void {
      if (running) return;
      
      running = true;
      lastTickTime = performance.now();
      animationFrameId = requestAnimationFrame(gameLoop);
    },

    stop(): void {
      running = false;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    },

    isRunning(): boolean {
      return running;
    }
  };
}
