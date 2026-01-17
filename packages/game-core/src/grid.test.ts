import { describe, it, expect } from 'vitest';
import { createEmptyGrid, isValidPosition, getNextPosition } from './grid';
import { GAME_CONFIG } from '@snakelle/shared';

describe('Grid utilities', () => {
  it('should create an empty grid with correct dimensions', () => {
    const grid = createEmptyGrid();
    expect(grid).toHaveLength(GAME_CONFIG.GRID_SIZE);
    expect(grid[0]).toHaveLength(GAME_CONFIG.GRID_SIZE);
    expect(grid[0]?.[0]).toBe('empty');
  });

  it('should validate positions correctly', () => {
    expect(isValidPosition({ x: 0, y: 0 })).toBe(true);
    expect(isValidPosition({ x: 10, y: 10 })).toBe(true);
    expect(isValidPosition({ x: -1, y: 0 })).toBe(false);
    expect(isValidPosition({ x: 0, y: -1 })).toBe(false);
    expect(isValidPosition({ x: 20, y: 0 })).toBe(false);
    expect(isValidPosition({ x: 0, y: 20 })).toBe(false);
  });

  it('should calculate next position for UP direction', () => {
    const current = { x: 5, y: 5 };
    const next = getNextPosition(current, 'UP');
    expect(next).toEqual({ x: 5, y: 4 });
  });

  it('should calculate next position for DOWN direction', () => {
    const current = { x: 5, y: 5 };
    const next = getNextPosition(current, 'DOWN');
    expect(next).toEqual({ x: 5, y: 6 });
  });

  it('should calculate next position for LEFT direction', () => {
    const current = { x: 5, y: 5 };
    const next = getNextPosition(current, 'LEFT');
    expect(next).toEqual({ x: 4, y: 5 });
  });

  it('should calculate next position for RIGHT direction', () => {
    const current = { x: 5, y: 5 };
    const next = getNextPosition(current, 'RIGHT');
    expect(next).toEqual({ x: 6, y: 5 });
  });
});
