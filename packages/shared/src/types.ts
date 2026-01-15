/**
 * 2D coordinate position
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Direction for movement
 */
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

/**
 * Cell state in the game grid
 */
export type CellState = 'empty' | 'snake' | 'target';

/**
 * Game grid representation
 */
export type Grid = CellState[][];
