import * as THREE from 'three';
import { getFlooringTexture } from './textureGenerator';

/**
 * Procedural Sample 2D CAD Blueprint Generator.
 * Draws high-contrast architectural floor plans on an HTML5 canvas for testing.
 */
export function generateSampleBlueprint(type = 'studio') {
  const canvas = document.createElement('canvas');
  const width = 600;
  const height = 500;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // White blueprint paper
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Grid lines
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  const gridSize = 25;
  for (let x = 0; x <= width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Black solid walls
  ctx.fillStyle = '#0f172a';

  if (type === 'studio') {
    // Outer walls: [x, y, w, h]
    // Top wall
    ctx.fillRect(60, 60, 480, 18);
    // Bottom wall (with entrance door gap at center)
    ctx.fillRect(60, 420, 190, 18);
    ctx.fillRect(350, 420, 190, 18);
    // Left wall
    ctx.fillRect(60, 60, 18, 378);
    // Right wall
    ctx.fillRect(522, 60, 18, 378);

    // Bathroom partition in top-right corner
    ctx.fillRect(380, 60, 16, 160);
    ctx.fillRect(380, 220, 80, 16);

    // Text labels
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillText('STUDIO SUITE', 180, 260);
    ctx.font = '13px Inter, sans-serif';
    ctx.fillText('7.0m × 5.5m', 195, 285);

    ctx.fillText('BATH', 425, 140);
  } else if (type === '1bhk') {
    // 1BHK Apartment blueprint
    // Outer envelope
    ctx.fillRect(50, 50, 500, 18); // North
    ctx.fillRect(50, 430, 200, 18); // South left
    ctx.fillRect(350, 430, 200, 18); // South right (door opening)
    ctx.fillRect(50, 50, 18, 398); // West
    ctx.fillRect(532, 50, 18, 398); // East

    // Vertical central partition between Living & Bedroom
    ctx.fillRect(300, 50, 18, 260); // Gap for doorway to bedroom

    // Horizontal kitchen partition
    ctx.fillRect(50, 260, 150, 18);

    ctx.fillStyle = '#475569';
    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.fillText('LIVING ROOM', 120, 360);
    ctx.fillText('KITCHEN', 120, 170);
    ctx.fillText('MASTER BEDROOM', 350, 250);
  } else {
    // Modern Loft Blueprint
    ctx.fillRect(60, 60, 480, 18);
    ctx.fillRect(60, 420, 210, 18);
    ctx.fillRect(370, 420, 170, 18);
    ctx.fillRect(60, 60, 18, 378);
    ctx.fillRect(522, 60, 18, 378);

    // Island kitchen partition
    ctx.fillRect(200, 200, 200, 22);

    ctx.fillStyle = '#475569';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillText('OPEN-CONCEPT LOFT', 210, 320);
  }

  return canvas;
}

/**
 * Computer Vision Pipeline: Extracts wall bounding segments from an uploaded floor plan image.
 * 
 * @param {HTMLImageElement | HTMLCanvasElement} sourceImage 
 * @param {Object} options 
 * @param {number} options.threshold - Luminance cutoff (0 - 255)
 * @param {number} options.scale - Meters per pixel
 * @param {number} options.wallHeight - Extruded wall height in meters
 * @param {number} options.wallThickness - Wall thickness in meters
 * @returns {Object} Detected walls and metadata
 */
export function extractWallsFromBlueprint(sourceImage, options = {}) {
  const {
    threshold = 120,
    scale = 0.035, // ~3.5cm per pixel
    wallHeight = 3.0,
    wallThickness = 0.18
  } = options;

  const canvas = document.createElement('canvas');
  const w = sourceImage.width || 600;
  const h = sourceImage.height || 500;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(sourceImage, 0, 0, w, h);

  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  // 1. Binarize image into 2D occupancy grid
  // 1 = Dark wall pixel, 0 = Light background
  const grid = new Uint8Array(w * h);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    const idx = i / 4;
    grid[idx] = gray < threshold ? 1 : 0;
  }

  // 2. Scan Horizontal Wall Segments
  const horizontalSegments = [];
  const minLength = Math.round(1.0 / scale); // Minimum 1 meter run to filter noise

  for (let y = 0; y < h; y += 4) {
    let startX = -1;
    for (let x = 0; x < w; x++) {
      const isWall = grid[y * w + x] === 1;
      if (isWall && startX === -1) {
        startX = x;
      } else if (!isWall && startX !== -1) {
        const len = x - startX;
        if (len >= minLength) {
          horizontalSegments.push({ x1: startX, y1: y, x2: x, y2: y, len });
        }
        startX = -1;
      }
    }
    if (startX !== -1 && w - startX >= minLength) {
      horizontalSegments.push({ x1: startX, y1: y, x2: w, y2: y, len: w - startX });
    }
  }

  // 3. Scan Vertical Wall Segments
  const verticalSegments = [];
  for (let x = 0; x < w; x += 4) {
    let startY = -1;
    for (let y = 0; y < h; y++) {
      const isWall = grid[y * w + x] === 1;
      if (isWall && startY === -1) {
        startY = y;
      } else if (!isWall && startY !== -1) {
        const len = y - startY;
        if (len >= minLength) {
          verticalSegments.push({ x1: x, y1: startY, x2: x, y2: y, len });
        }
        startY = -1;
      }
    }
    if (startY !== -1 && h - startY >= minLength) {
      verticalSegments.push({ x1: x, y1: startY, x2: x, y2: h, len: h - startY });
    }
  }

  // 4. Cluster & merge redundant parallel runs
  const mergedWalls = [];
  const clusterTolerance = 12; // Pixels

  // Merge horizontal
  const usedH = new Set();
  for (let i = 0; i < horizontalSegments.length; i++) {
    if (usedH.has(i)) continue;
    const base = horizontalSegments[i];
    let avgY = base.y1;
    let minX = base.x1;
    let maxX = base.x2;
    let count = 1;

    for (let j = i + 1; j < horizontalSegments.length; j++) {
      if (usedH.has(j)) continue;
      const other = horizontalSegments[j];
      if (Math.abs(other.y1 - base.y1) <= clusterTolerance) {
        // Check overlap
        if (!(other.x2 < minX - 10 || other.x1 > maxX + 10)) {
          usedH.add(j);
          avgY += other.y1;
          minX = Math.min(minX, other.x1);
          maxX = Math.max(maxX, other.x2);
          count++;
        }
      }
    }

    avgY = Math.round(avgY / count);
    mergedWalls.push({
      x1: minX,
      y1: avgY,
      x2: maxX,
      y2: avgY,
      isVertical: false,
      lengthM: (maxX - minX) * scale
    });
  }

  // Merge vertical
  const usedV = new Set();
  for (let i = 0; i < verticalSegments.length; i++) {
    if (usedV.has(i)) continue;
    const base = verticalSegments[i];
    let avgX = base.x1;
    let minY = base.y1;
    let maxY = base.y2;
    let count = 1;

    for (let j = i + 1; j < verticalSegments.length; j++) {
      if (usedV.has(j)) continue;
      const other = verticalSegments[j];
      if (Math.abs(other.x1 - base.x1) <= clusterTolerance) {
        if (!(other.y2 < minY - 10 || other.y1 > maxY + 10)) {
          usedV.add(j);
          avgX += other.x1;
          minY = Math.min(minY, other.y1);
          maxY = Math.max(maxY, other.y2);
          count++;
        }
      }
    }

    avgX = Math.round(avgX / count);
    mergedWalls.push({
      x1: avgX,
      y1: minY,
      x2: avgX,
      y2: maxY,
      isVertical: true,
      lengthM: (maxY - minY) * scale
    });
  }

  // Center coordinate origin at middle of blueprint
  const centerX = w / 2;
  const centerY = h / 2;

  const vectorWalls = mergedWalls.map((wall, idx) => {
    // Convert canvas (x, y) to 3D world (X, Z) in meters
    const worldX1 = (wall.x1 - centerX) * scale;
    const worldZ1 = (wall.y1 - centerY) * scale;
    const worldX2 = (wall.x2 - centerX) * scale;
    const worldZ2 = (wall.y2 - centerY) * scale;

    const midX = (worldX1 + worldX2) / 2;
    const midZ = (worldZ1 + worldZ2) / 2;
    const lengthM = wall.lengthM;

    return {
      id: `wall_${idx}`,
      isVertical: wall.isVertical,
      midX,
      midZ,
      lengthM,
      pixelCoords: { x1: wall.x1, y1: wall.y1, x2: wall.x2, y2: wall.y2 }
    };
  });

  const totalWidthM = (w * scale).toFixed(1);
  const totalLengthM = (h * scale).toFixed(1);
  const estimatedCarpetArea = ((w * scale * 0.75) * (h * scale * 0.75)).toFixed(1);

  return {
    walls: vectorWalls,
    blueprintDimensions: { w, h, totalWidthM, totalLengthM },
    carpetAreaM2: estimatedCarpetArea,
    scale,
    wallHeight,
    wallThickness
  };
}

/**
 * Procedurally generates a Three.js 3D spatial scene graph from extracted blueprint vectors.
 * 
 * @param {Object} blueprintData - Result of extractWallsFromBlueprint
 * @returns {THREE.Group}
 */
export function build3DFromScannedBlueprint(blueprintData) {
  const { walls, blueprintDimensions, carpetAreaM2, wallHeight = 3.0, wallThickness = 0.18 } = blueprintData;

  const group = new THREE.Group();
  group.name = 'ScannedBlueprint3D';
  const colliders = [];

  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.85,
    metalness: 0.02,
    side: THREE.DoubleSide
  });

  const edgeMat = new THREE.LineBasicMaterial({
    color: 0x334155,
    linewidth: 1
  });

  const W = Number(blueprintDimensions.totalWidthM) * 0.9;
  const L = Number(blueprintDimensions.totalLengthM) * 0.9;
  const H = wallHeight;
  const T = wallThickness;

  // 1. FLOOR
  const floorGeo = new THREE.BoxGeometry(W, 0.05, L);
  const floorMat = new THREE.MeshStandardMaterial({
    roughness: 0.45,
    metalness: 0.05
  });
  const floorTex = getFlooringTexture('hardwood', W, L);
  if (floorTex) floorMat.map = floorTex;

  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.position.set(0, -0.025, 0);
  floorMesh.receiveShadow = true;
  floorMesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(floorGeo), edgeMat));
  group.add(floorMesh);

  // 2. CEILING (Hidden in Orbit, shown in Walkthrough)
  const ceilingGroup = new THREE.Group();
  ceilingGroup.name = 'Ceiling';
  ceilingGroup.visible = false;

  const ceilGeo = new THREE.BoxGeometry(W, 0.04, L);
  const ceilMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.9 });
  const ceilMesh = new THREE.Mesh(ceilGeo, ceilMat);
  ceilMesh.position.set(0, H + 0.02, 0);
  ceilingGroup.add(ceilMesh);

  // Center luminaire light
  const luminaire = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.04, 20), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
  luminaire.position.set(0, H - 0.02, 0);
  ceilingGroup.add(luminaire);

  const interiorLight = new THREE.PointLight(0xfff7ed, 0.85, Math.max(W, L) * 2.2);
  interiorLight.position.set(0, H - 0.15, 0);
  interiorLight.castShadow = true;
  ceilingGroup.add(interiorLight);

  group.add(ceilingGroup);

  // 3. EXTRUDED 3D WALLS
  walls.forEach((wData) => {
    const wallW = wData.isVertical ? T : Math.max(0.2, wData.lengthM);
    const wallL = wData.isVertical ? Math.max(0.2, wData.lengthM) : T;

    const geo = new THREE.BoxGeometry(wallW, H, wallL);
    const mesh = new THREE.Mesh(geo, wallMat);
    mesh.position.set(wData.midX, H / 2, wData.midZ);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat));
    group.add(mesh);

    mesh.updateMatrixWorld(true);
    colliders.push(new THREE.Box3().setFromObject(mesh));
  });

  group.userData = {
    layoutType: 'scanned_blueprint',
    title: 'Custom Scanned 2D Blueprint',
    floorAreaM2: carpetAreaM2,
    colliders: colliders,
    spawnPoints: {
      living: [ 0, 1.65, 0 ]
    }
  };

  return group;
}
