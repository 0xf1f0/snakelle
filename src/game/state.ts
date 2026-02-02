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
  /** Optional emoji mask - true = traversible, false = wall */
  mask?: boolean[][];
  /** Optional target cell count for win condition */
  targetCells?: number;
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
 * Creates initial game state
 * @param level - Level configuration (width, height, optional mask and targetCells)
 * @returns Initial game state
 */
export function createGameState(
  level?: Level
): GameState {
  // Use provided level or default dimensions
  const width = level?.width ?? DEFAULT_BOARD_WIDTH;
  const height = level?.height ?? DEFAULT_BOARD_HEIGHT;
  const mask = level?.mask;
  const targetCells = level?.targetCells;

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
  
  // Validate initial snake position against mask if mask exists
  if (mask) {
    for (const segment of initialSegments) {
      if (segment.y >= 0 && segment.y < height && segment.x >= 0 && segment.x < width) {
        if (!mask[segment.y][segment.x]) {
          // Initial position is outside mask - this is a bug in level design
          console.warn(`Snake segment at (${segment.x}, ${segment.y}) is outside mask`);
        }
      }
    }
  }
  
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
      mask,
      targetCells,
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
 * Checks if a position is on a traversible cell (within mask if mask exists)
 * @param pos - Position to check
 * @param level - Level with optional mask
 * @returns true if position is traversible, false otherwise
 */
export function isPositionTraversible(pos: Position, level: Level): boolean {
  // First check if position is within bounds
  if (!isPositionInBounds(pos, level)) {
    return false;
  }
  
  // If no mask, all in-bounds positions are traversible
  if (!level.mask) {
    return true;
  }
  
  // Check if position is on a true cell in the mask
  return level.mask[pos.y][pos.x] === true;
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
