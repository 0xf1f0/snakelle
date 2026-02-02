/**
 * Tests for emoji mask utilities
 */

import { describe, it, expect } from 'vitest';
import {
  countMaskCells,
  createEmojiLevel,
  renderEmojiToCanvas,
  sampleToMask,
  type EmojiMask,
  type EmojiMetadata,
} from './mask';

describe('countMaskCells', () => {
  it('should count zero cells in empty mask', () => {
    const mask: EmojiMask = [
      [false, false, false],
      [false, false, false],
      [false, false, false],
    ];
    
    expect(countMaskCells(mask)).toBe(0);
  });

  it('should count all cells in full mask', () => {
    const mask: EmojiMask = [
      [true, true, true],
      [true, true, true],
      [true, true, true],
    ];
    
    expect(countMaskCells(mask)).toBe(9);
  });

  it('should count partial cells correctly', () => {
    const mask: EmojiMask = [
      [true, false, true],
      [false, true, false],
      [true, false, true],
    ];
    
    expect(countMaskCells(mask)).toBe(5);
  });

  it('should handle single row mask', () => {
    const mask: EmojiMask = [[true, false, true, true]];
    
    expect(countMaskCells(mask)).toBe(3);
  });

  it('should handle single column mask', () => {
    const mask: EmojiMask = [[true], [false], [true], [true]];
    
    expect(countMaskCells(mask)).toBe(3);
  });
});

describe('renderEmojiToCanvas', () => {
  it('should throw error for invalid canvas size (too small)', () => {
    expect(() => renderEmojiToCanvas('😀', 15)).toThrow(
      'Canvas size must be between 16 and 2048'
    );
  });

  it('should throw error for invalid canvas size (too large)', () => {
    expect(() => renderEmojiToCanvas('😀', 2049)).toThrow(
      'Canvas size must be between 16 and 2048'
    );
  });

  it('should throw error for invalid canvas size (negative)', () => {
    expect(() => renderEmojiToCanvas('😀', -1)).toThrow(
      'Canvas size must be between 16 and 2048'
    );
  });

  it('should throw error for invalid canvas size (NaN)', () => {
    expect(() => renderEmojiToCanvas('😀', NaN)).toThrow(
      'Canvas size must be between 16 and 2048'
    );
  });

  it('should throw error for invalid canvas size (Infinity)', () => {
    expect(() => renderEmojiToCanvas('😀', Infinity)).toThrow(
      'Canvas size must be between 16 and 2048'
    );
  });

  // Note: The following tests are skipped because happy-dom doesn't fully support Canvas 2D context
  // These would work in a real browser or with jsdom + canvas
  it.skip('should render emoji to canvas with default size', () => {
    const imageData = renderEmojiToCanvas('😀');
    
    expect(imageData.width).toBe(256);
    expect(imageData.height).toBe(256);
    expect(imageData.data).toBeInstanceOf(Uint8ClampedArray);
  });

  it.skip('should render emoji to canvas with custom size', () => {
    const size = 128;
    const imageData = renderEmojiToCanvas('😀', size);
    
    expect(imageData.width).toBe(size);
    expect(imageData.height).toBe(size);
  });

  it.skip('should floor fractional canvas size', () => {
    const imageData = renderEmojiToCanvas('😀', 100.7);
    
    expect(imageData.width).toBe(100);
    expect(imageData.height).toBe(100);
  });
});

describe('sampleToMask', () => {
  // Create a simple test ImageData using happy-dom's document
  function createTestImageData(width: number, height: number): ImageData {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      // Fallback: create ImageData manually for test environments
      const data = new Uint8ClampedArray(width * height * 4);
      return { data, width, height, colorSpace: 'srgb' } as ImageData;
    }
    return ctx.createImageData(width, height);
  }

  it('should throw error for invalid grid width (too small)', () => {
    const imageData = createTestImageData(256, 256);
    
    expect(() => sampleToMask(imageData, 0, 10)).toThrow(
      'Grid width must be between 1 and 256'
    );
  });

  it('should throw error for invalid grid width (too large)', () => {
    const imageData = createTestImageData(256, 256);
    
    expect(() => sampleToMask(imageData, 257, 10)).toThrow(
      'Grid width must be between 1 and 256'
    );
  });

  it('should throw error for invalid grid height (too small)', () => {
    const imageData = createTestImageData(256, 256);
    
    expect(() => sampleToMask(imageData, 10, 0)).toThrow(
      'Grid height must be between 1 and 256'
    );
  });

  it('should throw error for invalid grid height (too large)', () => {
    const imageData = createTestImageData(256, 256);
    
    expect(() => sampleToMask(imageData, 10, 257)).toThrow(
      'Grid height must be between 1 and 256'
    );
  });

  it('should throw error for invalid grid dimensions (NaN)', () => {
    const imageData = createTestImageData(256, 256);
    
    expect(() => sampleToMask(imageData, NaN, 10)).toThrow();
    expect(() => sampleToMask(imageData, 10, NaN)).toThrow();
  });

  it('should create mask with correct dimensions', () => {
    const imageData = createTestImageData(256, 256);
    const mask = sampleToMask(imageData, 16, 24);
    
    expect(mask).toHaveLength(24);
    expect(mask[0]).toHaveLength(16);
  });

  it('should floor fractional grid dimensions', () => {
    const imageData = createTestImageData(256, 256);
    const mask = sampleToMask(imageData, 16.7, 24.3);
    
    expect(mask).toHaveLength(24);
    expect(mask[0]).toHaveLength(16);
  });

  it('should create all-false mask for transparent image', () => {
    const imageData = createTestImageData(256, 256);
    // ImageData is initialized with all zeros (transparent)
    
    const mask = sampleToMask(imageData, 8, 8);
    
    const allFalse = mask.every(row => row.every(cell => !cell));
    expect(allFalse).toBe(true);
  });

  it('should handle 1x1 grid', () => {
    const imageData = createTestImageData(256, 256);
    const mask = sampleToMask(imageData, 1, 1);
    
    expect(mask).toHaveLength(1);
    expect(mask[0]).toHaveLength(1);
  });
});

describe('createEmojiLevel', () => {
  const testMetadata: EmojiMetadata = {
    emoji: '😀',
    name: 'Happy Face',
    difficulty: 1,
    description: 'A simple smiley face',
  };

  it('should create emoji level with provided mask', () => {
    const mask: EmojiMask = [
      [true, false, true],
      [false, true, false],
    ];
    
    const level = createEmojiLevel(testMetadata, 3, 2, mask);
    
    expect(level.width).toBe(3);
    expect(level.height).toBe(2);
    expect(level.metadata).toBe(testMetadata);
    expect(level.mask).toBe(mask);
    expect(level.targetCells).toBe(3);  // Only 3 true cells in the mask
  });

  // Note: Tests that require Canvas functionality are skipped in test environment
  it.skip('should generate mask if not provided', () => {
    const level = createEmojiLevel(testMetadata, 16, 16);
    
    expect(level.width).toBe(16);
    expect(level.height).toBe(16);
    expect(level.metadata).toBe(testMetadata);
    expect(level.mask).toHaveLength(16);
    expect(level.mask[0]).toHaveLength(16);
    expect(typeof level.targetCells).toBe('number');
  });

  it('should count target cells correctly', () => {
    const mask: EmojiMask = [
      [true, true, true, true],
      [true, false, false, true],
      [true, true, true, true],
    ];
    
    const level = createEmojiLevel(testMetadata, 4, 3, mask);
    
    expect(level.targetCells).toBe(10);
  });

  it('should handle empty mask', () => {
    const mask: EmojiMask = [
      [false, false],
      [false, false],
    ];
    
    const level = createEmojiLevel(testMetadata, 2, 2, mask);
    
    expect(level.targetCells).toBe(0);
  });

  it.skip('should include all metadata fields', () => {
    const level = createEmojiLevel(testMetadata, 10, 10);
    
    expect(level.metadata.emoji).toBe('😀');
    expect(level.metadata.name).toBe('Happy Face');
    expect(level.metadata.difficulty).toBe(1);
    expect(level.metadata.description).toBe('A simple smiley face');
  });
});
