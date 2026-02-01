/**
 * Keyboard input handling for Snakelle
 */

import type { Direction } from '../game/state';

export type DirectionCallback = (direction: Direction) => void;

export interface KeyboardHandler {
  enable(): void;
  disable(): void;
}

const DIRECTION_KEYS: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  W: 'up',
  s: 'down',
  S: 'down',
  a: 'left',
  A: 'left',
  d: 'right',
  D: 'right',
};

/**
 * Creates a keyboard input handler for snake direction control
 * @param onDirectionChange - Callback when a direction key is pressed
 */
export function createKeyboardHandler(onDirectionChange: DirectionCallback): KeyboardHandler {
  function handleKeyDown(event: KeyboardEvent): void {
    const direction = DIRECTION_KEYS[event.key];
    
    if (direction) {
      event.preventDefault();
      onDirectionChange(direction);
    }
  }

  return {
    enable(): void {
      window.addEventListener('keydown', handleKeyDown);
    },

    disable(): void {
      window.removeEventListener('keydown', handleKeyDown);
    }
  };
}
