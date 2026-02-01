/**
 * Emoji to mask conversion utilities for Snakelle
 * Renders emojis to an offscreen Canvas and samples them to create boolean grids
 */

/**
 * A 2D boolean grid representing an emoji shape
 * true = cell is part of the emoji shape
 * false = cell is empty/background
 */
export type EmojiMask = boolean[][];

/**
 * Metadata for an emoji level
 */
export interface EmojiMetadata {
  /** The emoji character */
  emoji: string;
  /** Display name for the level */
  name: string;
  /** Difficulty rating (1-5) */
  difficulty: number;
  /** Optional description */
  description?: string;
}

/**
 * A complete level definition with emoji and its mask
 */
export interface Level {
  /** Width of the level grid */
  width: number;
  /** Height of the level grid */
  height: number;
  /** Emoji metadata */
  metadata: EmojiMetadata;
  /** The boolean mask for this level */
  mask: EmojiMask;
  /** Total number of cells that are part of the emoji (need to be visited to win) */
  targetCells: number;
}

// Constants for mask generation
const DEFAULT_CANVAS_SIZE = 256; // High resolution for sampling
const ALPHA_THRESHOLD = 128; // Alpha value threshold to consider a pixel as "filled"
/**
 * Threshold for determining if a grid cell is "filled" based on pixel coverage.
 * A cell is considered filled if more than 30% of its pixels have alpha >= ALPHA_THRESHOLD.
 * This value was chosen empirically to balance between capturing emoji details
 * and avoiding noise from anti-aliasing artifacts at emoji edges.
 */
const CELL_FILL_THRESHOLD = 0.3;

/**
 * Renders an emoji to an offscreen canvas and returns the ImageData
 * @param emoji - The emoji character to render
 * @param size - The canvas size (default: 256)
 * @returns ImageData of the rendered emoji
 */
export function renderEmojiToCanvas(emoji: string, size: number = DEFAULT_CANVAS_SIZE): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D context from canvas');
  }

  // Clear canvas with transparent background
  ctx.clearRect(0, 0, size, size);
  
  // Set up text rendering for emoji
  // Use a large font size relative to canvas to get good detail
  const fontSize = size * 0.8;
  ctx.font = `${fontSize}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Draw the emoji centered on the canvas
  ctx.fillText(emoji, size / 2, size / 2);
  
  return ctx.getImageData(0, 0, size, size);
}

/**
 * Samples ImageData and downscales to a boolean mask grid
 * @param imageData - The source ImageData from a rendered emoji
 * @param gridWidth - Target grid width
 * @param gridHeight - Target grid height
 * @param threshold - Alpha threshold (0-255) to consider a pixel as filled
 * @returns A boolean 2D array (EmojiMask)
 */
export function sampleToMask(
  imageData: ImageData,
  gridWidth: number,
  gridHeight: number,
  threshold: number = ALPHA_THRESHOLD
): EmojiMask {
  const mask: EmojiMask = [];
  
  // Calculate the size of each cell in the source image
  const cellWidth = imageData.width / gridWidth;
  const cellHeight = imageData.height / gridHeight;
  
  for (let gridY = 0; gridY < gridHeight; gridY++) {
    const row: boolean[] = [];
    
    for (let gridX = 0; gridX < gridWidth; gridX++) {
      // Calculate the bounds of this cell in the source image
      const startX = Math.floor(gridX * cellWidth);
      const startY = Math.floor(gridY * cellHeight);
      const endX = Math.floor((gridX + 1) * cellWidth);
      const endY = Math.floor((gridY + 1) * cellHeight);
      
      // Count filled pixels in this cell
      let filledCount = 0;
      let totalCount = 0;
      
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          // Get the alpha value for this pixel
          // ImageData is RGBA, so alpha is at index 3 of each pixel
          const pixelIndex = (y * imageData.width + x) * 4;
          const alpha = imageData.data[pixelIndex + 3];
          
          if (alpha >= threshold) {
            filledCount++;
          }
          totalCount++;
        }
      }
      
      // Consider the cell as filled if pixel coverage exceeds the threshold
      const fillRatio = totalCount > 0 ? filledCount / totalCount : 0;
      row.push(fillRatio > CELL_FILL_THRESHOLD);
    }
    
    mask.push(row);
  }
  
  return mask;
}

/**
 * Generates an EmojiMask from an emoji character
 * @param emoji - The emoji character
 * @param gridWidth - Target grid width
 * @param gridHeight - Target grid height
 * @returns The generated EmojiMask
 */
export function generateEmojiMask(
  emoji: string,
  gridWidth: number,
  gridHeight: number
): EmojiMask {
  const imageData = renderEmojiToCanvas(emoji, DEFAULT_CANVAS_SIZE);
  return sampleToMask(imageData, gridWidth, gridHeight);
}

/**
 * Counts the number of true cells in a mask
 * @param mask - The EmojiMask to count
 * @returns Number of cells that are true
 */
export function countMaskCells(mask: EmojiMask): number {
  let count = 0;
  for (const row of mask) {
    for (const cell of row) {
      if (cell) {
        count++;
      }
    }
  }
  return count;
}

/**
 * Creates a Level from emoji metadata and dimensions
 * @param metadata - The emoji metadata
 * @param width - Grid width
 * @param height - Grid height
 * @param mask - The pre-generated mask (or will be generated if not provided)
 * @returns A complete Level object
 */
export function createLevel(
  metadata: EmojiMetadata,
  width: number,
  height: number,
  mask?: EmojiMask
): Level {
  const generatedMask = mask ?? generateEmojiMask(metadata.emoji, width, height);
  
  return {
    width,
    height,
    metadata,
    mask: generatedMask,
    targetCells: countMaskCells(generatedMask),
  };
}

/**
 * Prints a mask to the console for debugging
 * @param mask - The mask to print
 */
export function debugPrintMask(mask: EmojiMask): void {
  console.log('Mask visualization:');
  for (const row of mask) {
    console.log(row.map(cell => cell ? '█' : '·').join(''));
  }
}
