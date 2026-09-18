import * as THREE from 'three';

/**
 * Converts millimeters to meters for standard Three.js unit scaling.
 * 1 Three.js unit = 1 meter = 1000 millimeters.
 */
export const MM_TO_M = 0.001;

/**
 * Standard neutral materials for architectural rendering.
 */
const wallMaterial = new THREE.MeshStandardMaterial({
  color: 0xf1f5f9, // Clean off-white
  roughness: 0.85,
  metalness: 0.05,
  side: THREE.DoubleSide
});

const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x94a3b8, // Slate grey for high contrast against walls
  roughness: 0.6,
  metalness: 0.1,
  side: THREE.DoubleSide
});

const wallEdgeMaterial = new THREE.LineBasicMaterial({
  color: 0x334155, // Crisp edge outlines
  linewidth: 1
});

/**
 * Creates a wireframe outline helper for a box mesh to give architectural clarity.
 */
function createEdgeOutline(geometry) {
  const edges = new THREE.EdgesGeometry(geometry);
  return new THREE.LineSegments(edges, wallEdgeMaterial);
}

/**
 * Generates an interactive 3D room mesh group from structured dimensions.
 *
 * Coordinate System:
 * - X: Horizontal (Room Width)
 * - Y: Vertical (Wall Height / Elevation)
 * - Z: Depth (Room Length)
 *
 * Corner Interlocking:
 * North & South walls run the full width (W).
 * East & West walls run between North & South walls with length (L - 2*T)
 * so that corners do not overlap and z-fighting is eliminated.
 *
 * @param {Object} dimensions
 * @param {number} dimensions.width - Width in mm (X-axis)
 * @param {number} dimensions.length - Length in mm (Z-axis)
 * @param {number} dimensions.wallHeight - Height in mm (Y-axis)
 * @param {number} dimensions.wallThickness - Thickness in mm
 * @returns {THREE.Group} Group containing the floor and four walls
 */
export function generateRoom(dimensions) {
  const { width, length, wallHeight, wallThickness } = dimensions;

  // Convert all dimensions from mm to meters
  const W = width * MM_TO_M;
  const L = length * MM_TO_M;
  const H = wallHeight * MM_TO_M;
  const T = wallThickness * MM_TO_M;

  const roomGroup = new THREE.Group();
  roomGroup.name = 'GeneratedRoom';

  // Store original metric metadata on the group for easy reference
  roomGroup.userData = {
    dimensionsMm: { width, length, wallHeight, wallThickness },
    dimensionsM: { W, L, H, T },
    floorAreaM2: (W * L).toFixed(2),
  };

  // -------------------------------------------------------------
  // 1. Floor
  // Box geometry with small thickness so it has volume and top sits at Y = 0
  // -------------------------------------------------------------
  const floorThickness = 0.05;
  const floorGeo = new THREE.BoxGeometry(W, floorThickness, L);
  const floorMesh = new THREE.Mesh(floorGeo, floorMaterial);
  floorMesh.name = 'Floor';
  floorMesh.position.set(0, -floorThickness / 2, 0);
  floorMesh.receiveShadow = true;
  floorMesh.add(createEdgeOutline(floorGeo));
  roomGroup.add(floorMesh);

  // -------------------------------------------------------------
  // 2. North Wall (Back wall along X, at negative Z)
  // Dimensions: [W, H, T]
  // -------------------------------------------------------------
  const northSouthGeo = new THREE.BoxGeometry(W, H, T);

  const northWall = new THREE.Mesh(northSouthGeo, wallMaterial);
  northWall.name = 'Wall_North';
  northWall.position.set(0, H / 2, -L / 2 + T / 2);
  northWall.castShadow = true;
  northWall.receiveShadow = true;
  northWall.add(createEdgeOutline(northSouthGeo));
  roomGroup.add(northWall);

  // -------------------------------------------------------------
  // 3. South Wall (Front wall along X, at positive Z)
  // Dimensions: [W, H, T]
  // -------------------------------------------------------------
  const southWall = new THREE.Mesh(northSouthGeo, wallMaterial);
  southWall.name = 'Wall_South';
  southWall.position.set(0, H / 2, L / 2 - T / 2);
  southWall.castShadow = true;
  southWall.receiveShadow = true;
  southWall.add(createEdgeOutline(northSouthGeo));
  roomGroup.add(southWall);

  // -------------------------------------------------------------
  // 4. West Wall (Left wall along Z, at negative X)
  // Dimensions: [T, H, L - 2*T] to cleanly fit between North and South
  // -------------------------------------------------------------
  const eastWestLength = Math.max(0.01, L - 2 * T);
  const eastWestGeo = new THREE.BoxGeometry(T, H, eastWestLength);

  const westWall = new THREE.Mesh(eastWestGeo, wallMaterial);
  westWall.name = 'Wall_West';
  westWall.position.set(-W / 2 + T / 2, H / 2, 0);
  westWall.castShadow = true;
  westWall.receiveShadow = true;
  westWall.add(createEdgeOutline(eastWestGeo));
  roomGroup.add(westWall);

  // -------------------------------------------------------------
  // 5. East Wall (Right wall along Z, at positive X)
  // Dimensions: [T, H, L - 2*T]
  // -------------------------------------------------------------
  const eastWall = new THREE.Mesh(eastWestGeo, wallMaterial);
  eastWall.name = 'Wall_East';
  eastWall.position.set(W / 2 - T / 2, H / 2, 0);
  eastWall.castShadow = true;
  eastWall.receiveShadow = true;
  eastWall.add(createEdgeOutline(eastWestGeo));
  roomGroup.add(eastWall);

  return roomGroup;
}
