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
 * Level type with optional emoji mask support
 */
export interface Level {
  width: number;
  height: number;
  /** Optional emoji mask - true = traversable, false = wall */
  mask?: boolean[][];
  /** Total number of traversable cells (for win condition) */
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
 * @param levelOrWidth - Either a Level object or board width (default: 16)
 * @param height - Board height (default: 24), only used if first param is a number
 * @returns Initial game state
 */
export function createGameState(
  levelOrWidth: Level | number = DEFAULT_BOARD_WIDTH,
  height: number = DEFAULT_BOARD_HEIGHT
): GameState {
  // Determine level parameters
  const level: Level = typeof levelOrWidth === 'number'
    ? { width: levelOrWidth, height }
    : levelOrWidth;

  const { width, mask } = level;
  const boardHeight = level.height;

  // Start the snake at the center of the board with length 5 for easier self-collision testing
  const startX = Math.floor(width / 2);
  const startY = Math.floor(boardHeight / 2);

  // Initialize visited grid
  // All cells start as not visited (false)
  const visited: boolean[][] = Array.from({ length: boardHeight }, () =>
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
  
  // Mark all starting positions as visited (only if they're traversable)
  let visitedCount = 0;
  for (const segment of initialSegments) {
    // Only mark as visited if within bounds and traversable
    if (segment.y >= 0 && segment.y < boardHeight && 
        segment.x >= 0 && segment.x < width) {
      // Check mask if it exists
      if (!mask || mask[segment.y][segment.x]) {
        if (!visited[segment.y][segment.x]) {
          visited[segment.y][segment.x] = true;
          visitedCount++;
        }
      }
    }
  }

  return {
    level,
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
 * Checks if a position is traversable (within bounds and not blocked by mask)
 */
export function isPositionTraversible(pos: Position, level: Level): boolean {
  // First check if in bounds
  if (!isPositionInBounds(pos, level)) {
    return false;
  }
  
  // If there's a mask, check if this cell is traversable
  if (level.mask) {
    return level.mask[pos.y][pos.x];
  }
  
  // No mask means all cells are traversable
  return true;
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
