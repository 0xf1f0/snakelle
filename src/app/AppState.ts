/**
 * App state management for Snakelle
 */

export type ScreenType = 'landing' | 'levelSelect' | 'game';

export interface AppState {
  currentScreen: ScreenType;
  selectedLevel?: number;
}

type StateChangeListener = (state: AppState) => void;

class AppStateManager {
  private state: AppState = {
    currentScreen: 'landing',
  };
  
  private listeners: Set<StateChangeListener> = new Set();

  getState(): AppState {
    return { ...this.state };
  }

  setScreen(screen: ScreenType, selectedLevel?: number): void {
    this.state = {
      currentScreen: screen,
      selectedLevel,
    };
    this.notifyListeners();
  }

  subscribe(listener: StateChangeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getState()));
  }
}

export const appState = new AppStateManager();
