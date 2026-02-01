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

  // Restart function
  function restartGame(): void {
    gameState = createGameState();
    // Restart game loop with fresh state
    if (!gameLoop.isRunning()) {
      gameLoop.start();
    }
  }

  // Create keyboard handler
  const keyboardHandler = createKeyboardHandler((direction) => {
    changeDirection(gameState, direction);
  });

  // Add restart key handler
  function handleRestartKey(event: KeyboardEvent): void {
    if (event.key === 'r' || event.key === 'R') {
      if (gameState.status === 'lost') {
        event.preventDefault();
        restartGame();
      }
    }
  }

  // Create game loop
  const gameLoop = createGameLoop({
    update: () => {
      updateGameState(gameState);
    },
    draw: () => {
      renderer.render(gameState);
      // Update visited count display during draw
      const visitedCountElement = container.querySelector('#visited-count') as HTMLElement;
      if (visitedCountElement) {
        visitedCountElement.textContent = `Visited: ${gameState.visitedCount}/${gameState.level.width * gameState.level.height}`;
      }
      
      // Show game over message if lost
      const gameOverElement = container.querySelector('#game-over-message') as HTMLElement;
      if (gameOverElement) {
        if (gameState.status === 'lost') {
          gameOverElement.style.display = 'block';
        } else {
          gameOverElement.style.display = 'none';
        }
      }
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
  canvasContainer.appendChild(canvas);
  
  // Add game over message overlay
  const gameOverMessage = document.createElement('div');
  gameOverMessage.id = 'game-over-message';
  gameOverMessage.style.cssText = 'display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0, 0, 0, 0.8); color: white; padding: 20px; border-radius: 8px; text-align: center; z-index: 10;';
  gameOverMessage.innerHTML = '<h2 style="margin: 0 0 10px 0;">Game Over!</h2><p style="margin: 0;">Press R to Restart</p>';
  canvasContainer.appendChild(gameOverMessage);

  // Set canvas size to maintain square aspect ratio
  function resizeCanvas(): void {
    const containerWidth = canvasContainer.clientWidth;
    const containerHeight = canvasContainer.clientHeight;
    
    // Only resize if container has valid dimensions
    if (containerWidth === 0 || containerHeight === 0) {
      return;
    }
    
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

  // Initial resize - use requestAnimationFrame for proper DOM readiness
  requestAnimationFrame(resizeCanvas);
  
  // Handle window resize
  window.addEventListener('resize', resizeCanvas);

  // Set up back button
  const backButton = container.querySelector('#back-button') as HTMLButtonElement;
  backButton.addEventListener('click', () => {
    gameLoop.stop();
    keyboardHandler.disable();
    window.removeEventListener('resize', resizeCanvas);
    window.removeEventListener('keydown', handleRestartKey);
    appState.setScreen('levelSelect');
  });

  // Start the game
  keyboardHandler.enable();
  window.addEventListener('keydown', handleRestartKey);
  gameLoop.start();

  return container;
}
