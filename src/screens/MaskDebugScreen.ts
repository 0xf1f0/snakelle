/**
 * Debug screen for visualizing emoji masks
 * Useful for development and testing mask generation
 */

import { appState } from '../app/AppState';
import type { EmojiMask } from '../emoji/mask';
import { generateEmojiMask, countMaskCells } from '../emoji/mask';
import { LEVELS } from '../emoji/levels';

// Default grid size for testing
const DEFAULT_GRID_WIDTH = 16;
const DEFAULT_GRID_HEIGHT = 24;

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param unsafe - The string to escape
 * @returns The escaped string safe for HTML insertion
 */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Creates the mask debug screen component
 */
export function createMaskDebugScreen(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'screen mask-debug-screen';

  // State for the debug view
  let currentLevelIndex = 0;
  let customEmoji = '';
  let isUsingCustomEmoji = false;

  /**
   * Gets the current mask to display
   */
  function getCurrentMask(): { mask: EmojiMask; emoji: string; name: string } {
    if (isUsingCustomEmoji && customEmoji) {
      const mask = generateEmojiMask(customEmoji, DEFAULT_GRID_WIDTH, DEFAULT_GRID_HEIGHT);
      return { mask, emoji: customEmoji, name: 'Custom Emoji' };
    }
    
    const level = LEVELS[currentLevelIndex];
    if (level) {
      return { 
        mask: level.mask, 
        emoji: level.metadata.emoji, 
        name: level.metadata.name 
      };
    }
    
    // Fallback: empty mask
    const emptyMask: EmojiMask = Array.from({ length: DEFAULT_GRID_HEIGHT }, () =>
      Array.from({ length: DEFAULT_GRID_WIDTH }, () => false)
    );
    return { mask: emptyMask, emoji: '❓', name: 'Unknown' };
  }

  /**
   * Renders the mask grid as HTML
   */
  function renderMaskGrid(mask: EmojiMask): string {
    const height = mask.length;
    const width = height > 0 ? (mask[0]?.length ?? 0) : 0;
    const filledCount = countMaskCells(mask);
    const ariaLabel = `Emoji mask grid, ${height} rows by ${width} columns, ${filledCount} filled cells. Filled cells are shown as colored squares; empty cells are blank.`;
    
    const rows = mask.map((row, y) => {
      const cells = row.map((cell, x) => {
        const cellClass = cell ? 'mask-cell filled' : 'mask-cell empty';
        return `<div class="${cellClass}" data-x="${x}" data-y="${y}"></div>`;
      }).join('');
      return `<div class="mask-row">${cells}</div>`;
    }).join('');
    
    return `<div class="mask-grid" role="img" aria-label="${ariaLabel}">${rows}</div>`;
  }

  /**
   * Renders the full debug view
   */
  function render(): void {
    const { mask, emoji, name } = getCurrentMask();
    const cellCount = countMaskCells(mask);
    
    // Escape user-provided and dynamic content to prevent XSS
    const safeEmoji = escapeHtml(emoji);
    const safeName = escapeHtml(name);
    const safeCustomEmoji = escapeHtml(customEmoji);
    
    // Calculate fill ratio defensively to avoid division by zero
    const totalCells = mask.length * (mask[0]?.length ?? 0);
    const fillRatio = totalCells > 0 ? ((cellCount / totalCells) * 100).toFixed(1) : '0.0';
    
    container.innerHTML = `
      <div class="mask-debug-content">
        <div class="debug-header">
          <button id="back-button" class="secondary-button">← Back</button>
          <h2>Mask Debug View</h2>
        </div>
        
        <div class="debug-controls">
          <div class="control-group">
            <label>Predefined Levels:</label>
            <select id="level-select">
              ${LEVELS.map((level, i) => 
                `<option value="${i}" ${i === currentLevelIndex && !isUsingCustomEmoji ? 'selected' : ''}>
                  ${escapeHtml(level.metadata.emoji)} ${escapeHtml(level.metadata.name)}
                </option>`
              ).join('')}
            </select>
          </div>
          
          <div class="control-group">
            <label>Or test custom emoji:</label>
            <input type="text" id="emoji-input" 
                   placeholder="Paste emoji here" 
                   value="${safeCustomEmoji}"
                   maxlength="4" />
            <button id="generate-button" class="primary-button">Generate</button>
          </div>
        </div>
        
        <div class="mask-info">
          <div class="emoji-preview">${safeEmoji}</div>
          <div class="mask-stats">
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Grid Size:</strong> ${mask[0]?.length ?? 0} × ${mask.length}</p>
            <p><strong>Filled Cells:</strong> ${cellCount}</p>
            <p><strong>Fill Ratio:</strong> ${fillRatio}%</p>
          </div>
        </div>
        
        <div class="mask-visualization">
          ${renderMaskGrid(mask)}
        </div>
        
        <div class="mask-code">
          <button id="copy-mask-button" class="secondary-button">Copy Mask as TypeScript</button>
          <pre id="mask-code-output"></pre>
        </div>
      </div>
    `;

    // Attach event listeners
    attachEventListeners();
  }

  /**
   * Generates TypeScript code for the current mask
   */
  function generateMaskCode(mask: EmojiMask, emoji: string): string {
    const rows = mask.map(row => {
      const cells = row.map(cell => (cell ? 'true' : 'false')).join(', ');
      return `  [${cells}],`;
    }).join('\n');
    
    return `// Mask for ${emoji}\nconst MASK: EmojiMask = [\n${rows}\n];`;
  }

  /**
   * Attaches event listeners to the debug controls
   */
  function attachEventListeners(): void {
    // Back button
    const backButton = container.querySelector('#back-button') as HTMLButtonElement;
    backButton?.addEventListener('click', () => {
      appState.setScreen('landing');
    });

    // Level select dropdown
    const levelSelect = container.querySelector('#level-select') as HTMLSelectElement;
    levelSelect?.addEventListener('change', (e) => {
      currentLevelIndex = parseInt((e.target as HTMLSelectElement).value, 10);
      isUsingCustomEmoji = false;
      render();
    });

    // Custom emoji input
    const emojiInput = container.querySelector('#emoji-input') as HTMLInputElement;
    const generateButton = container.querySelector('#generate-button') as HTMLButtonElement;
    
    generateButton?.addEventListener('click', () => {
      const inputValue = emojiInput?.value.trim();
      if (inputValue) {
        customEmoji = inputValue;
        isUsingCustomEmoji = true;
        render();
      }
    });

    // Copy mask code button
    const copyButton = container.querySelector('#copy-mask-button') as HTMLButtonElement;
    const codeOutput = container.querySelector('#mask-code-output') as HTMLPreElement;
    
    copyButton?.addEventListener('click', () => {
      const { mask, emoji } = getCurrentMask();
      const code = generateMaskCode(mask, emoji);
      codeOutput.textContent = code;
      
      // Check if clipboard API is available (requires secure context)
      if (!navigator.clipboard) {
        copyButton.textContent = 'Clipboard unavailable - see code below';
        return;
      }
      
      // Copy to clipboard
      navigator.clipboard.writeText(code).then(() => {
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
          copyButton.textContent = 'Copy Mask as TypeScript';
        }, 2000);
      }).catch(() => {
        // Fallback: just show the code
        copyButton.textContent = 'Copy failed - see code below';
      });
    });
  }

  // Initial render
  render();

  return container;
}
