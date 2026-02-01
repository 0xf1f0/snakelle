/**
 * Game screen component
 */

import { appState } from '../app/AppState';
import type { GameState } from '../game/state';
import { createGameState } from '../game/state';
import { updateGameState, changeDirection } from '../game/update';
import { createGameLoop } from '../game/loop';
import { createBoardRenderer } from '../render/board';
import { createKeyboardHandler } from '../input/keyboard';

export function createGameScreen(level?: number): HTMLElement {
  const container = document.createElement('div');
  container.className = 'screen game-screen';

  // Create game state
  let gameState: GameState = createGameState();
  
  // Create renderer
  const renderer = createBoardRenderer();
  const canvas = renderer.getCanvas();

  // Create keyboard handler
  const keyboardHandler = createKeyboardHandler((direction) => {
    changeDirection(gameState, direction);
  });

  // Create game loop
  const gameLoop = createGameLoop({
    update: () => {
      updateGameState(gameState);
    },
    draw: () => {
      renderer.render(gameState);
    }
  });

  container.innerHTML = `
    <div class="game-content">
      <div class="game-header">
        <button id="back-button" class="secondary-button">← Back</button>
        <h3>Level ${level || 1}</h3>
        <div class="game-stats">
          <span id="visited-count">Visited: 0</span>
        </div>
      </div>
      <div class="game-area" id="canvas-container">
      </div>
    </div>
  `;

  // Add canvas to container
  const canvasContainer = container.querySelector('#canvas-container') as HTMLElement;
  canvasContainer.innerHTML = '';
  canvasContainer.appendChild(canvas);

  // Set canvas size to maintain square aspect ratio
  function resizeCanvas(): void {
    const containerWidth = canvasContainer.clientWidth;
    const containerHeight = canvasContainer.clientHeight;
    
    // Calculate size to maintain aspect ratio based on board dimensions
    const boardAspectRatio = gameState.level.width / gameState.level.height;
    const containerAspectRatio = containerWidth / containerHeight;
    
    let canvasWidth: number;
    let canvasHeight: number;
    
    if (containerAspectRatio > boardAspectRatio) {
      // Container is wider than board - fit to height
      canvasHeight = containerHeight - 32; // Account for padding
      canvasWidth = canvasHeight * boardAspectRatio;
    } else {
      // Container is taller than board - fit to width
      canvasWidth = containerWidth - 32; // Account for padding
      canvasHeight = canvasWidth / boardAspectRatio;
    }
    
    renderer.resize(canvasWidth, canvasHeight);
    canvas.style.display = 'block';
    canvas.style.margin = '0 auto';
  }

  // Initial resize - use setTimeout to ensure DOM is ready
  setTimeout(resizeCanvas, 0);
  
  // Handle window resize
  window.addEventListener('resize', resizeCanvas);

  // Set up back button
  const backButton = container.querySelector('#back-button') as HTMLButtonElement;
  backButton.addEventListener('click', () => {
    gameLoop.stop();
    keyboardHandler.disable();
    window.removeEventListener('resize', resizeCanvas);
    appState.setScreen('levelSelect');
  });

  // Update visited count periodically
  const visitedCountElement = container.querySelector('#visited-count') as HTMLElement;
  const updateStats = setInterval(() => {
    visitedCountElement.textContent = `Visited: ${gameState.visitedCount}/${gameState.level.width * gameState.level.height}`;
  }, 100);

  // Clean up on unmount
  const cleanup = (): void => {
    gameLoop.stop();
    keyboardHandler.disable();
    clearInterval(updateStats);
    window.removeEventListener('resize', resizeCanvas);
  };

  // Store cleanup for potential future use
  (container as HTMLElement & { cleanup?: () => void }).cleanup = cleanup;

  // Start the game
  keyboardHandler.enable();
  gameLoop.start();

  return container;
}
