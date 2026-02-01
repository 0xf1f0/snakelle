/**
 * Game screen component
 */

import { appState } from '../app/AppState';
import type { GameState, Direction, Position, Snake, GameStatus } from '../game/state';

export function createGameScreen(level?: number): HTMLElement {
  const container = document.createElement('div');
  container.className = 'screen game-screen';

  // Placeholder to demonstrate type usage - will be implemented in future issues
  let _gameState: GameState | null = null;
  const _direction: Direction = 'up';
  const _position: Position = { x: 0, y: 0 };
  const _snake: Snake = { segments: [_position], direction: _direction };
  const _status: GameStatus = 'idle';

  // Suppress unused variable warnings (temporary until game logic is implemented)
  void _gameState;
  void _snake;
  void _status;

  container.innerHTML = `
    <div class="game-content">
      <div class="game-header">
        <button id="back-button" class="secondary-button">← Back</button>
        <h3>Level ${level || 1}</h3>
      </div>
      <div class="game-area">
        <p class="placeholder-text">Game goes here</p>
      </div>
    </div>
  `;

  const backButton = container.querySelector('#back-button') as HTMLButtonElement;
  backButton.addEventListener('click', () => {
    appState.setScreen('levelSelect');
  });

  return container;
}
