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

  // After the null check, we can safely assert ctx is non-null for the closure scope
  const renderContext = ctx as CanvasRenderingContext2D;

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
    renderContext.fillStyle = BACKGROUND_COLOR;
    renderContext.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    renderContext.strokeStyle = GRID_COLOR;
    renderContext.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x <= state.level.width; x++) {
      renderContext.beginPath();
      renderContext.moveTo(x * cellSize, 0);
      renderContext.lineTo(x * cellSize, state.level.height * cellSize);
      renderContext.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= state.level.height; y++) {
      renderContext.beginPath();
      renderContext.moveTo(0, y * cellSize);
      renderContext.lineTo(state.level.width * cellSize, y * cellSize);
      renderContext.stroke();
    }
  }

  /**
   * Draws visited cells
   */
  function drawVisited(state: GameState): void {
    renderContext.fillStyle = VISITED_COLOR;
    
    for (let y = 0; y < state.level.height; y++) {
      for (let x = 0; x < state.level.width; x++) {
        if (state.visited[y][x]) {
          renderContext.fillRect(
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
    renderContext.fillStyle = SNAKE_COLOR;
    
    for (const segment of state.snake.segments) {
      renderContext.fillRect(
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
    renderContext.fillStyle = 'rgba(0, 0, 0, 0.7)';
    renderContext.fillRect(0, 0, canvas.width, canvas.height);

    renderContext.fillStyle = '#FF5252';
    renderContext.font = 'bold 48px system-ui';
    renderContext.textAlign = 'center';
    renderContext.textBaseline = 'middle';
    renderContext.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
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
