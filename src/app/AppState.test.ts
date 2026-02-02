/**
 * Tests for app state management
 */

import { describe, it, expect, vi } from 'vitest';

// Import the module to get a fresh instance for each test
async function getFreshAppState() {
  // Clear the module cache to get a new instance
  const module = await import('./AppState?t=' + Date.now());
  return module.appState;
}

describe('AppStateManager', () => {
  it('should initialize with landing screen', async () => {
    const appState = await getFreshAppState();
    const state = appState.getState();
    
    expect(state.currentScreen).toBe('landing');
    expect(state.selectedLevel).toBeUndefined();
  });

  it('should return a copy of state, not the original', async () => {
    const appState = await getFreshAppState();
    const state1 = appState.getState();
    const state2 = appState.getState();
    
    expect(state1).not.toBe(state2);
    expect(state1).toEqual(state2);
  });

  it('should change screen', async () => {
    const appState = await getFreshAppState();
    
    appState.setScreen('levelSelect');
    const state = appState.getState();
    
    expect(state.currentScreen).toBe('levelSelect');
  });

  it('should set selected level', async () => {
    const appState = await getFreshAppState();
    
    appState.setScreen('game', 3);
    const state = appState.getState();
    
    expect(state.currentScreen).toBe('game');
    expect(state.selectedLevel).toBe(3);
  });

  it('should preserve selected level when changing screen without level parameter', async () => {
    const appState = await getFreshAppState();
    
    appState.setScreen('game', 5);
    appState.setScreen('levelSelect');
    const state = appState.getState();
    
    expect(state.currentScreen).toBe('levelSelect');
    expect(state.selectedLevel).toBe(5);
  });

  it('should notify listeners when screen changes', async () => {
    const appState = await getFreshAppState();
    const listener = vi.fn();
    
    // First set a level
    appState.setScreen('game', 5);
    
    // Then subscribe and change screen
    appState.subscribe(listener);
    appState.setScreen('levelSelect');
    
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({
      currentScreen: 'levelSelect',
      selectedLevel: 5,  // Should preserve the previously set level
    });
  });

  it('should notify all listeners', async () => {
    const appState = await getFreshAppState();
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    
    appState.subscribe(listener1);
    appState.subscribe(listener2);
    appState.setScreen('game', 2);
    
    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);
  });

  it('should return unsubscribe function', async () => {
    const appState = await getFreshAppState();
    const listener = vi.fn();
    
    const unsubscribe = appState.subscribe(listener);
    appState.setScreen('levelSelect');
    
    expect(listener).toHaveBeenCalledTimes(1);
    
    unsubscribe();
    appState.setScreen('game');
    
    // Should not be called again after unsubscribe
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple subscribers and unsubscribes', async () => {
    const appState = await getFreshAppState();
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    const listener3 = vi.fn();
    
    const unsub1 = appState.subscribe(listener1);
    const unsub2 = appState.subscribe(listener2);
    appState.subscribe(listener3);
    
    appState.setScreen('levelSelect');
    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);
    expect(listener3).toHaveBeenCalledTimes(1);
    
    unsub1();
    appState.setScreen('game');
    expect(listener1).toHaveBeenCalledTimes(1); // Not called again
    expect(listener2).toHaveBeenCalledTimes(2);
    expect(listener3).toHaveBeenCalledTimes(2);
    
    unsub2();
    appState.setScreen('landing');
    expect(listener1).toHaveBeenCalledTimes(1); // Still not called
    expect(listener2).toHaveBeenCalledTimes(2); // Not called again
    expect(listener3).toHaveBeenCalledTimes(3);
  });
});
