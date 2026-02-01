/**
 * Main App component that manages screen rendering
 */

import { appState, type AppState } from './app/AppState';
import { createLandingScreen } from './screens/LandingScreen';
import { createLevelSelectScreen } from './screens/LevelSelectScreen';
import { createGameScreen } from './screens/GameScreen';

export class App {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.init();
  }

  private init(): void {
    // Subscribe to state changes
    appState.subscribe((state) => {
      this.render(state);
    });

    // Initial render
    this.render(appState.getState());
  }

  private render(state: AppState): void {
    // Clear container
    this.container.innerHTML = '';

    // Render current screen
    let screen: HTMLElement;
    
    switch (state.currentScreen) {
      case 'landing':
        screen = createLandingScreen();
        break;
      case 'levelSelect':
        screen = createLevelSelectScreen();
        break;
      case 'game':
        screen = createGameScreen(state.selectedLevel);
        break;
      default:
        screen = createLandingScreen();
    }

    this.container.appendChild(screen);
  }
}
