import * as THREE from 'three';
import { getFlooringTexture } from './textureGenerator.js';

/**
 * Material presets for walls
 */
export const WALL_MATERIAL_PRESETS = {
  matte: {
    id: 'matte',
    name: 'Matte Architectural Paint',
    roughness: 0.88,
    metalness: 0.02
  },
  textured: {
    id: 'textured',
    name: 'Fine Textured Stucco',
    roughness: 0.95,
    metalness: 0.04
  },
  concrete: {
    id: 'concrete',
    name: 'Polished Architectural Concrete',
    roughness: 0.65,
    metalness: 0.12
  },
  panel: {
    id: 'panel',
    name: 'Contemporary Wood Slat / Panel',
    roughness: 0.55,
    metalness: 0.08
  }
};

/**
 * Curated Designer Colour Palette
 */
export const DESIGNER_WALL_PALETTE = [
  { name: 'Warm Alabaster', hex: '#f8fafc' },
  { name: 'Pure Chalk', hex: '#ffffff' },
  { name: 'Soft Greige', hex: '#e2e8f0' },
  { name: 'Warm Linen', hex: '#ede8df' },
  { name: 'Desert Sand', hex: '#d6c7b2' },
  { name: 'Terracotta Clay', hex: '#c2410c' },
  { name: 'Sage Mist', hex: '#84a98c' },
  { name: 'Forest Moss', hex: '#2d6a4f' },
  { name: 'Deep Emerald', hex: '#064e3b' },
  { name: 'Nordic Sky', hex: '#93c5fd' },
  { name: 'Slate Blue', hex: '#475569' },
  { name: 'Royal Navy', hex: '#1e293b' },
  { name: 'Midnight Charcoal', hex: '#0f172a' },
  { name: 'Dusty Rose', hex: '#f472b6' },
  { name: 'Mustard Ochre', hex: '#ca8a04' }
];

const frameMaterial = new THREE.MeshStandardMaterial({
  color: 0x18181b,
  roughness: 0.4,
  metalness: 0.3
});

const doorWoodMaterial = new THREE.MeshStandardMaterial({
  color: 0x5c3a21, // Architectural walnut
  roughness: 0.55,
  metalness: 0.05
});

const doorHandleMaterial = new THREE.MeshStandardMaterial({
  color: 0xd4af37, // Brushed brass
  roughness: 0.25,
  metalness: 0.85
});

const windowGlassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xc7d2fe,
  transparent: true,
  opacity: 0.35,
  roughness: 0.05,
  transmission: 0.85,
  ior: 1.5,
  side: THREE.DoubleSide
});

const wallEdgeMaterial = new THREE.LineBasicMaterial({
  color: 0x334155,
  linewidth: 1
});

function createEdgeOutline(geometry) {
  const edges = new THREE.EdgesGeometry(geometry);
  return new THREE.LineSegments(edges, wallEdgeMaterial);
}

/**
 * Creates a unique Three.js material for an individual wall
 */
export function createWallMaterial(finish = { color: '#f8fafc', material: 'matte' }) {
  const preset = WALL_MATERIAL_PRESETS[finish.material] || WALL_MATERIAL_PRESETS.matte;
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(finish.color || '#f8fafc'),
    roughness: preset.roughness,
    metalness: preset.metalness,
    side: THREE.DoubleSide
  });
}

/**
 * Creates a wall box mesh and registers it as a raycastable wall segment and collider.
 */
function createWallSegment(w, h, d, x, y, z, mat, roomId, wallSide, group, colliders, roomName) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = `Wall_${roomId}_${wallSide}`;
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData = {
    type: 'wall',
    roomId,
    roomName,
    wallSide
  };
  mesh.add(createEdgeOutline(geo));
  group.add(mesh);

  // Compute world bounding box for FPP collisions
  mesh.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(mesh);
  colliders.push(box);
  return mesh;
}

/**
 * Builds a wall along X-axis (North or South) with optional doors and windows
 */
function buildHorizontalWall(W, H, T, zPos, wallSide, openings, mat, roomId, group, colliders, roomName) {
  const opening = openings.find((o) => o.wall === wallSide);

  if (!opening) {
    // Solid wall
    createWallSegment(W, H, T, 0, H / 2, zPos, mat, roomId, wallSide, group, colliders, roomName);
    return;
  }

  const openingW = Math.max(0.4, Math.min(W - 0.4, opening.width || 0.9));
  const offset = Math.max(-(W - openingW) / 2 + 0.1, Math.min((W - openingW) / 2 - 0.1, opening.position || 0));

  if (opening.type === 'door') {
    const doorH = Math.min(H - 0.1, opening.height || 2.1);
    const lintelH = H - doorH;

    const leftWidth = Math.max(0.05, (W - openingW) / 2 + offset);
    const rightWidth = Math.max(0.05, (W - openingW) / 2 - offset);

    // Left wall segment
    createWallSegment(leftWidth, H, T, -W / 2 + leftWidth / 2, H / 2, zPos, mat, roomId, wallSide, group, colliders, roomName);
    // Right wall segment
    createWallSegment(rightWidth, H, T, W / 2 - rightWidth / 2, H / 2, zPos, mat, roomId, wallSide, group, colliders, roomName);
    // Lintel over door
    createWallSegment(openingW, lintelH, T, offset, doorH + lintelH / 2, zPos, mat, roomId, wallSide, group, colliders, roomName);

    // Architectural Door Frame and Leaf
    const frameThick = 0.05;
    const doorGroup = new THREE.Group();
    doorGroup.position.set(offset, 0, zPos);

    const topFrame = new THREE.Mesh(new THREE.BoxGeometry(openingW, frameThick, T * 1.05), frameMaterial);
    topFrame.position.set(0, doorH - frameThick / 2, 0);
    doorGroup.add(topFrame);

    const leftFrame = new THREE.Mesh(new THREE.BoxGeometry(frameThick, doorH - frameThick, T * 1.05), frameMaterial);
    leftFrame.position.set(-openingW / 2 + frameThick / 2, (doorH - frameThick) / 2, 0);
    doorGroup.add(leftFrame);

    const rightFrame = new THREE.Mesh(new THREE.BoxGeometry(frameThick, doorH - frameThick, T * 1.05), frameMaterial);
    rightFrame.position.set(openingW / 2 - frameThick / 2, (doorH - frameThick) / 2, 0);
    doorGroup.add(rightFrame);

    // Hinged door leaf (ajar)
    const leafW = openingW - 2 * frameThick;
    const leafH = doorH - frameThick;
    const doorPivot = new THREE.Group();
    doorPivot.position.set(-openingW / 2 + frameThick, 0, 0);
    doorPivot.rotation.y = -Math.PI / 4.5;

    const leafMesh = new THREE.Mesh(new THREE.BoxGeometry(leafW, leafH, 0.045), doorWoodMaterial);
    leafMesh.position.set(leafW / 2, leafH / 2, 0);
    leafMesh.castShadow = true;
    leafMesh.receiveShadow = true;
    leafMesh.add(createEdgeOutline(leafMesh.geometry));
    doorPivot.add(leafMesh);

    // Handle
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.015), doorHandleMaterial);
    handle.position.set(leafW - 0.08, leafH * 0.48, 0.035);
    doorPivot.add(handle);

    doorGroup.add(doorPivot);
    group.add(doorGroup);
  } else if (opening.type === 'window') {
    const winH = Math.min(H - 0.6, opening.height || 1.2);
    const winSill = Math.max(0.4, Math.min(H - winH - 0.2, opening.sillHeight || 0.9));
    const lintelH = H - (winSill + winH);

    const leftWidth = Math.max(0.05, (W - openingW) / 2 + offset);
    const rightWidth = Math.max(0.05, (W - openingW) / 2 - offset);

    // Left & right wall segments
    createWallSegment(leftWidth, H, T, -W / 2 + leftWidth / 2, H / 2, zPos, mat, roomId, wallSide, group, colliders, roomName);
    createWallSegment(rightWidth, H, T, W / 2 - rightWidth / 2, H / 2, zPos, mat, roomId, wallSide, group, colliders, roomName);
    // Sill & lintel
    createWallSegment(openingW, winSill, T, offset, winSill / 2, zPos, mat, roomId, wallSide, group, colliders, roomName);
    createWallSegment(openingW, lintelH, T, offset, winSill + winH + lintelH / 2, zPos, mat, roomId, wallSide, group, colliders, roomName);

    // Architectural Window Frame & Glass
    const frameThick = 0.05;
    const winGroup = new THREE.Group();
    winGroup.position.set(offset, winSill + winH / 2, zPos);

    const frameH = new THREE.Mesh(new THREE.BoxGeometry(openingW, frameThick, T * 1.05), frameMaterial);
    frameH.position.set(0, winH / 2 - frameThick / 2, 0);
    winGroup.add(frameH);
    const frameB = frameH.clone();
    frameB.position.set(0, -winH / 2 + frameThick / 2, 0);
    winGroup.add(frameB);

    const frameL = new THREE.Mesh(new THREE.BoxGeometry(frameThick, winH - 2 * frameThick, T * 1.05), frameMaterial);
    frameL.position.set(-openingW / 2 + frameThick / 2, 0, 0);
    winGroup.add(frameL);
    const frameR = frameL.clone();
    frameR.position.set(openingW / 2 - frameThick / 2, 0, 0);
    winGroup.add(frameR);

    // 4-Pane Window Mullions & Glass
    const mullV = new THREE.Mesh(new THREE.BoxGeometry(0.03, winH - 2 * frameThick, T * 0.8), frameMaterial);
    winGroup.add(mullV);
    const mullH = new THREE.Mesh(new THREE.BoxGeometry(openingW - 2 * frameThick, 0.03, T * 0.8), frameMaterial);
    winGroup.add(mullH);

    const glass = new THREE.Mesh(new THREE.BoxGeometry(openingW - 2 * frameThick, winH - 2 * frameThick, 0.015), windowGlassMaterial);
    winGroup.add(glass);

    group.add(winGroup);
  }
}

/**
 * Builds a wall along Z-axis (East or West) with optional doors and windows
 */
function buildVerticalWall(L, H, T, xPos, wallSide, openings, mat, roomId, group, colliders, roomName) {
  const opening = openings.find((o) => o.wall === wallSide);

  if (!opening) {
    createWallSegment(T, H, L, xPos, H / 2, 0, mat, roomId, wallSide, group, colliders, roomName);
    return;
  }

  const openingW = Math.max(0.4, Math.min(L - 0.4, opening.width || 0.9));
  const offset = Math.max(-(L - openingW) / 2 + 0.1, Math.min((L - openingW) / 2 - 0.1, opening.position || 0));

  if (opening.type === 'door') {
    const doorH = Math.min(H - 0.1, opening.height || 2.1);
    const lintelH = H - doorH;

    const leftLen = Math.max(0.05, (L - openingW) / 2 + offset);
    const rightLen = Math.max(0.05, (L - openingW) / 2 - offset);

    createWallSegment(T, H, leftLen, xPos, H / 2, -L / 2 + leftLen / 2, mat, roomId, wallSide, group, colliders, roomName);
    createWallSegment(T, H, rightLen, xPos, H / 2, L / 2 - rightLen / 2, mat, roomId, wallSide, group, colliders, roomName);
    createWallSegment(T, lintelH, openingW, xPos, doorH + lintelH / 2, offset, mat, roomId, wallSide, group, colliders, roomName);

    // Door Frame
    const frameThick = 0.05;
    const doorGroup = new THREE.Group();
    doorGroup.position.set(xPos, 0, offset);

    const topFrame = new THREE.Mesh(new THREE.BoxGeometry(T * 1.05, frameThick, openingW), frameMaterial);
    topFrame.position.set(0, doorH - frameThick / 2, 0);
    doorGroup.add(topFrame);
    group.add(doorGroup);
  } else if (opening.type === 'window') {
    const winH = Math.min(H - 0.6, opening.height || 1.2);
    const winSill = Math.max(0.4, Math.min(H - winH - 0.2, opening.sillHeight || 0.9));
    const lintelH = H - (winSill + winH);

    const leftLen = Math.max(0.05, (L - openingW) / 2 + offset);
    const rightLen = Math.max(0.05, (L - openingW) / 2 - offset);

    createWallSegment(T, H, leftLen, xPos, H / 2, -L / 2 + leftLen / 2, mat, roomId, wallSide, group, colliders, roomName);
    createWallSegment(T, H, rightLen, xPos, H / 2, L / 2 - rightLen / 2, mat, roomId, wallSide, group, colliders, roomName);
    createWallSegment(T, winSill, openingW, xPos, winSill / 2, offset, mat, roomId, wallSide, group, colliders, roomName);
    createWallSegment(T, lintelH, openingW, xPos, winSill + winH + lintelH / 2, offset, mat, roomId, wallSide, group, colliders, roomName);

    // Glass pane
    const winGroup = new THREE.Group();
    winGroup.position.set(xPos, winSill + winH / 2, offset);
    const glass = new THREE.Mesh(new THREE.BoxGeometry(0.015, winH - 0.08, openingW - 0.08), windowGlassMaterial);
    winGroup.add(glass);
    group.add(winGroup);
  }
}

/**
 * Builds the architectural false ceiling system for a room
 */
function buildFalseCeiling(room, W, L, H) {
  const config = room.falseCeiling || {
    enabled: true,
    style: 'tray',
    dropHeight: 0.25,
    color: '#f8fafc',
    coveLights: true,
    recessedSpots: true,
    spotCount: 6,
    centralFixture: true
  };

  const dropH = config.dropHeight || 0.25;
  const ceilingY = H - dropH;

  // Separate lighting group that remains active independently of ceiling physical mesh visibility
  const lightingGroup = new THREE.Group();
  lightingGroup.name = `RoomLighting_${room.id}`;
  lightingGroup.userData = { type: 'lighting', roomId: room.id };

  if (config.coveLights) {
    const coveLight = new THREE.PointLight(0xffedd5, 0.75, Math.max(W, L) * 2.2);
    coveLight.position.set(0, ceilingY - 0.1, 0);
    lightingGroup.add(coveLight);
  }

  if (config.centralFixture !== false) {
    const fixtureGroup = new THREE.Group();
    fixtureGroup.position.set(0, ceilingY, 0);

    const baseDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.03, 20), frameMaterial);
    fixtureGroup.add(baseDisc);

    const centralLightDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.015, 20), new THREE.MeshBasicMaterial({ color: 0xffedd5 }));
    centralLightDisc.position.y = -0.015;
    fixtureGroup.add(centralLightDisc);

    // Warm ambient room light
    const interiorLight = new THREE.PointLight(0xfff7ed, 0.9, Math.max(W, L) * 2.4);
    interiorLight.position.set(0, -0.2, 0);
    interiorLight.castShadow = true;
    interiorLight.shadow.bias = -0.002;
    fixtureGroup.add(interiorLight);

    lightingGroup.add(fixtureGroup);
  }

  if (!config.enabled) {
    return { ceilingGroup: null, lightingGroup };
  }

  const ceilingGroup = new THREE.Group();
  ceilingGroup.name = `FalseCeiling_${room.id}`;
  ceilingGroup.userData = { type: 'ceiling', roomId: room.id };
  const ceilingColor = new THREE.Color(config.color || '#f8fafc');
  const ceilingMat = new THREE.MeshStandardMaterial({
    color: ceilingColor,
    roughness: 0.9,
    metalness: 0.02,
    side: THREE.DoubleSide
  });

  const style = config.style || 'tray';

  if (style === 'flat') {
    // 1. Sleek Flat Soffit
    const flatGeo = new THREE.BoxGeometry(W, 0.04, L);
    const flatMesh = new THREE.Mesh(flatGeo, ceilingMat);
    flatMesh.position.set(0, ceilingY, 0);
    flatMesh.receiveShadow = true;
    ceilingGroup.add(flatMesh);
  } else if (style === 'perimeter_drop') {
    // 2. Perimeter Drop with Recessed Center
    const borderW = 0.5;
    const borderThick = 0.08;

    // Center higher slab
    const centerGeo = new THREE.BoxGeometry(Math.max(0.5, W - borderW * 2), 0.04, Math.max(0.5, L - borderW * 2));
    const centerMesh = new THREE.Mesh(centerGeo, ceilingMat);
    centerMesh.position.set(0, ceilingY + 0.1, 0);
    ceilingGroup.add(centerMesh);

    // Perimeter lower border boxes
    const northP = new THREE.Mesh(new THREE.BoxGeometry(W, borderThick, borderW), ceilingMat);
    northP.position.set(0, ceilingY, -L / 2 + borderW / 2);
    ceilingGroup.add(northP);

    const southP = new THREE.Mesh(new THREE.BoxGeometry(W, borderThick, borderW), ceilingMat);
    southP.position.set(0, ceilingY, L / 2 - borderW / 2);
    ceilingGroup.add(southP);

    const westP = new THREE.Mesh(new THREE.BoxGeometry(borderW, borderThick, L - borderW * 2), ceilingMat);
    westP.position.set(-W / 2 + borderW / 2, ceilingY, 0);
    ceilingGroup.add(westP);

    const eastP = new THREE.Mesh(new THREE.BoxGeometry(borderW, borderThick, L - borderW * 2), ceilingMat);
    eastP.position.set(W / 2 - borderW / 2, ceilingY, 0);
    ceilingGroup.add(eastP);
  } else if (style === 'stepped') {
    // 3. Two-Tier Stepped Ceiling
    const tier1Geo = new THREE.BoxGeometry(W, 0.04, L);
    const tier1 = new THREE.Mesh(tier1Geo, ceilingMat);
    tier1.position.set(0, ceilingY + 0.12, 0);
    ceilingGroup.add(tier1);

    const tier2Geo = new THREE.BoxGeometry(Math.max(0.8, W - 0.7), 0.06, Math.max(0.8, L - 0.7));
    const tier2 = new THREE.Mesh(tier2Geo, ceilingMat);
    tier2.position.set(0, ceilingY + 0.06, 0);
    ceilingGroup.add(tier2);

    const tier3Geo = new THREE.BoxGeometry(Math.max(0.4, W - 1.4), 0.06, Math.max(0.4, L - 1.4));
    const tier3 = new THREE.Mesh(tier3Geo, ceilingMat);
    tier3.position.set(0, ceilingY, 0);
    ceilingGroup.add(tier3);
  } else {
    // 4. Default: Tray Ceiling
    const trayBorder = 0.45;
    const trayThick = 0.06;

    // Recessed center panel
    const centerPanel = new THREE.Mesh(new THREE.BoxGeometry(Math.max(0.4, W - trayBorder * 2), 0.03, Math.max(0.4, L - trayBorder * 2)), ceilingMat);
    centerPanel.position.set(0, ceilingY + 0.08, 0);
    ceilingGroup.add(centerPanel);

    // Surrounding soffit frame
    const northS = new THREE.Mesh(new THREE.BoxGeometry(W, trayThick, trayBorder), ceilingMat);
    northS.position.set(0, ceilingY, -L / 2 + trayBorder / 2);
    ceilingGroup.add(northS);

    const southS = new THREE.Mesh(new THREE.BoxGeometry(W, trayThick, trayBorder), ceilingMat);
    southS.position.set(0, ceilingY, L / 2 - trayBorder / 2);
    ceilingGroup.add(southS);

    const westS = new THREE.Mesh(new THREE.BoxGeometry(trayBorder, trayThick, L - trayBorder * 2), ceilingMat);
    westS.position.set(-W / 2 + trayBorder / 2, ceilingY, 0);
    ceilingGroup.add(westS);

    const eastS = new THREE.Mesh(new THREE.BoxGeometry(trayBorder, trayThick, L - trayBorder * 2), ceilingMat);
    eastS.position.set(W / 2 - trayBorder / 2, ceilingY, 0);
    ceilingGroup.add(eastS);
  }

  // Recessed Downlight Spots
  if (config.recessedSpots !== false) {
    const spotCount = config.spotCount || 4;
    const spotGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.02, 16);
    const spotGlowMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });
    const spotTrimMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.3 });

    const spanX = (W / 2) * 0.65;
    const spanZ = (L / 2) * 0.65;

    const spotPositions = [
      [-spanX, spanZ],
      [spanX, spanZ],
      [-spanX, -spanZ],
      [spanX, -spanZ]
    ];

    if (spotCount >= 6) {
      spotPositions.push([0, spanZ], [0, -spanZ]);
    }
    if (spotCount >= 8) {
      spotPositions.push([-spanX, 0], [spanX, 0]);
    }

    spotPositions.forEach(([sx, sz]) => {
      const spotMesh = new THREE.Mesh(spotGeo, spotTrimMat);
      spotMesh.position.set(sx, ceilingY - 0.01, sz);
      const glowDisc = new THREE.Mesh(new THREE.CircleGeometry(0.045, 16), spotGlowMat);
      glowDisc.rotation.x = Math.PI / 2;
      glowDisc.position.y = -0.011;
      spotMesh.add(glowDisc);
      ceilingGroup.add(spotMesh);
    });
  }

  return { ceilingGroup, lightingGroup };
}

/**
 * Creates a clean architectural label badge on the floor
 */
function createFloorLabel(name, areaM2, w, l) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(16, 16, 480, 224, 24);
  } else {
    ctx.rect(16, 16, 480, 224);
  }
  ctx.fill();

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px Inter, sans-serif';
  ctx.fillText(name, 256, 110);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '32px Inter, sans-serif';
  ctx.fillText(`${areaM2} m² (${(areaM2 * 10.7639).toFixed(0)} sq ft)`, 256, 175);

  const texture = new THREE.CanvasTexture(canvas);
  const geo = new THREE.PlaneGeometry(Math.min(2.2, w * 0.7), Math.min(1.1, l * 0.4));
  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(0, 0.015, 0);
  return mesh;
}

/**
 * Generates a complete 3D Room object with floor, 4 individual walls, false ceiling, and metadata
 */
export function generateSingleRoom(room, showCeiling = true) {
  const W = Number(room.width) || 5.0;
  const L = Number(room.length) || 4.0;
  const H = Number(room.wallHeight) || 3.0;
  const T = Number(room.wallThickness) || 0.15;
  const flooring = room.flooring || 'hardwood';

  const roomGroup = new THREE.Group();
  roomGroup.name = `Room_${room.id}`;
  roomGroup.position.set(room.position?.x || 0, 0, room.position?.z || 0);
  if (room.rotation) {
    roomGroup.rotation.y = (room.rotation * Math.PI) / 180;
  }

  const colliders = [];

  // Metadata
  const areaM2 = (W * L).toFixed(2);
  roomGroup.userData = {
    roomId: room.id,
    roomName: room.name,
    areaM2,
    dimensions: { W, L, H, T },
    colliders
  };

  // 1. FLOOR
  const floorThickness = 0.05;
  const floorGeo = new THREE.BoxGeometry(W, floorThickness, L);
  const floorMat = new THREE.MeshStandardMaterial({
    color: flooring === 'slate' ? 0x334155 : 0xffffff,
    roughness: flooring === 'hardwood' ? 0.45 : 0.25,
    metalness: 0.05,
    side: THREE.DoubleSide
  });

  const floorTex = getFlooringTexture(flooring, W, L);
  if (floorTex) {
    floorMat.map = floorTex;
    floorMat.needsUpdate = true;
  }

  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.name = `Floor_${room.id}`;
  floorMesh.position.set(0, -floorThickness / 2, 0);
  floorMesh.receiveShadow = true;
  floorMesh.userData = {
    type: 'floor',
    roomId: room.id
  };
  floorMesh.add(createEdgeOutline(floorGeo));
  roomGroup.add(floorMesh);

  // Floor label badge
  roomGroup.add(createFloorLabel(room.name, areaM2, W, L));

  // Collect openings by wall
  const openings = [];
  if (Array.isArray(room.doors)) {
    room.doors.forEach((d) => openings.push({ ...d, type: 'door' }));
  }
  if (Array.isArray(room.windows)) {
    room.windows.forEach((w) => openings.push({ ...w, type: 'window' }));
  }

  // 2. WALLS (North, South, East, West) with independent customizable finishes
  const finishes = room.wallFinishes || {};
  const matNorth = createWallMaterial(finishes.north || { color: '#f8fafc', material: 'matte' });
  const matSouth = createWallMaterial(finishes.south || { color: '#f8fafc', material: 'matte' });
  const matEast = createWallMaterial(finishes.east || { color: '#f8fafc', material: 'matte' });
  const matWest = createWallMaterial(finishes.west || { color: '#f8fafc', material: 'matte' });

  // North Wall (Z = -L/2 + T/2)
  buildHorizontalWall(W, H, T, -L / 2 + T / 2, 'north', openings, matNorth, room.id, roomGroup, colliders, room.name);
  // South Wall (Z = L/2 - T/2)
  buildHorizontalWall(W, H, T, L / 2 - T / 2, 'south', openings, matSouth, room.id, roomGroup, colliders, room.name);

  // East & West walls (Length = L - 2*T to fit snugly inside north and south walls)
  const innerL = Math.max(0.1, L - 2 * T);
  buildVerticalWall(innerL, H, T, W / 2 - T / 2, 'east', openings, matEast, room.id, roomGroup, colliders, room.name);
  buildVerticalWall(innerL, H, T, -W / 2 + T / 2, 'west', openings, matWest, room.id, roomGroup, colliders, room.name);

  // 3. FALSE CEILING SYSTEM & ROOM LIGHTING
  const ceilingResult = buildFalseCeiling(room, W, L, H);
  if (ceilingResult) {
    const { ceilingGroup, lightingGroup } = ceilingResult;
    if (ceilingGroup) {
      ceilingGroup.visible = Boolean(showCeiling);
      roomGroup.add(ceilingGroup);
    }
    if (lightingGroup) {
      lightingGroup.visible = true; // Room lighting stays independently active
      roomGroup.add(lightingGroup);
    }
  }

  return roomGroup;
}

/**
 * Generates an entire multi-room home design layout in Three.js
 */
export function generateHomeLayout(project, showCeiling = true) {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'HomeLayout';

  const allColliders = [];

  const rooms = Array.isArray(project.rooms) && project.rooms.length > 0
    ? project.rooms
    : [
        {
          id: 'room_default',
          name: 'Living Space',
          type: 'living',
          width: 5.0,
          length: 4.0,
          wallHeight: 3.0,
          wallThickness: 0.15,
          position: { x: 0, z: 0 },
          rotation: 0,
          flooring: 'hardwood',
          doors: [{ id: 'd1', wall: 'south', width: 0.9, height: 2.1, position: 0, open: true }],
          windows: [{ id: 'w1', wall: 'north', width: 1.5, height: 1.2, sillHeight: 0.9, position: 0 }],
          wallFinishes: {
            north: { color: '#f8fafc', material: 'matte' },
            south: { color: '#f8fafc', material: 'matte' },
            east: { color: '#f8fafc', material: 'matte' },
            west: { color: '#f8fafc', material: 'matte' }
          },
          falseCeiling: {
            enabled: true,
            style: 'tray',
            dropHeight: 0.25,
            color: '#ffffff',
            coveLights: true,
            recessedSpots: true,
            spotCount: 4,
            centralFixture: true
          }
        }
      ];

  rooms.forEach((room) => {
    const roomGroup = generateSingleRoom(room, showCeiling);
    rootGroup.add(roomGroup);

    // Merge colliders
    if (roomGroup.userData.colliders) {
      allColliders.push(...roomGroup.userData.colliders);
    }
  });

  rootGroup.userData = {
    isHomeLayout: true,
    colliders: allColliders,
    roomCount: rooms.length
  };

  return rootGroup;
}
