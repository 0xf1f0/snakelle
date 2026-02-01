/**
 * Game update logic for Snakelle
 */

import type { GameState, Direction } from './state';
import { getNextPosition, isPositionInBounds } from './state';

/**
 * Updates the game state for one tick
 * Moves the snake forward in its current direction
 * @param state - The current game state (will be mutated)
 */
export function updateGameState(state: GameState): void {
  // Don't update if game is not in playing status
  if (state.status !== 'playing') {
    return;
  }

  const head = state.snake.segments[0];
  const nextHead = getNextPosition(head, state.snake.direction);

  // Check collision with board edges
  if (!isPositionInBounds(nextHead, state.level)) {
    state.status = 'lost';
    return;
  }

  // Move the snake: add new head
  state.snake.segments.unshift(nextHead);

  // Mark position as visited (if not already)
  if (!state.visited[nextHead.y][nextHead.x]) {
    state.visited[nextHead.y][nextHead.x] = true;
    state.visitedCount++;
  }

  // For now, keep the snake at length 1 by removing the tail
  // (In future, we might grow the snake based on game mechanics)
  if (state.snake.segments.length > 1) {
    state.snake.segments.pop();
  }
}

/**
 * Changes the snake's direction
 * Prevents moving in the opposite direction
 * @param state - The current game state
 * @param newDirection - The new direction to move
 */
export function changeDirection(state: GameState, newDirection: Direction): void {
  // Can't change direction if game is not playing
  if (state.status !== 'playing') {
    return;
  }

  const currentDirection = state.snake.direction;

  // Prevent moving in the opposite direction
  const opposites: Record<Direction, Direction> = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left',
  };

  if (opposites[currentDirection] === newDirection) {
    return;
  }

  state.snake.direction = newDirection;
}
