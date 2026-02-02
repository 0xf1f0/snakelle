/**
 * Predefined levels for Snakelle
 * Contains hardcoded emoji masks for consistent gameplay
 */

import type { EmojiMetadata, EmojiMask, EmojiLevel } from './mask';
import { countMaskCells } from './mask';

/**
 * Hardcoded 16x24 mask for 🍎 (red apple)
 * Generated at 16 columns x 24 rows
 */
const APPLE_MASK_16x24: EmojiMask = [
  // Row 0-4: stem area
  [false, false, false, false, false, false, false, false, false, true,  false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, true,  true,  false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, true,  true,  false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false, true,  false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, true,  true,  false, false, false, false, false, false, false],
  // Row 5-9: top of apple with leaf
  [false, false, false, false, true,  true,  true,  true,  true,  true,  true,  true,  false, false, false, false],
  [false, false, false, true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  false, false, false],
  [false, false, true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  false, false],
  [false, true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  false],
  [false, true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  false],
  // Row 10-14: middle of apple (widest)
  [true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true ],
  [true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true ],
  [true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true ],
  [true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true ],
  [true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true ],
  // Row 15-19: lower middle of apple
  [true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true ],
  [false, true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  false],
  [false, true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  false],
  [false, false, true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  false, false],
  [false, false, true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  false, false],
  // Row 20-23: bottom of apple
  [false, false, false, true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  false, false, false],
  [false, false, false, false, true,  true,  true,  true,  true,  true,  true,  true,  false, false, false, false],
  [false, false, false, false, false, true,  true,  true,  true,  true,  true,  false, false, false, false, false],
  [false, false, false, false, false, false, true,  true,  true,  true,  false, false, false, false, false, false],
];

/**
 * Apple emoji metadata
 */
const APPLE_METADATA: EmojiMetadata = {
  emoji: '🍎',
  name: 'Red Apple',
  difficulty: 1,
  description: 'A classic red apple - perfect for beginners!',
};

/**
 * Predefined EmojiLevel 1: Apple
 */
export const LEVEL_APPLE: EmojiLevel = {
  width: 16,
  height: 24,
  metadata: APPLE_METADATA,
  mask: APPLE_MASK_16x24,
  targetCells: countMaskCells(APPLE_MASK_16x24),
};

/**
 * All available levels
 */
export const LEVELS: EmojiLevel[] = [
  LEVEL_APPLE,
];

/**
 * Gets a level by its 1-based level number
 * @param levelNumber - 1-based level number (e.g., 1 for the first level)
 * @returns The EmojiLevel or undefined if the level number is out of range
 */
export function getLevel(levelNumber: number): EmojiLevel | undefined {
  return LEVELS[levelNumber - 1];
}

/**
 * Gets the total number of available levels
 */
export function getLevelCount(): number {
  return LEVELS.length;
}
