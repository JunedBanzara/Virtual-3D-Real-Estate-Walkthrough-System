import * as THREE from 'three';
import { getFlooringTexture } from './textureGenerator';

export const MM_TO_M = 0.001;

// Materials
const wallMaterial = new THREE.MeshStandardMaterial({
  color: 0xf8fafc,
  roughness: 0.85,
  metalness: 0.02,
  side: THREE.DoubleSide
});

const wallEdgeMaterial = new THREE.LineBasicMaterial({
  color: 0x334155,
  linewidth: 1
});

const baseboardMaterial = new THREE.MeshStandardMaterial({
  color: 0x1e293b,
  roughness: 0.5,
  metalness: 0.1
});

const frameMaterial = new THREE.MeshStandardMaterial({
  color: 0x0f172a,
  roughness: 0.4,
  metalness: 0.2
});

const doorWoodMaterial = new THREE.MeshStandardMaterial({
  color: 0x78350f, // Warm architectural walnut
  roughness: 0.55,
  metalness: 0.1
});

const doorHandleMaterial = new THREE.MeshStandardMaterial({
  color: 0xd4d4d8, // Brushed nickel/chrome
  roughness: 0.2,
  metalness: 0.85
});

const windowGlassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xbbf7d0,
  transparent: true,
  opacity: 0.35,
  roughness: 0.05,
  metalness: 0.1,
  transmission: 0.8,
  ior: 1.5,
  side: THREE.DoubleSide
});

const ceilingMaterial = new THREE.MeshStandardMaterial({
  color: 0xf1f5f9,
  roughness: 0.9,
  metalness: 0.01,
  side: THREE.DoubleSide
});

function createEdgeOutline(geometry) {
  const edges = new THREE.EdgesGeometry(geometry);
  return new THREE.LineSegments(edges, wallEdgeMaterial);
}

/**
 * Creates a mesh with edge outlines and shadow flags, adding it to the group and collider list.
 */
function createWallBlock(w, h, d, x, y, z, name, group, colliders) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geo, wallMaterial);
  mesh.name = name;
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.add(createEdgeOutline(geo));
  group.add(mesh);

  // Compute bounding box for collision detection
  mesh.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(mesh);
  colliders.push(box);
  return mesh;
}

/**
 * Procedurally generates a 3D architectural room with door/window openings,
 * realistic materials, ceiling, lighting fixture, and collision data.
 */
export function generateRoom(dimensions) {
  const {
    width,
    length,
    wallHeight,
    wallThickness,
    door = { enabled: true, width: 900, height: 2100 },
    window: windowOpt = { enabled: true, width: 1500, height: 1200, sillHeight: 900 },
    flooring = 'hardwood'
  } = dimensions;

  const W = width * MM_TO_M;
  const L = length * MM_TO_M;
  const H = wallHeight * MM_TO_M;
  const T = wallThickness * MM_TO_M;

  const roomGroup = new THREE.Group();
  roomGroup.name = 'GeneratedRoom';

  const colliders = [];

  // Metadata
  roomGroup.userData = {
    dimensionsMm: { width, length, wallHeight, wallThickness },
    dimensionsM: { W, L, H, T },
    floorAreaM2: (W * L).toFixed(2),
    colliders: colliders,
    doorConfig: door,
    windowConfig: windowOpt
  };

  // -------------------------------------------------------------
  // 1. FLOOR
  // -------------------------------------------------------------
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
  floorMesh.name = 'Floor';
  floorMesh.position.set(0, -floorThickness / 2, 0);
  floorMesh.receiveShadow = true;
  floorMesh.add(createEdgeOutline(floorGeo));
  roomGroup.add(floorMesh);

  // -------------------------------------------------------------
  // 2. CEILING (Visible in FPS Walkthrough, hidden in CAD Orbit View)
  // -------------------------------------------------------------
  const ceilingGeo = new THREE.BoxGeometry(W, 0.04, L);
  const ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMaterial);
  ceilingMesh.name = 'Ceiling';
  ceilingMesh.position.set(0, H + 0.02, 0);
  ceilingMesh.receiveShadow = true;
  ceilingMesh.visible = false; // Controlled dynamically by Viewer3D based on camera mode
  roomGroup.add(ceilingMesh);

  // Ceiling Light Fixture (A modern circular flush ceiling luminaire)
  const fixtureGroup = new THREE.Group();
  fixtureGroup.name = 'CeilingLightFixture';
  fixtureGroup.position.set(0, H - 0.02, 0);

  const fixtureBaseGeo = new THREE.CylinderGeometry(0.3, 0.35, 0.04, 24);
  const fixtureBase = new THREE.Mesh(fixtureBaseGeo, frameMaterial);
  fixtureGroup.add(fixtureBase);

  const lightDiscGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.01, 24);
  const lightDiscMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });
  const lightDisc = new THREE.Mesh(lightDiscGeo, lightDiscMat);
  lightDisc.position.y = -0.02;
  fixtureGroup.add(lightDisc);

  // Interior warm point light
  const interiorPointLight = new THREE.PointLight(0xfff7ed, 0.85, Math.max(W, L) * 2.2);
  interiorPointLight.position.set(0, -0.15, 0);
  interiorPointLight.castShadow = true;
  interiorPointLight.shadow.bias = -0.002;
  fixtureGroup.add(interiorPointLight);

  ceilingMesh.add(fixtureGroup);

  // -------------------------------------------------------------
  // 3. NORTH WALL (Back wall at negative Z) - With Window Opening
  // -------------------------------------------------------------
  const northZ = -L / 2 + T / 2;
  const winW = (windowOpt.enabled && windowOpt.width) ? Math.min(W - 0.6, windowOpt.width * MM_TO_M) : 0;
  const winH = (windowOpt.enabled && windowOpt.height) ? Math.min(H - 0.6, windowOpt.height * MM_TO_M) : 0;
  const winSill = (windowOpt.enabled && windowOpt.sillHeight) ? windowOpt.sillHeight * MM_TO_M : 0.9;

  if (windowOpt.enabled && winW > 0.4 && winH > 0.3 && (winSill + winH) < H) {
    const sideW = (W - winW) / 2;
    const lintelH = H - (winSill + winH);

    // Left wall segment
    createWallBlock(sideW, H, T, -W / 2 + sideW / 2, H / 2, northZ, 'Wall_North_Left', roomGroup, colliders);
    // Right wall segment
    createWallBlock(sideW, H, T, W / 2 - sideW / 2, H / 2, northZ, 'Wall_North_Right', roomGroup, colliders);
    // Bottom Sill segment
    createWallBlock(winW, winSill, T, 0, winSill / 2, northZ, 'Wall_North_Sill', roomGroup, colliders);
    // Top Lintel segment
    createWallBlock(winW, lintelH, T, 0, winSill + winH + lintelH / 2, northZ, 'Wall_North_Lintel', roomGroup, colliders);

    // Architectural Window Frame & Glass
    const frameThick = 0.05;
    const windowGroup = new THREE.Group();
    windowGroup.name = 'WindowAssembly';
    windowGroup.position.set(0, winSill + winH / 2, northZ);

    // Outer frame (box border)
    const frameHGeo = new THREE.BoxGeometry(winW, frameThick, T * 1.05);
    const frameTop = new THREE.Mesh(frameHGeo, frameMaterial);
    frameTop.position.set(0, winH / 2 - frameThick / 2, 0);
    windowGroup.add(frameTop);

    const frameBottom = new THREE.Mesh(frameHGeo, frameMaterial);
    frameBottom.position.set(0, -winH / 2 + frameThick / 2, 0);
    windowGroup.add(frameBottom);

    const frameVGeo = new THREE.BoxGeometry(frameThick, winH - 2 * frameThick, T * 1.05);
    const frameLeft = new THREE.Mesh(frameVGeo, frameMaterial);
    frameLeft.position.set(-winW / 2 + frameThick / 2, 0, 0);
    windowGroup.add(frameLeft);

    const frameRight = new THREE.Mesh(frameVGeo, frameMaterial);
    frameRight.position.set(winW / 2 - frameThick / 2, 0, 0);
    windowGroup.add(frameRight);

    // Center vertical & horizontal mullions (4-pane window)
    const mullionV = new THREE.Mesh(new THREE.BoxGeometry(0.03, winH - 2 * frameThick, T * 0.8), frameMaterial);
    windowGroup.add(mullionV);
    const mullionH = new THREE.Mesh(new THREE.BoxGeometry(winW - 2 * frameThick, 0.03, T * 0.8), frameMaterial);
    windowGroup.add(mullionH);

    // Glass Pane
    const glassGeo = new THREE.BoxGeometry(winW - 2 * frameThick, winH - 2 * frameThick, 0.015);
    const glassMesh = new THREE.Mesh(glassGeo, windowGlassMaterial);
    windowGroup.add(glassMesh);

    roomGroup.add(windowGroup);
  } else {
    // Solid North Wall
    createWallBlock(W, H, T, 0, H / 2, northZ, 'Wall_North', roomGroup, colliders);
  }

  // -------------------------------------------------------------
  // 4. SOUTH WALL (Front wall at positive Z) - With Entrance Door
  // -------------------------------------------------------------
  const southZ = L / 2 - T / 2;
  const doorW = (door.enabled && door.width) ? Math.min(W - 0.6, door.width * MM_TO_M) : 0;
  const doorH = (door.enabled && door.height) ? Math.min(H - 0.2, door.height * MM_TO_M) : 0;

  if (door.enabled && doorW > 0.6 && doorH > 1.2) {
    const sideW = (W - doorW) / 2;
    const lintelH = H - doorH;

    // Left wall segment
    createWallBlock(sideW, H, T, -W / 2 + sideW / 2, H / 2, southZ, 'Wall_South_Left', roomGroup, colliders);
    // Right wall segment
    createWallBlock(sideW, H, T, W / 2 - sideW / 2, H / 2, southZ, 'Wall_South_Right', roomGroup, colliders);
    // Top Lintel segment
    createWallBlock(doorW, lintelH, T, 0, doorH + lintelH / 2, southZ, 'Wall_South_Lintel', roomGroup, colliders);

    // Door Frame Assembly
    const frameThick = 0.05;
    const doorGroup = new THREE.Group();
    doorGroup.name = 'DoorAssembly';
    doorGroup.position.set(0, 0, southZ);

    // Lintel frame
    const topFrameMesh = new THREE.Mesh(new THREE.BoxGeometry(doorW, frameThick, T * 1.05), frameMaterial);
    topFrameMesh.position.set(0, doorH - frameThick / 2, 0);
    doorGroup.add(topFrameMesh);

    // Left post frame
    const leftFrameMesh = new THREE.Mesh(new THREE.BoxGeometry(frameThick, doorH - frameThick, T * 1.05), frameMaterial);
    leftFrameMesh.position.set(-doorW / 2 + frameThick / 2, (doorH - frameThick) / 2, 0);
    doorGroup.add(leftFrameMesh);

    // Right post frame
    const rightFrameMesh = new THREE.Mesh(new THREE.BoxGeometry(frameThick, doorH - frameThick, T * 1.05), frameMaterial);
    rightFrameMesh.position.set(doorW / 2 - frameThick / 2, (doorH - frameThick) / 2, 0);
    doorGroup.add(rightFrameMesh);

    // Door Leaf (Ajar at ~35 degrees inwards so you can naturally walk through)
    const leafW = doorW - 2 * frameThick;
    const leafH = doorH - frameThick;
    const leafT = 0.045;

    const doorPivot = new THREE.Group();
    doorPivot.position.set(-doorW / 2 + frameThick, 0, 0);
    doorPivot.rotation.y = -Math.PI / 5; // Ajar inwards

    const doorLeafGeo = new THREE.BoxGeometry(leafW, leafH, leafT);
    const doorLeafMesh = new THREE.Mesh(doorLeafGeo, doorWoodMaterial);
    doorLeafMesh.position.set(leafW / 2, leafH / 2, 0);
    doorLeafMesh.castShadow = true;
    doorLeafMesh.receiveShadow = true;
    doorLeafMesh.add(createEdgeOutline(doorLeafGeo));
    doorPivot.add(doorLeafMesh);

    // Door Handle / Lever
    const handleGroup = new THREE.Group();
    handleGroup.position.set(leafW - 0.08, leafH * 0.48, leafT / 2 + 0.015);

    const handleStem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.04, 12), doorHandleMaterial);
    handleStem.rotation.x = Math.PI / 2;
    handleGroup.add(handleStem);

    const handleLever = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.015), doorHandleMaterial);
    handleLever.position.set(-0.04, 0, 0.02);
    handleGroup.add(handleLever);

    doorLeafMesh.add(handleGroup);
    doorGroup.add(doorPivot);

    roomGroup.add(doorGroup);
  } else {
    // Solid South Wall
    createWallBlock(W, H, T, 0, H / 2, southZ, 'Wall_South', roomGroup, colliders);
  }

  // -------------------------------------------------------------
  // 5. WEST WALL (Left wall along Z at negative X)
  // -------------------------------------------------------------
  const eastWestLength = Math.max(0.01, L - 2 * T);
  const westX = -W / 2 + T / 2;
  createWallBlock(T, H, eastWestLength, westX, H / 2, 0, 'Wall_West', roomGroup, colliders);

  // -------------------------------------------------------------
  // 6. EAST WALL (Right wall along Z at positive X)
  // -------------------------------------------------------------
  const eastX = W / 2 - T / 2;
  createWallBlock(T, H, eastWestLength, eastX, H / 2, 0, 'Wall_East', roomGroup, colliders);

  // -------------------------------------------------------------
  // 7. ARCHITECTURAL BASEBOARDS / SKIRTING
  // -------------------------------------------------------------
  const baseboardH = 0.08;
  const baseboardT = 0.015;

  // West baseboard
  const westBB = new THREE.Mesh(new THREE.BoxGeometry(baseboardT, baseboardH, eastWestLength), baseboardMaterial);
  westBB.position.set(westX + T / 2 + baseboardT / 2, baseboardH / 2, 0);
  roomGroup.add(westBB);

  // East baseboard
  const eastBB = new THREE.Mesh(new THREE.BoxGeometry(baseboardT, baseboardH, eastWestLength), baseboardMaterial);
  eastBB.position.set(eastX - T / 2 - baseboardT / 2, baseboardH / 2, 0);
  roomGroup.add(eastBB);

  return roomGroup;
}
