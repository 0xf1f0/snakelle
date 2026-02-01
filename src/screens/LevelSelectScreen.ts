/**
 * Level Select screen component
 */

import { appState } from '../app/AppState';

export function createLevelSelectScreen(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'screen level-select-screen';

  const levels = [1, 2, 3, 4, 5]; // Placeholder levels

  container.innerHTML = `
    <div class="level-select-content">
      <h2>Select a Level</h2>
      <div class="level-list">
        ${levels.map(level => `
          <button class="level-item" data-level="${level}">
            Level ${level}
          </button>
        `).join('')}
      </div>
    </div>
  `;

  const levelButtons = container.querySelectorAll('.level-item');
  levelButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const level = parseInt((e.target as HTMLElement).getAttribute('data-level') || '1');
      appState.setScreen('game', level);
    });
  });

  return container;
}
