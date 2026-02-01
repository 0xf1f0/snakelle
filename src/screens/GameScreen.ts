/**
 * Game screen component
 */

import { appState } from '../app/AppState';

export function createGameScreen(level?: number): HTMLElement {
  const container = document.createElement('div');
  container.className = 'screen game-screen';

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
