/**
 * Canvas-based board renderer for Snakelle
 */

import type { GameState } from '../game/state';

export interface BoardRenderer {
  render(state: GameState): void;
  resize(width: number, height: number): void;
  getCanvas(): HTMLCanvasElement;
}

const GRID_COLOR = '#333333';
const BACKGROUND_COLOR = '#1a1a1a';
const SNAKE_COLOR = '#4CAF50';
const VISITED_COLOR = '#2a4a2d';

/**
 * Creates a canvas-based board renderer
 * @returns BoardRenderer instance
 */
export function createBoardRenderer(): BoardRenderer {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get 2D context from canvas');
  }

  // ctx is guaranteed to be non-null after this point
  const context: CanvasRenderingContext2D = ctx;

  let cellSize = 20; // Will be calculated based on canvas size and board dimensions

  /**
   * Calculates the optimal cell size to fit the board on the canvas
   */
  function calculateCellSize(state: GameState): void {
    const maxCellWidth = canvas.width / state.level.width;
    const maxCellHeight = canvas.height / state.level.height;
    cellSize = Math.floor(Math.min(maxCellWidth, maxCellHeight));
  }

  /**
   * Draws the grid background
   */
  function drawGrid(state: GameState): void {
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    context.strokeStyle = GRID_COLOR;
    context.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x <= state.level.width; x++) {
      context.beginPath();
      context.moveTo(x * cellSize, 0);
      context.lineTo(x * cellSize, state.level.height * cellSize);
      context.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= state.level.height; y++) {
      context.beginPath();
      context.moveTo(0, y * cellSize);
      context.lineTo(state.level.width * cellSize, y * cellSize);
      context.stroke();
    }
  }

  /**
   * Draws visited cells
   */
  function drawVisited(state: GameState): void {
    context.fillStyle = VISITED_COLOR;
    
    for (let y = 0; y < state.level.height; y++) {
      for (let x = 0; x < state.level.width; x++) {
        if (state.visited[y][x]) {
          context.fillRect(
            x * cellSize + 1,
            y * cellSize + 1,
            cellSize - 2,
            cellSize - 2
          );
        }
      }
    }
  }

  /**
   * Draws the snake
   */
  function drawSnake(state: GameState): void {
    context.fillStyle = SNAKE_COLOR;
    
    for (const segment of state.snake.segments) {
      context.fillRect(
        segment.x * cellSize + 2,
        segment.y * cellSize + 2,
        cellSize - 4,
        cellSize - 4
      );
    }
  }

  /**
   * Draws game over message
   */
  function drawGameOver(): void {
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#FF5252';
    context.font = 'bold 48px system-ui';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
  }

  return {
    render(state: GameState): void {
      calculateCellSize(state);
      
      drawGrid(state);
      drawVisited(state);
      drawSnake(state);

      if (state.status === 'lost') {
        drawGameOver();
      }
    },

    resize(width: number, height: number): void {
      canvas.width = width;
      canvas.height = height;
    },

    getCanvas(): HTMLCanvasElement {
      return canvas;
    }
  };
}
