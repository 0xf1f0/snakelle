/**
 * Tests for game update logic
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { updateGameState, changeDirection } from './update';
import { createGameState, type GameState } from './state';

describe('updateGameState', () => {
  let state: GameState;

  beforeEach(() => {
    state = createGameState(10, 10);
  });

  it('should move snake forward in current direction', () => {
    const initialHead = state.snake.segments[0];
    const expectedNewHead = { x: initialHead.x + 1, y: initialHead.y };
    
    updateGameState(state);
    
    expect(state.snake.segments[0]).toEqual(expectedNewHead);
  });

  it('should maintain snake length', () => {
    const initialLength = state.snake.segments.length;
    
    updateGameState(state);
    
    expect(state.snake.segments).toHaveLength(initialLength);
  });

  it('should mark new position as visited', () => {
    // Move to an unvisited position
    state.snake.direction = 'up';
    const head = state.snake.segments[0];
    const nextPos = { x: head.x, y: head.y - 1 };
    
    // Ensure it's not visited
    state.visited[nextPos.y][nextPos.x] = false;
    
    updateGameState(state);
    
    expect(state.visited[nextPos.y][nextPos.x]).toBe(true);
  });

  it('should not increase visitedCount when revisiting a cell', () => {
    // Move in a square pattern to revisit a cell
    changeDirection(state, 'up');
    updateGameState(state);
    changeDirection(state, 'left');
    updateGameState(state);
    changeDirection(state, 'down');
    updateGameState(state);
    changeDirection(state, 'right');
    updateGameState(state);
    
    // We should have visited some new cells, but the count should be stable after revisiting
    const visitedAfterLoop = state.visitedCount;
    
    // Move right again to revisit
    updateGameState(state);
    
    expect(state.visitedCount).toBe(visitedAfterLoop);
  });

  it('should detect collision with top wall', () => {
    // Place snake near top edge
    state.snake.segments = [{ x: 5, y: 0 }];
    state.snake.direction = 'up';
    
    updateGameState(state);
    
    expect(state.status).toBe('lost');
  });

  it('should detect collision with bottom wall', () => {
    // Place snake near bottom edge
    state.snake.segments = [{ x: 5, y: 9 }];
    state.snake.direction = 'down';
    
    updateGameState(state);
    
    expect(state.status).toBe('lost');
  });

  it('should detect collision with left wall', () => {
    // Place snake near left edge
    state.snake.segments = [{ x: 0, y: 5 }];
    state.snake.direction = 'left';
    
    updateGameState(state);
    
    expect(state.status).toBe('lost');
  });

  it('should detect collision with right wall', () => {
    // Place snake near right edge
    state.snake.segments = [{ x: 9, y: 5 }];
    state.snake.direction = 'right';
    
    updateGameState(state);
    
    expect(state.status).toBe('lost');
  });

  it('should detect self-collision', () => {
    // Create a snake that will collide with itself
    state.snake.segments = [
      { x: 5, y: 5 },  // head
      { x: 4, y: 5 },  // body
      { x: 4, y: 4 },  // body
      { x: 5, y: 4 },  // body - will be where head moves next
    ];
    state.snake.direction = 'up';
    
    updateGameState(state);
    
    expect(state.status).toBe('lost');
  });

  it('should not update when status is not playing', () => {
    state.status = 'lost';
    const initialSegments = [...state.snake.segments];
    
    updateGameState(state);
    
    expect(state.snake.segments).toEqual(initialSegments);
  });

  it('should not update when status is won', () => {
    state.status = 'won';
    const initialSegments = [...state.snake.segments];
    
    updateGameState(state);
    
    expect(state.snake.segments).toEqual(initialSegments);
  });
});

describe('changeDirection', () => {
  let state: GameState;

  beforeEach(() => {
    state = createGameState();
  });

  it('should change direction when valid', () => {
    state.snake.direction = 'right';
    
    changeDirection(state, 'up');
    
    expect(state.snake.direction).toBe('up');
  });

  it('should prevent reversing direction (right to left)', () => {
    state.snake.direction = 'right';
    
    changeDirection(state, 'left');
    
    expect(state.snake.direction).toBe('right');
  });

  it('should prevent reversing direction (left to right)', () => {
    state.snake.direction = 'left';
    
    changeDirection(state, 'right');
    
    expect(state.snake.direction).toBe('left');
  });

  it('should prevent reversing direction (up to down)', () => {
    state.snake.direction = 'up';
    
    changeDirection(state, 'down');
    
    expect(state.snake.direction).toBe('up');
  });

  it('should prevent reversing direction (down to up)', () => {
    state.snake.direction = 'down';
    
    changeDirection(state, 'up');
    
    expect(state.snake.direction).toBe('down');
  });

  it('should allow perpendicular direction changes', () => {
    state.snake.direction = 'right';
    
    changeDirection(state, 'up');
    expect(state.snake.direction).toBe('up');
    
    changeDirection(state, 'left');
    expect(state.snake.direction).toBe('left');
    
    changeDirection(state, 'down');
    expect(state.snake.direction).toBe('down');
  });

  it('should not change direction when status is not playing', () => {
    state.status = 'lost';
    state.snake.direction = 'right';
    
    changeDirection(state, 'up');
    
    expect(state.snake.direction).toBe('right');
  });
});

describe('updateGameState with emoji mask', () => {
  it('should detect collision with mask boundary', () => {
    const mask = [
      [false, false, false, false, false],
      [false, true, true, true, false],
      [false, true, true, true, false],
      [false, true, true, true, false],
      [false, false, false, false, false]
    ];
    const level = { width: 5, height: 5, mask, targetCells: 9 };
    const state = createGameState(level);
    
    // Place snake near mask boundary
    state.snake.segments = [{ x: 1, y: 1 }];
    state.snake.direction = 'left'; // Moving left would hit a false cell
    
    updateGameState(state);
    
    expect(state.status).toBe('lost');
  });

  it('should allow movement within mask area', () => {
    const mask = [
      [false, false, false, false, false],
      [false, true, true, true, false],
      [false, true, true, true, false],
      [false, true, true, true, false],
      [false, false, false, false, false]
    ];
    const level = { width: 5, height: 5, mask, targetCells: 9 };
    const state = createGameState(level);
    
    // Place snake in center of mask area
    state.snake.segments = [{ x: 2, y: 2 }];
    state.snake.direction = 'right'; // Moving right stays in mask
    
    const initialStatus = state.status;
    updateGameState(state);
    
    expect(state.status).toBe(initialStatus); // Should still be playing
    expect(state.snake.segments[0]).toEqual({ x: 3, y: 2 });
  });

  it('should set status to won when all traversable cells are visited', () => {
    // Create a very small mask
    const mask = [
      [true, true],
      [true, true]
    ];
    const level = { width: 2, height: 2, mask, targetCells: 4 };
    const state = createGameState(level);
    
    // Start with 1 cell visited
    state.snake.segments = [{ x: 0, y: 0 }];
    state.visited = [
      [true, false],
      [false, false]
    ];
    state.visitedCount = 1;
    state.snake.direction = 'right';
    
    // Move right: visit (1, 0)
    updateGameState(state);
    expect(state.visitedCount).toBe(2);
    expect(state.status).toBe('playing');
    
    // Move down: visit (1, 1)
    state.snake.direction = 'down';
    updateGameState(state);
    expect(state.visitedCount).toBe(3);
    expect(state.status).toBe('playing');
    
    // Move left: visit (0, 1) - this should trigger win
    state.snake.direction = 'left';
    updateGameState(state);
    expect(state.visitedCount).toBe(4);
    expect(state.status).toBe('won');
  });
});
