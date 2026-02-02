/**
 * Tests for game state management
 */

import { describe, it, expect } from 'vitest';
import {
  createGameState,
  isPositionInBounds,
  isPositionTraversible,
  getNextPosition,
  DEFAULT_BOARD_WIDTH,
  DEFAULT_BOARD_HEIGHT,
  type Position,
  type Level,
} from './state';

describe('createGameState', () => {
  it('should create initial game state with default dimensions', () => {
    const state = createGameState();
    
    expect(state.level.width).toBe(DEFAULT_BOARD_WIDTH);
    expect(state.level.height).toBe(DEFAULT_BOARD_HEIGHT);
    expect(state.snake.segments).toHaveLength(5);
    expect(state.snake.direction).toBe('right');
    expect(state.status).toBe('playing');
  });

  it('should create initial game state with custom dimensions', () => {
    const width = 20;
    const height = 30;
    const state = createGameState(width, height);
    
    expect(state.level.width).toBe(width);
    expect(state.level.height).toBe(height);
  });

  it('should start snake at center of board', () => {
    const state = createGameState();
    const head = state.snake.segments[0];
    
    expect(head.x).toBe(Math.floor(DEFAULT_BOARD_WIDTH / 2));
    expect(head.y).toBe(Math.floor(DEFAULT_BOARD_HEIGHT / 2));
  });

  it('should create snake with 5 segments', () => {
    const state = createGameState();
    
    expect(state.snake.segments).toHaveLength(5);
  });

  it('should initialize snake heading right', () => {
    const state = createGameState();
    const segments = state.snake.segments;
    
    // All segments should be on the same Y coordinate
    const y = segments[0].y;
    expect(segments.every(seg => seg.y === y)).toBe(true);
    
    // X coordinates should decrease from head to tail
    for (let i = 0; i < segments.length - 1; i++) {
      expect(segments[i].x).toBe(segments[i + 1].x + 1);
    }
  });

  it('should mark initial snake positions as visited', () => {
    const state = createGameState();
    
    for (const segment of state.snake.segments) {
      expect(state.visited[segment.y][segment.x]).toBe(true);
    }
  });

  it('should count visited cells correctly', () => {
    const state = createGameState();
    
    // All 5 initial segments should be counted
    expect(state.visitedCount).toBe(5);
  });

  it('should initialize visited grid with correct dimensions', () => {
    const width = 10;
    const height = 15;
    const state = createGameState(width, height);
    
    expect(state.visited).toHaveLength(height);
    expect(state.visited[0]).toHaveLength(width);
  });
});

describe('isPositionInBounds', () => {
  const level: Level = { width: 16, height: 24 };

  it('should return true for position within bounds', () => {
    const pos: Position = { x: 8, y: 12 };
    expect(isPositionInBounds(pos, level)).toBe(true);
  });

  it('should return true for position at top-left corner', () => {
    const pos: Position = { x: 0, y: 0 };
    expect(isPositionInBounds(pos, level)).toBe(true);
  });

  it('should return true for position at bottom-right corner', () => {
    const pos: Position = { x: 15, y: 23 };
    expect(isPositionInBounds(pos, level)).toBe(true);
  });

  it('should return false for position with negative x', () => {
    const pos: Position = { x: -1, y: 12 };
    expect(isPositionInBounds(pos, level)).toBe(false);
  });

  it('should return false for position with negative y', () => {
    const pos: Position = { x: 8, y: -1 };
    expect(isPositionInBounds(pos, level)).toBe(false);
  });

  it('should return false for position with x >= width', () => {
    const pos: Position = { x: 16, y: 12 };
    expect(isPositionInBounds(pos, level)).toBe(false);
  });

  it('should return false for position with y >= height', () => {
    const pos: Position = { x: 8, y: 24 };
    expect(isPositionInBounds(pos, level)).toBe(false);
  });
});

describe('getNextPosition', () => {
  it('should move up correctly', () => {
    const pos: Position = { x: 5, y: 10 };
    const next = getNextPosition(pos, 'up');
    
    expect(next).toEqual({ x: 5, y: 9 });
  });

  it('should move down correctly', () => {
    const pos: Position = { x: 5, y: 10 };
    const next = getNextPosition(pos, 'down');
    
    expect(next).toEqual({ x: 5, y: 11 });
  });

  it('should move left correctly', () => {
    const pos: Position = { x: 5, y: 10 };
    const next = getNextPosition(pos, 'left');
    
    expect(next).toEqual({ x: 4, y: 10 });
  });

  it('should move right correctly', () => {
    const pos: Position = { x: 5, y: 10 };
    const next = getNextPosition(pos, 'right');
    
    expect(next).toEqual({ x: 6, y: 10 });
  });

  it('should not modify original position', () => {
    const pos: Position = { x: 5, y: 10 };
    const originalPos = { ...pos };
    
    getNextPosition(pos, 'up');
    
    expect(pos).toEqual(originalPos);
  });
});

describe('isPositionTraversible', () => {
  it('should return true for position within bounds when no mask', () => {
    const level: Level = { width: 10, height: 10 };
    const pos: Position = { x: 5, y: 5 };
    
    expect(isPositionTraversible(pos, level)).toBe(true);
  });

  it('should return false for position out of bounds when no mask', () => {
    const level: Level = { width: 10, height: 10 };
    const pos: Position = { x: 15, y: 5 };
    
    expect(isPositionTraversible(pos, level)).toBe(false);
  });

  it('should return true for traversable cell with mask', () => {
    const mask = [
      [true, true, false],
      [true, true, false],
      [false, false, false]
    ];
    const level: Level = { width: 3, height: 3, mask, targetCells: 4 };
    const pos: Position = { x: 1, y: 1 };
    
    expect(isPositionTraversible(pos, level)).toBe(true);
  });

  it('should return false for non-traversable cell with mask', () => {
    const mask = [
      [true, true, false],
      [true, true, false],
      [false, false, false]
    ];
    const level: Level = { width: 3, height: 3, mask, targetCells: 4 };
    const pos: Position = { x: 2, y: 0 };
    
    expect(isPositionTraversible(pos, level)).toBe(false);
  });
});

describe('createGameState with mask', () => {
  it('should create game state with mask level', () => {
    const mask = [
      [true, true, true, true, true],
      [true, true, true, true, true],
      [true, true, true, true, true],
      [true, true, true, true, true],
      [true, true, true, true, true]
    ];
    const level: Level = { width: 5, height: 5, mask, targetCells: 25 };
    const state = createGameState(level);
    
    expect(state.level.width).toBe(5);
    expect(state.level.height).toBe(5);
    expect(state.level.mask).toBe(mask);
    expect(state.level.targetCells).toBe(25);
  });

  it('should only mark traversable cells as visited', () => {
    const mask = [
      [false, false, false, false, false],
      [false, true, true, true, false],
      [false, true, true, true, false],
      [false, true, true, true, false],
      [false, false, false, false, false]
    ];
    const level: Level = { width: 5, height: 5, mask, targetCells: 9 };
    const state = createGameState(level);
    
    // Starting position should be in the center (2, 2) which is traversable
    // All initial snake segments should be marked as visited
    for (const segment of state.snake.segments) {
      if (mask[segment.y] && mask[segment.y][segment.x]) {
        expect(state.visited[segment.y][segment.x]).toBe(true);
      }
    }
  });
});
