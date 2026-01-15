<script lang="ts">
  import { onMount } from 'svelte';
  import { GAME_CONFIG, THEME, UI_TEXT } from '@snakelle/shared';

  let canvas: HTMLCanvasElement;

  onMount(() => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { CANVAS_WIDTH, CANVAS_HEIGHT, GRID_SIZE, CELL_SIZE } = GAME_CONFIG;
    const { BACKGROUND_COLOR, GRID_COLOR } = THEME;

    // Set canvas size
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Clear canvas
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid
    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 1;

    // Vertical lines
    for (let i = 0; i <= GRID_SIZE; i++) {
      const x = i * CELL_SIZE;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }

    // Horizontal lines
    for (let i = 0; i <= GRID_SIZE; i++) {
      const y = i * CELL_SIZE;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    // Draw text
    ctx.fillStyle = '#333';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(UI_TEXT.MVP_PLACEHOLDER, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  });
</script>

<main>
  <h1>snakelle</h1>
  <canvas bind:this={canvas}></canvas>
  <p>{UI_TEXT.TAGLINE}</p>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, sans-serif;
  }

  h1 {
    margin: 0 0 1rem 0;
    font-size: 2rem;
    font-weight: 600;
  }

  canvas {
    border: 2px solid #333;
    margin: 1rem 0;
  }

  p {
    color: #666;
    margin: 0;
  }
</style>
