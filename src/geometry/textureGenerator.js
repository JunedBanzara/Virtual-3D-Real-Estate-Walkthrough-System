import * as THREE from 'three';

/**
 * Generates procedural architectural textures using HTML5 Canvas.
 * Operates completely client-side without external image dependencies or network latency.
 */

/**
 * Creates a procedural hardwood parquet/plank texture.
 * @param {number} width 
 * @param {number} height 
 * @returns {THREE.CanvasTexture}
 */
export function createHardwoodTexture(width = 512, height = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Base warm wood tone
  ctx.fillStyle = '#b47846';
  ctx.fillRect(0, 0, width, height);

  const numPlanks = 8;
  const plankHeight = height / numPlanks;

  for (let i = 0; i < numPlanks; i++) {
    const y = i * plankHeight;
    // Vary plank brightness slightly for natural variation
    const variation = (Math.sin(i * 1.7) * 15 + Math.cos(i * 3.1) * 10);
    const r = Math.min(255, Math.max(0, 180 + variation));
    const g = Math.min(255, Math.max(0, 120 + variation * 0.8));
    const b = Math.min(255, Math.max(0, 70 + variation * 0.6));

    ctx.fillStyle = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    ctx.fillRect(0, y, width, plankHeight);

    // Subtle horizontal wood grain lines
    ctx.strokeStyle = 'rgba(60, 30, 10, 0.08)';
    ctx.lineWidth = 1;
    for (let gIdx = 0; gIdx < 6; gIdx++) {
      const lineY = y + Math.random() * plankHeight;
      ctx.beginPath();
      ctx.moveTo(0, lineY);
      ctx.bezierCurveTo(
        width * 0.3, lineY + (Math.random() - 0.5) * 3,
        width * 0.7, lineY + (Math.random() - 0.5) * 3,
        width, lineY
      );
      ctx.stroke();
    }

    // Plank border/bevel groove
    ctx.strokeStyle = 'rgba(40, 20, 5, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y + plankHeight);
    ctx.lineTo(width, y + plankHeight);
    ctx.stroke();

    // Vertical seams at staggered intervals
    const stagger = (i % 2 === 0) ? width * 0.5 : width * 0.75;
    ctx.beginPath();
    ctx.moveTo(stagger, y);
    ctx.lineTo(stagger, y + plankHeight);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Creates a procedural ceramic tile floor texture.
 * @param {number} width 
 * @param {number} height 
 * @returns {THREE.CanvasTexture}
 */
export function createTileTexture(width = 512, height = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Grout color
  ctx.fillStyle = '#64748b';
  ctx.fillRect(0, 0, width, height);

  const tiles = 4;
  const tileSize = width / tiles;
  const grout = 4;

  for (let x = 0; x < tiles; x++) {
    for (let y = 0; y < tiles; y++) {
      const px = x * tileSize + grout / 2;
      const py = y * tileSize + grout / 2;
      const tw = tileSize - grout;
      const th = tileSize - grout;

      // Clean porcelain marble-like tile gradient
      const grad = ctx.createLinearGradient(px, py, px + tw, py + th);
      const tone = 230 + Math.sin(x * 2 + y * 3) * 12;
      grad.addColorStop(0, `rgb(${Math.round(tone + 10)}, ${Math.round(tone + 10)}, ${Math.round(tone + 12)})`);
      grad.addColorStop(1, `rgb(${Math.round(tone - 10)}, ${Math.round(tone - 10)}, ${Math.round(tone - 8)})`);

      ctx.fillStyle = grad;
      ctx.fillRect(px, py, tw, th);

      // Soft bevel highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 1, py + 1, tw - 2, th - 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Returns a configured texture based on flooring style and room dimensions.
 * @param {string} style - 'hardwood' | 'tile' | 'slate'
 * @param {number} roomWidthM 
 * @param {number} roomLengthM 
 * @returns {THREE.Texture | null}
 */
export function getFlooringTexture(style, roomWidthM, roomLengthM) {
  if (style === 'hardwood') {
    const tex = createHardwoodTexture();
    tex.repeat.set(Math.max(1, Math.round(roomWidthM / 1.5)), Math.max(1, Math.round(roomLengthM / 1.5)));
    return tex;
  }
  if (style === 'tile') {
    const tex = createTileTexture();
    tex.repeat.set(Math.max(1, Math.round(roomWidthM / 1.2)), Math.max(1, Math.round(roomLengthM / 1.2)));
    return tex;
  }
  return null; // Slate uses procedural standard material without texture
}
