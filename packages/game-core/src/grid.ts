import type { Grid, Position } from '@snakelle/shared';
import { GAME_CONFIG } from '@snakelle/shared';

/**
 * Creates an empty game grid
 */
export function createEmptyGrid(): Grid {
  const { GRID_SIZE } = GAME_CONFIG;
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => 'empty')
  );
}

/**
 * Checks if a position is within grid bounds
 */
export function isValidPosition(pos: Position): boolean {
  const { GRID_SIZE } = GAME_CONFIG;
  return pos.x >= 0 && pos.x < GRID_SIZE && pos.y >= 0 && pos.y < GRID_SIZE;
}

/**
 * Calculates the next position based on direction
 */
export function getNextPosition(
  current: Position,
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
): Position {
  switch (direction) {
    case 'UP':
      return { x: current.x, y: current.y - 1 };
    case 'DOWN':
      return { x: current.x, y: current.y + 1 };
    case 'LEFT':
      return { x: current.x - 1, y: current.y };
    case 'RIGHT':
      return { x: current.x + 1, y: current.y };
  }
}
