/**
 * Tests for emoji mask integration into game logic
 */

import { describe, it, expect } from 'vitest';
import { createGameState, isPositionTraversible, type Level } from './state';
import { updateGameState } from './update';

describe('mask-constrained movement', () => {
  it('should treat positions outside mask as non-traversible', () => {
    // Create a simple 5x5 mask with a cross shape
    const mask = [
      [false, false, true,  false, false],
      [false, false, true,  false, false],
      [true,  true,  true,  true,  true ],
      [false, false, true,  false, false],
      [false, false, true,  false, false],
    ];
    
    const level: Level = { width: 5, height: 5, mask };
    
    // Position in center (true in mask)
    expect(isPositionTraversible({ x: 2, y: 2 }, level)).toBe(true);
    
    // Position outside mask (false in mask)
    expect(isPositionTraversible({ x: 0, y: 0 }, level)).toBe(false);
    expect(isPositionTraversible({ x: 4, y: 4 }, level)).toBe(false);
  });

  it('should cause loss when snake moves onto a false mask cell', () => {
    // Create a simple mask where left side is false
    const mask = [
      [false, true, true, true, true],
      [false, true, true, true, true],
      [false, true, true, true, true],
      [false, true, true, true, true],
      [false, true, true, true, true],
    ];
    
    const state = createGameState({ 
      width: 5, 
      height: 5, 
      mask,
      targetCells: 20 // 4x5 true cells
    });
    
    // Position snake at x=1 (on true cell) heading left
    state.snake.segments = [{ x: 1, y: 2 }];
    state.snake.direction = 'left';
    state.status = 'playing';
    
    // Moving left should hit the mask boundary (false cell)
    updateGameState(state);
    
    expect(state.status).toBe('lost');
  });

  it('should allow movement within mask boundaries', () => {
    // Create a simple 5x5 mask that's all true
    const mask = Array.from({ length: 5 }, () => 
      Array.from({ length: 5 }, () => true)
    );
    
    const state = createGameState({ 
      width: 5, 
      height: 5, 
      mask,
      targetCells: 25
    });
    
    // Position snake in center heading right
    state.snake.segments = [
      { x: 2, y: 2 },
      { x: 1, y: 2 },
    ];
    state.snake.direction = 'right';
    state.status = 'playing';
    
    // Moving right should succeed
    updateGameState(state);
    
    expect(state.status).toBe('playing');
    expect(state.snake.segments[0]).toEqual({ x: 3, y: 2 });
  });

  it('should work correctly when no mask is provided', () => {
    const state = createGameState({ width: 10, height: 10 });
    
    // All in-bounds positions should be traversible
    expect(isPositionTraversible({ x: 0, y: 0 }, state.level)).toBe(true);
    expect(isPositionTraversible({ x: 9, y: 9 }, state.level)).toBe(true);
    
    // Out of bounds should not be traversible
    expect(isPositionTraversible({ x: 10, y: 0 }, state.level)).toBe(false);
    expect(isPositionTraversible({ x: 0, y: 10 }, state.level)).toBe(false);
  });
});

describe('visited cell tracking with mask', () => {
  it('should increment visitedCount when entering new traversible cell', () => {
    const mask = Array.from({ length: 5 }, () => 
      Array.from({ length: 5 }, () => true)
    );
    
    const state = createGameState({ 
      width: 5, 
      height: 5, 
      mask,
      targetCells: 25
    });
    
    // Clear initial visited state to start fresh
    const initialCount = state.visitedCount;
    
    // Position snake heading right
    state.snake.segments = [{ x: 2, y: 2 }];
    state.snake.direction = 'right';
    
    // Move and check count increases
    updateGameState(state);
    
    expect(state.visitedCount).toBeGreaterThan(initialCount);
  });

  it('should not increment visitedCount when revisiting a cell', () => {
    const mask = Array.from({ length: 5 }, () => 
      Array.from({ length: 5 }, () => true)
    );
    
    const state = createGameState({ 
      width: 5, 
      height: 5, 
      mask,
      targetCells: 25
    });
    
    // Position snake
    state.snake.segments = [
      { x: 2, y: 2 },
      { x: 1, y: 2 },
    ];
    state.snake.direction = 'right';
    
    // Mark next position as already visited
    state.visited[2][3] = true;
    const countBefore = state.visitedCount;
    
    // Move to already visited cell
    updateGameState(state);
    
    expect(state.visitedCount).toBe(countBefore);
  });
});

describe('win condition with mask', () => {
  it('should set status to won when all mask cells are visited', () => {
    // Create a simple horizontal line mask - 3 cells wide
    const mask = [
      [false, false, false, false, false],
      [false, false, false, false, false],
      [true,  true,  true,  false, false],
      [false, false, false, false, false],
      [false, false, false, false, false],
    ];
    
    const state = createGameState({ 
      width: 5, 
      height: 5, 
      mask,
      targetCells: 3 // 3 cells to visit
    });
    
    // Reset the visited grid completely
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        state.visited[y][x] = false;
      }
    }
    
    // Position snake at start of line, heading right
    // Start with just head segment
    state.snake.segments = [
      { x: 0, y: 2 },
    ];
    state.snake.direction = 'right';
    state.status = 'playing';
    state.visitedCount = 1;
    state.visited[2][0] = true;
    
    // Move right to second cell
    updateGameState(state);
    expect(state.status).toBe('playing');
    expect(state.visitedCount).toBe(2);
    expect(state.visited[2][1]).toBe(true);
    
    // Move right to third cell - should win
    updateGameState(state);
    expect(state.status).toBe('won');
    expect(state.visitedCount).toBe(3);
    expect(state.visited[2][2]).toBe(true);
  });

  it('should not win if not all mask cells are visited', () => {
    const mask = [
      [true, true, true],
      [true, true, true],
      [true, true, true],
    ];
    
    const state = createGameState({ 
      width: 3, 
      height: 3, 
      mask,
      targetCells: 9
    });
    
    // Only visit 5 cells out of 9
    state.visitedCount = 5;
    state.status = 'playing';
    
    updateGameState(state);
    
    expect(state.status).toBe('playing');
  });

  it('should not check win condition when no targetCells is defined', () => {
    const state = createGameState({ width: 10, height: 10 });
    
    // Even with high visitedCount, should not win without targetCells
    state.visitedCount = 100;
    state.status = 'playing';
    
    updateGameState(state);
    
    expect(state.status).toBe('playing');
  });

  it('should win exactly when visitedCount equals targetCells', () => {
    // Create a simple line mask
    const mask = [
      [false, false, false, false, false],
      [false, false, false, false, false],
      [true,  true,  true,  true,  false],
      [false, false, false, false, false],
      [false, false, false, false, false],
    ];
    
    const state = createGameState({ 
      width: 5, 
      height: 5, 
      mask,
      targetCells: 4
    });
    
    // Position snake having visited 3 cells, about to visit 4th
    state.snake.segments = [{ x: 2, y: 2 }];
    state.snake.direction = 'right';
    state.status = 'playing';
    state.visitedCount = 3;
    state.visited[2][0] = true;
    state.visited[2][1] = true;
    state.visited[2][2] = true;
    
    // Before moving, should still be playing
    expect(state.status).toBe('playing');
    
    // Move to 4th cell - should win
    updateGameState(state);
    
    expect(state.status).toBe('won');
    expect(state.visitedCount).toBe(4);
  });
});

describe('game loop behavior when won', () => {
  it('should not update snake position when status is won', () => {
    const state = createGameState({ width: 10, height: 10 });
    
    state.status = 'won';
    const initialSegments = [...state.snake.segments];
    
    updateGameState(state);
    
    // Snake should not have moved
    expect(state.snake.segments).toEqual(initialSegments);
  });

  it('should not increment visitedCount when status is won', () => {
    const state = createGameState({ width: 10, height: 10 });
    
    state.status = 'won';
    const initialCount = state.visitedCount;
    
    updateGameState(state);
    
    expect(state.visitedCount).toBe(initialCount);
  });
});
