/**
 * Core game state types for Snakelle
 */

/**
 * Movement directions for the snake
 */
export type Direction = 'up' | 'down' | 'left' | 'right';

/**
 * A position on the game grid
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * The snake entity
 */
export interface Snake {
  segments: Position[];
  direction: Direction;
}

/**
 * Game status values
 */
export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

/**
 * Placeholder level type (to be defined later)
 */
export interface Level {
  width: number;
  height: number;
}

/**
 * Complete game state
 */
export interface GameState {
  /** The current level */
  level: Level;
  /** The snake entity */
  snake: Snake;
  /** Grid of visited cells */
  visited: boolean[][];
  /** Count of visited cells */
  visitedCount: number;
  /** Current game status */
  status: GameStatus;
  /** Timestamp of last game tick */
  lastTickTime: number;
}

// Default board dimensions
export const DEFAULT_BOARD_WIDTH = 16;
export const DEFAULT_BOARD_HEIGHT = 24;

/**
 * Creates initial game state with a simple rectangular board
 * @param width - Board width (default: 16)
 * @param height - Board height (default: 24)
 * @returns Initial game state
 */
export function createGameState(
  width: number = DEFAULT_BOARD_WIDTH,
  height: number = DEFAULT_BOARD_HEIGHT
): GameState {
  // Start the snake at the center of the board with length 5 for easier self-collision testing
  const startX = Math.floor(width / 2);
  const startY = Math.floor(height / 2);

  // Initialize visited grid (all false initially)
  const visited: boolean[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false)
  );
  
  // Create initial snake segments (length 5, heading right)
  const initialSegments = [
    { x: startX, y: startY },      // head
    { x: startX - 1, y: startY },  // body
    { x: startX - 2, y: startY },  // body
    { x: startX - 3, y: startY },  // body
    { x: startX - 4, y: startY },  // tail
  ];
  
  // Mark all starting positions as visited
  let visitedCount = 0;
  for (const segment of initialSegments) {
    if (!visited[segment.y][segment.x]) {
      visited[segment.y][segment.x] = true;
      visitedCount++;
    }
  }

  return {
    level: {
      width,
      height,
    },
    snake: {
      segments: initialSegments,
      direction: 'right',
    },
    visited,
    visitedCount,
    status: 'playing',
    lastTickTime: 0,
  };
}

/**
 * Checks if a position is within the board boundaries
 */
export function isPositionInBounds(pos: Position, level: Level): boolean {
  return pos.x >= 0 && pos.x < level.width && pos.y >= 0 && pos.y < level.height;
}

/**
 * Gets the next position based on current position and direction
 */
export function getNextPosition(pos: Position, direction: Direction): Position {
  switch (direction) {
    case 'up':
      return { x: pos.x, y: pos.y - 1 };
    case 'down':
      return { x: pos.x, y: pos.y + 1 };
    case 'left':
      return { x: pos.x - 1, y: pos.y };
    case 'right':
      return { x: pos.x + 1, y: pos.y };
  }
}
