/**
 * Landing screen component
 */

import { appState } from '../app/AppState';

export function createLandingScreen(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'screen landing-screen';

  container.innerHTML = `
    <div class="landing-content">
      <h1 class="game-title">Snakelle</h1>
      <p class="game-tagline">Eat the emoji, one cell at a time.</p>
      <button id="play-button" class="primary-button">Play</button>
      <button id="debug-button" class="secondary-button debug-link">🔧 Mask Debug</button>
    </div>
  `;

  const playButton = container.querySelector('#play-button') as HTMLButtonElement;
  playButton.addEventListener('click', () => {
    appState.setScreen('levelSelect');
  });

  const debugButton = container.querySelector('#debug-button') as HTMLButtonElement;
  debugButton.addEventListener('click', () => {
    appState.setScreen('maskDebug');
  });

  return container;
}
