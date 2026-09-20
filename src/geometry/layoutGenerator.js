import * as THREE from 'three';
import { getFlooringTexture } from './textureGenerator';
import { generateRoom } from './roomGenerator';

// Reusable Materials
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
  color: 0xd4d4d8,
  roughness: 0.2,
  metalness: 0.85
});

const glassMaterial = new THREE.MeshPhysicalMaterial({
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

function addSolidBlock(w, h, d, x, y, z, name, group, colliders) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geo, wallMaterial);
  mesh.name = name;
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.add(createEdgeOutline(geo));
  group.add(mesh);

  mesh.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(mesh);
  colliders.push(box);
  return mesh;
}

/**
 * Creates an internal or external wall with an open doorway.
 * @param {number} totalW - Wall length along its primary axis
 * @param {number} H - Wall height
 * @param {number} T - Wall thickness
 * @param {number} doorW - Door opening width
 * @param {number} doorH - Door opening height
 * @param {number} doorOffset - Offset from wall center
 * @param {number} x, y, z - Wall center coordinates
 * @param {boolean} isAlongZ - If true, wall runs along Z axis (e.g. East-West partition)
 */
function addDoorwayWall(totalW, H, T, doorW, doorH, doorOffset, x, y, z, isAlongZ, name, group, colliders, hasDoorLeaf = false) {
  const leftW = Math.max(0.05, (totalW - doorW) / 2 + doorOffset);
  const rightW = Math.max(0.05, (totalW - doorW) / 2 - doorOffset);
  const lintelH = H - doorH;

  if (isAlongZ) {
    // Wall extends along Z-axis (thickness is X)
    // Left segment (towards negative Z)
    const leftZ = z - totalW / 2 + leftW / 2;
    addSolidBlock(T, H, leftW, x, H / 2, leftZ, `${name}_Left`, group, colliders);

    // Right segment (towards positive Z)
    const rightZ = z + totalW / 2 - rightW / 2;
    addSolidBlock(T, H, rightW, x, H / 2, rightZ, `${name}_Right`, group, colliders);

    // Lintel over door
    const doorCenterZ = z - totalW / 2 + leftW + doorW / 2;
    addSolidBlock(T, lintelH, doorW, x, doorH + lintelH / 2, doorCenterZ, `${name}_Lintel`, group, colliders);

    // Door frame trim
    const frameMesh = new THREE.Mesh(new THREE.BoxGeometry(T * 1.05, 0.05, doorW), frameMaterial);
    frameMesh.position.set(x, doorH - 0.025, doorCenterZ);
    group.add(frameMesh);
  } else {
    // Wall extends along X-axis (thickness is Z)
    // Left segment (towards negative X)
    const leftX = x - totalW / 2 + leftW / 2;
    addSolidBlock(leftW, H, T, leftX, H / 2, z, `${name}_Left`, group, colliders);

    // Right segment (towards positive X)
    const rightX = x + totalW / 2 - rightW / 2;
    addSolidBlock(rightW, H, T, rightX, H / 2, z, `${name}_Right`, group, colliders);

    // Lintel over door
    const doorCenterX = x - totalW / 2 + leftW + doorW / 2;
    addSolidBlock(doorW, lintelH, T, doorCenterX, doorH + lintelH / 2, z, `${name}_Lintel`, group, colliders);

    // Door frame trim
    const frameMesh = new THREE.Mesh(new THREE.BoxGeometry(doorW, 0.05, T * 1.05), frameMaterial);
    frameMesh.position.set(doorCenterX, doorH - 0.025, z);
    group.add(frameMesh);

    // Optional hinged door leaf (for exterior entrance)
    if (hasDoorLeaf) {
      const leafW = doorW - 0.06;
      const leafH = doorH - 0.03;
      const pivot = new THREE.Group();
      pivot.position.set(doorCenterX - doorW / 2 + 0.03, 0, z);
      pivot.rotation.y = -Math.PI / 4.5; // Ajar inwards

      const leaf = new THREE.Mesh(new THREE.BoxGeometry(leafW, leafH, 0.045), doorWoodMaterial);
      leaf.position.set(leafW / 2, leafH / 2, 0);
      leaf.castShadow = true;
      leaf.receiveShadow = true;
      leaf.add(createEdgeOutline(leaf.geometry));
      pivot.add(leaf);

      // Handle
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.015), doorHandleMaterial);
      handle.position.set(leafW - 0.08, leafH * 0.48, 0.035);
      pivot.add(handle);

      group.add(pivot);
    }
  }
}

/**
 * Creates an exterior wall with a window assembly.
 */
function addWindowWall(totalW, H, T, winW, winH, winSill, winOffset, x, y, z, isAlongZ, name, group, colliders) {
  const leftW = Math.max(0.05, (totalW - winW) / 2 + winOffset);
  const rightW = Math.max(0.05, (totalW - winW) / 2 - winOffset);
  const lintelH = Math.max(0.05, H - (winSill + winH));

  if (isAlongZ) {
    const leftZ = z - totalW / 2 + leftW / 2;
    addSolidBlock(T, H, leftW, x, H / 2, leftZ, `${name}_Left`, group, colliders);

    const rightZ = z + totalW / 2 - rightW / 2;
    addSolidBlock(T, H, rightW, x, H / 2, rightZ, `${name}_Right`, group, colliders);

    const winZ = z - totalW / 2 + leftW + winW / 2;
    addSolidBlock(T, winSill, winW, x, winSill / 2, winZ, `${name}_Sill`, group, colliders);
    addSolidBlock(T, lintelH, winW, x, winSill + winH + lintelH / 2, winZ, `${name}_Lintel`, group, colliders);

    // Window frame & glass
    const winGroup = new THREE.Group();
    winGroup.position.set(x, winSill + winH / 2, winZ);
    const glass = new THREE.Mesh(new THREE.BoxGeometry(0.015, winH - 0.08, winW - 0.08), glassMaterial);
    winGroup.add(glass);
    group.add(winGroup);
  } else {
    const leftX = x - totalW / 2 + leftW / 2;
    addSolidBlock(leftW, H, T, leftX, H / 2, z, `${name}_Left`, group, colliders);

    const rightX = x + totalW / 2 - rightW / 2;
    addSolidBlock(rightW, H, T, rightX, H / 2, z, `${name}_Right`, group, colliders);

    const winX = x - totalW / 2 + leftW + winW / 2;
    addSolidBlock(winW, winSill, T, winX, winSill / 2, z, `${name}_Sill`, group, colliders);
    addSolidBlock(winW, lintelH, T, winX, winSill + winH + lintelH / 2, z, `${name}_Lintel`, group, colliders);

    // Window frame & glass
    const winGroup = new THREE.Group();
    winGroup.position.set(winX, winSill + winH / 2, z);
    const glass = new THREE.Mesh(new THREE.BoxGeometry(winW - 0.08, winH - 0.08, 0.015), glassMaterial);
    winGroup.add(glass);
    group.add(winGroup);
  }
}

/**
 * Creates a floating architectural floor label for a room.
 */
function createFloorRoomLabel(roomName, areaM2, x, z) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Background badge
  ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
  ctx.beginPath();
  ctx.roundRect(16, 16, 480, 224, 24);
  ctx.fill();

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Text
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 42px Inter, sans-serif';
  ctx.fillText(roomName, 256, 110);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '32px Inter, sans-serif';
  ctx.fillText(`${areaM2} m² (${(areaM2 * 10.7639).toFixed(0)} sq ft)`, 256, 175);

  const texture = new THREE.CanvasTexture(canvas);
  const geo = new THREE.PlaneGeometry(2.0, 1.0);
  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.88,
    side: THREE.DoubleSide
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(x, 0.015, z);
  return mesh;
}

/**
 * Generates a complete multi-room apartment layout based on the selected configuration.
 * @param {Object} layoutConfig
 * @returns {THREE.Group}
 */
export function generateApartmentLayout(layoutConfig) {
  const layoutType = layoutConfig.layoutType || 'custom';

  // Fallback to custom single room
  if (layoutType === 'custom') {
    return generateRoom(layoutConfig);
  }

  const group = new THREE.Group();
  group.name = 'ApartmentLayout';
  const colliders = [];

  const ceilingGroup = new THREE.Group();
  ceilingGroup.name = 'Ceiling';
  ceilingGroup.visible = false; // Managed by Viewer3D

  // -------------------------------------------------------------
  // LAYOUT 1: 1BHK MODERN APARTMENT
  // Overall Dimensions: ~8.8m wide x 8.0m deep, Height: 3.0m
  // -------------------------------------------------------------
  if (layoutType === '1bhk') {
    const H = 3.0;
    const T = 0.15;

    // Room Definitions & Metadata
    const rooms = [
      { id: 'living', name: 'Living & Dining Area', w: 5.4, l: 4.4, x: -0.8, z: 1.8, flooring: 'hardwood', area: 23.8 },
      { id: 'bedroom', name: 'Master Bedroom', w: 4.4, l: 3.6, x: -1.3, z: -2.2, flooring: 'hardwood', area: 15.8 },
      { id: 'kitchen', name: 'Modular Kitchen', w: 3.4, l: 2.5, x: 2.7, z: 2.75, flooring: 'tile', area: 8.5 },
      { id: 'bathroom', name: 'En-Suite Bathroom', w: 2.4, l: 2.1, x: 2.2, z: -2.95, flooring: 'tile', area: 5.0 }
    ];

    const totalCarpetArea = rooms.reduce((acc, r) => acc + r.area, 0).toFixed(1);

    // 1. FLOORS & LABELS
    rooms.forEach((r) => {
      const floorGeo = new THREE.BoxGeometry(r.w, 0.05, r.l);
      const floorMat = new THREE.MeshStandardMaterial({
        roughness: r.flooring === 'hardwood' ? 0.45 : 0.25,
        metalness: 0.05
      });
      const tex = getFlooringTexture(r.flooring, r.w, r.l);
      if (tex) floorMat.map = tex;

      const floorMesh = new THREE.Mesh(floorGeo, floorMat);
      floorMesh.position.set(r.x, -0.025, r.z);
      floorMesh.receiveShadow = true;
      floorMesh.add(createEdgeOutline(floorGeo));
      group.add(floorMesh);

      // Room label badge
      group.add(createFloorRoomLabel(r.name, r.area, r.x, r.z));

      // Individual Room Ceiling with Point Light
      const ceilGeo = new THREE.BoxGeometry(r.w, 0.04, r.l);
      const ceilMesh = new THREE.Mesh(ceilGeo, ceilingMaterial);
      ceilMesh.position.set(r.x, H + 0.02, r.z);
      ceilingGroup.add(ceilMesh);

      // Light luminaire
      const luminaire = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.03, 16), frameMaterial);
      luminaire.position.set(r.x, H - 0.015, r.z);
      ceilingGroup.add(luminaire);

      const light = new THREE.PointLight(0xfff7ed, 0.75, Math.max(r.w, r.l) * 2.0);
      light.position.set(r.x, H - 0.12, r.z);
      light.castShadow = true;
      ceilingGroup.add(light);
    });

    group.add(ceilingGroup);

    // 2. EXTERIOR WALLS
    // South Exterior Wall (Z = 4.0): Entrance Door in Living Room
    addDoorwayWall(5.4, H, T, 1.0, 2.15, 0.5, -0.8, 0, 4.0, false, 'Ext_South_Living', group, colliders, true);
    // South Wall of Kitchen (Z = 4.0)
    addSolidBlock(3.4, H, T, 2.7, H / 2, 4.0, 'Ext_South_Kitchen', group, colliders);

    // North Exterior Wall (Z = -4.0): Windows in Bedroom and Bathroom
    addWindowWall(4.4, H, T, 1.8, 1.2, 0.9, 0, -1.3, 0, -4.0, false, 'Ext_North_Bedroom', group, colliders);
    addWindowWall(2.4, H, T, 1.0, 0.8, 1.3, 0, 2.2, 0, -4.0, false, 'Ext_North_Bathroom', group, colliders);

    // West Exterior Wall (X = -3.5): Running along Bedroom & Living Room
    addWindowWall(8.0, H, T, 2.2, 1.3, 0.9, 1.5, -3.5, 0, 0.0, true, 'Ext_West', group, colliders);

    // East Exterior Wall (X = 4.4): Kitchen window & Bedroom side
    addWindowWall(8.0, H, T, 1.6, 1.1, 1.0, 2.5, 4.4, 0, 0.0, true, 'Ext_East', group, colliders);

    // 3. INTERNAL PARTITION WALLS & CONNECTING DOORWAYS
    // Partition 1: Between Bedroom & Living Room (Z = -0.4, X from -3.5 to 0.9, length 4.4m)
    // Includes an open interior doorway so you can walk from Living to Bedroom!
    addDoorwayWall(4.4, H, T, 0.95, 2.1, 0.4, -1.3, 0, -0.4, false, 'Partition_Living_Bedroom', group, colliders, false);

    // Partition 2: Between Living Room & Kitchen (X = 1.9, Z from 0.5 to 4.0, length 3.5m)
    // Wide open kitchen archway
    addDoorwayWall(3.5, H, T, 1.4, 2.3, 0.2, 1.9, 0, 2.25, true, 'Partition_Living_Kitchen', group, colliders, false);

    // Partition 3: Between Bedroom & Bathroom (X = 0.9, Z from -4.0 to -1.9, length 2.1m)
    // Interconnecting doorway into the bathroom
    addDoorwayWall(2.1, H, T, 0.85, 2.05, 0, 0.9, 0, -2.95, true, 'Partition_Bed_Bath', group, colliders, false);

    // Metadata
    group.userData = {
      layoutType: '1bhk',
      title: '1BHK Modern Apartment',
      floorAreaM2: totalCarpetArea,
      rooms: rooms,
      colliders: colliders,
      spawnPoints: {
        living: [ -0.8, 1.65, 2.5 ],
        bedroom: [ -1.3, 1.65, -1.8 ],
        kitchen: [ 2.7, 1.65, 2.5 ],
        bathroom: [ 2.2, 1.65, -2.8 ]
      }
    };
  }

  // -------------------------------------------------------------
  // LAYOUT 2: 2BHK EXECUTIVE FLAT
  // Overall Dimensions: ~11.0m wide x 9.5m deep, Height: 3.0m
  // -------------------------------------------------------------
  else if (layoutType === '2bhk') {
    const H = 3.0;
    const T = 0.15;

    const rooms = [
      { id: 'living', name: 'Grand Living & Dining', w: 6.2, l: 4.8, x: -1.0, z: 2.0, flooring: 'hardwood', area: 29.8 },
      { id: 'master_bed', name: 'Master Suite', w: 4.5, l: 4.0, x: -1.8, z: -2.4, flooring: 'hardwood', area: 18.0 },
      { id: 'second_bed', name: 'Guest Bedroom / Study', w: 3.8, l: 3.4, x: 2.8, z: -2.7, flooring: 'hardwood', area: 12.9 },
      { id: 'kitchen', name: 'Gourmet Kitchen', w: 3.6, l: 2.8, x: 3.1, z: 0.8, flooring: 'tile', area: 10.1 },
      { id: 'master_bath', name: 'Master En-Suite', w: 2.2, l: 2.0, x: -4.3, z: -2.4, flooring: 'tile', area: 4.4 },
      { id: 'guest_bath', name: 'Common Powder Room', w: 2.0, l: 1.8, x: 3.1, z: 3.5, flooring: 'tile', area: 3.6 }
    ];

    const totalCarpetArea = rooms.reduce((acc, r) => acc + r.area, 0).toFixed(1);

    rooms.forEach((r) => {
      const floorGeo = new THREE.BoxGeometry(r.w, 0.05, r.l);
      const floorMat = new THREE.MeshStandardMaterial({
        roughness: r.flooring === 'hardwood' ? 0.45 : 0.25,
        metalness: 0.05
      });
      const tex = getFlooringTexture(r.flooring, r.w, r.l);
      if (tex) floorMat.map = tex;

      const floorMesh = new THREE.Mesh(floorGeo, floorMat);
      floorMesh.position.set(r.x, -0.025, r.z);
      floorMesh.receiveShadow = true;
      floorMesh.add(createEdgeOutline(floorGeo));
      group.add(floorMesh);

      group.add(createFloorRoomLabel(r.name, r.area, r.x, r.z));

      // Ceilings & Lights
      const ceilMesh = new THREE.Mesh(new THREE.BoxGeometry(r.w, 0.04, r.l), ceilingMaterial);
      ceilMesh.position.set(r.x, H + 0.02, r.z);
      ceilingGroup.add(ceilMesh);

      const luminaire = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.28, 0.03, 16), frameMaterial);
      luminaire.position.set(r.x, H - 0.015, r.z);
      ceilingGroup.add(luminaire);

      const light = new THREE.PointLight(0xfff7ed, 0.8, Math.max(r.w, r.l) * 2.1);
      light.position.set(r.x, H - 0.12, r.z);
      light.castShadow = true;
      ceilingGroup.add(light);
    });

    group.add(ceilingGroup);

    // Exterior Envelope
    // South Wall: Entrance Door & Living Room Balcony Window
    addDoorwayWall(6.2, H, T, 1.05, 2.2, -1.0, -1.0, 0, 4.4, false, 'Ext_South_Living', group, colliders, true);
    addWindowWall(3.6, H, T, 2.4, 1.4, 0.8, 0, 3.1, 0, 4.4, false, 'Ext_South_GuestBath', group, colliders);

    // North Wall: Master Suite & Bedroom Windows
    addWindowWall(4.5, H, T, 2.0, 1.2, 0.9, 0, -1.8, 0, -4.4, false, 'Ext_North_Master', group, colliders);
    addWindowWall(3.8, H, T, 1.8, 1.2, 0.9, 0, 2.8, 0, -4.4, false, 'Ext_North_SecondBed', group, colliders);

    // West Exterior Wall
    addWindowWall(8.8, H, T, 2.0, 1.2, 0.9, -1.5, -5.4, 0, 0, true, 'Ext_West', group, colliders);

    // East Exterior Wall
    addWindowWall(8.8, H, T, 2.0, 1.2, 0.9, 1.0, 4.9, 0, 0, true, 'Ext_East', group, colliders);

    // Internal Partitions & Doors
    // Living to Master Suite (Z = -0.4)
    addDoorwayWall(4.5, H, T, 0.95, 2.15, 0.5, -1.8, 0, -0.4, false, 'Part_Living_Master', group, colliders, false);

    // Living to Second Bedroom (Z = -0.4)
    addDoorwayWall(3.8, H, T, 0.95, 2.15, -0.4, 2.8, 0, -0.4, false, 'Part_Living_SecondBed', group, colliders, false);

    // Living to Kitchen (X = 2.1)
    addDoorwayWall(4.8, H, T, 1.6, 2.3, -0.2, 2.1, 0, 2.0, true, 'Part_Living_Kitchen', group, colliders, false);

    // Master Bedroom to Master Bath (X = -3.2)
    addDoorwayWall(4.0, H, T, 0.85, 2.05, 0, -3.2, 0, -2.4, true, 'Part_Master_Bath', group, colliders, false);

    // Kitchen to Powder Room (Z = 2.2)
    addDoorwayWall(3.6, H, T, 0.85, 2.05, 0.3, 3.1, 0, 2.2, false, 'Part_Kitchen_Powder', group, colliders, false);

    group.userData = {
      layoutType: '2bhk',
      title: '2BHK Executive Flat',
      floorAreaM2: totalCarpetArea,
      rooms: rooms,
      colliders: colliders,
      spawnPoints: {
        living: [ -1.0, 1.65, 3.0 ],
        master_bed: [ -1.8, 1.65, -2.0 ],
        second_bed: [ 2.8, 1.65, -2.0 ],
        kitchen: [ 3.1, 1.65, 0.8 ],
        master_bath: [ -4.3, 1.65, -2.4 ],
        guest_bath: [ 3.1, 1.65, 3.5 ]
      }
    };
  }

  return group;
}
