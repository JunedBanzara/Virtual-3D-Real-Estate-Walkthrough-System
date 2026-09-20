import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { generateApartmentLayout } from '../geometry/layoutGenerator';
import { createAvatar, updateAvatarAnimation } from '../geometry/avatarGenerator';
import { build3DFromScannedBlueprint } from '../geometry/blueprintScanner';
import { createFurnitureMesh, FURNITURE_CATALOG } from '../geometry/furnitureLibrary';
import FurnitureCatalogDrawer from './FurnitureCatalogDrawer';
import FurnitureGizmoToolbar from './FurnitureGizmoToolbar';

function loadSavedStagedItems(layoutType) {
  try {
    const key = `virtual_re_staged_furniture_${layoutType || 'custom'}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

export default function Viewer3D({
  roomData,
  isStagingOpen: externalStagingOpen,
  onToggleStaging: externalToggleStaging
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const orbitControlsRef = useRef(null);
  const pointerControlsRef = useRef(null);
  const currentRoomGroupRef = useRef(null);
  const gridHelperRef = useRef(null);
  const avatarRef = useRef(null);
  const animationFrameIdRef = useRef(null);

  // Lighting references for dynamic solar simulation
  const ambientLightRef = useRef(null);
  const sunLightRef = useRef(null);
  const fillLightRef = useRef(null);
  const moonLightRef = useRef(null);

  // View state: 'orbit' | 'fps' | 'tps'
  const [navMode, setNavMode] = useState('orbit');
  const [orbitAngle, setOrbitAngle] = useState('perspective');
  const [isPointerLocked, setIsPointerLocked] = useState(false);

  // Furniture Staging System State
  const [internalCatalogOpen, setInternalCatalogOpen] = useState(false);
  const isCatalogOpen = externalStagingOpen !== undefined ? externalStagingOpen : internalCatalogOpen;
  const setIsCatalogOpen = useCallback(
    (actionOrValue) => {
      if (externalToggleStaging) {
        if (typeof actionOrValue === 'function') {
          externalToggleStaging((prev) => actionOrValue(externalStagingOpen !== undefined ? externalStagingOpen : prev));
        } else {
          externalToggleStaging(actionOrValue);
        }
      } else {
        setInternalCatalogOpen(actionOrValue);
      }
    },
    [externalStagingOpen, externalToggleStaging]
  );

  const [stagedItems, setStagedItems] = useState(() => loadSavedStagedItems(roomData?.layoutType));
  const [selectedFurnitureId, setSelectedFurnitureId] = useState(null);
  const [gizmoMode, setGizmoMode] = useState('translate'); // 'translate' | 'rotate' | 'scale'
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [isDragOverCanvas, setIsDragOverCanvas] = useState(false);
  const dragCounterRef = useRef(0);

  const initialLayoutTypeRef = useRef(roomData?.layoutType);
  const furnitureGroupRef = useRef(new THREE.Group());
  const transformControlsRef = useRef(null);
  const isDraggingGizmoRef = useRef(false);
  const wasDraggingGizmoRef = useRef(false);
  const raycasterRef = useRef(new THREE.Raycaster());
  const pointerDownPosRef = useRef({ x: 0, y: 0 });

  // Player position & movement physics
  const playerPos = useRef(new THREE.Vector3(0, 1.65, 2.0));
  const keysPressed = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false
  });
  const velocity = useRef(new THREE.Vector3());
  const prevTime = useRef(0);

  // Synchronize ceiling visibility with walkthrough mode
  const updateCeilingVisibility = useCallback((isWalkthrough) => {
    if (!currentRoomGroupRef.current) return;
    const ceiling = currentRoomGroupRef.current.getObjectByName('Ceiling');
    if (ceiling) {
      ceiling.visible = isWalkthrough;
    }
  }, []);

  // Initialize Three.js Scene, Camera, Renderer, and Controls
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    prevTime.current = performance.now();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0f17); // Dark modern slate
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(8, 8, 10);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls (CAD Overview)
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.05;
    orbitControls.maxPolarAngle = Math.PI / 2 + 0.05;
    orbitControls.minDistance = 1;
    orbitControls.maxDistance = 150;
    orbitControlsRef.current = orbitControls;

    // 5. Pointer Lock Controls (Walkthrough - FPS & TPS)
    const pointerControls = new PointerLockControls(camera, container);
    pointerControlsRef.current = pointerControls;

    pointerControls.addEventListener('lock', () => {
      setIsPointerLocked(true);
    });
    pointerControls.addEventListener('unlock', () => {
      setIsPointerLocked(false);
    });

    // 6. Lighting Engine
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // Dynamic Sunlight (Key directional light with soft shadow mapping)
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.35);
    sunLight.position.set(15, 22, 15);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 70;
    const shadowDist = 18;
    sunLight.shadow.camera.left = -shadowDist;
    sunLight.shadow.camera.right = shadowDist;
    sunLight.shadow.camera.top = shadowDist;
    sunLight.shadow.camera.bottom = -shadowDist;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Fill Light
    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.4);
    fillLight.position.set(-12, 12, -12);
    scene.add(fillLight);
    fillLightRef.current = fillLight;

    // Subtle Moonlight (Active during Night Mode)
    const moonLight = new THREE.DirectionalLight(0x38bdf8, 0);
    moonLight.position.set(-10, 20, -10);
    moonLight.castShadow = true;
    scene.add(moonLight);
    moonLightRef.current = moonLight;

    // 7. 3D Visitor Avatar
    const avatar = createAvatar();
    avatar.visible = false;
    scene.add(avatar);
    avatarRef.current = avatar;

    // 8. Furniture Staging Group & TransformControls
    const furnitureGroup = furnitureGroupRef.current;
    furnitureGroup.name = 'FurnitureStagingGroup';
    scene.add(furnitureGroup);

    // Populate saved staged furniture meshes if any
    const initialSaved = loadSavedStagedItems(initialLayoutTypeRef.current);
    if (initialSaved.length > 0 && furnitureGroup.children.length === 0) {
      initialSaved.forEach((item) => {
        const mesh = createFurnitureMesh(item.typeId);
        mesh.userData.instanceId = item.instanceId;
        mesh.userData.name = item.name;
        mesh.userData.typeId = item.typeId;
        mesh.position.set(item.position.x, item.position.y || 0, item.position.z);
        if (item.rotation) mesh.rotation.set(item.rotation.x, item.rotation.y, item.rotation.z);
        if (item.scale) mesh.scale.set(item.scale.x, item.scale.y, item.scale.z);
        furnitureGroup.add(mesh);
      });
    }

    const transformControls = new TransformControls(camera, renderer.domElement);
    transformControls.size = 0.85;
    transformControlsRef.current = transformControls;
    const gizmoHelper = transformControls.getHelper();
    gizmoHelper.name = 'TransformGizmoHelper';
    scene.add(gizmoHelper);

    transformControls.addEventListener('dragging-changed', (event) => {
      orbitControls.enabled = !event.value;
      isDraggingGizmoRef.current = event.value;
      if (event.value) {
        wasDraggingGizmoRef.current = true;
      } else {
        setTimeout(() => {
          wasDraggingGizmoRef.current = false;
        }, 150);
      }
    });

    transformControls.addEventListener('objectChange', () => {
      const obj = transformControls.object;
      if (!obj) return;
      if (transformControls.getMode() === 'translate') {
        obj.position.y = 0;
      }
      setStagedItems((prev) =>
        prev.map((item) =>
          item.instanceId === obj.userData.instanceId
            ? {
                ...item,
                position: { x: obj.position.x, y: obj.position.y, z: obj.position.z },
                rotation: { x: obj.rotation.x, y: obj.rotation.y, z: obj.rotation.z },
                scale: { x: obj.scale.x, y: obj.scale.y, z: obj.scale.z }
              }
            : item
        )
      );
    });

    // 9. Keyboard Handlers (WASD + V perspective hotkey)
    const onKeyDown = (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keysPressed.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keysPressed.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keysPressed.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keysPressed.current.right = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keysPressed.current.sprint = true;
          break;
        case 'KeyV':
          setNavMode((prev) => {
            if (prev === 'fps') return 'tps';
            if (prev === 'tps') return 'fps';
            return prev;
          });
          break;
        default:
          break;
      }
    };

    const onKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keysPressed.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keysPressed.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keysPressed.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keysPressed.current.right = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keysPressed.current.sprint = false;
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // 9. 60 FPS Render, Physics & Spring-Arm Camera Loop
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      const time = performance.now();
      const delta = Math.min((time - prevTime.current) / 1000, 0.1);
      prevTime.current = time;

      const isWalkthrough = pointerControls.isLocked;

      if (isWalkthrough) {
        const vel = velocity.current;
        const keys = keysPressed.current;

        vel.x -= vel.x * 10.0 * delta;
        vel.z -= vel.z * 10.0 * delta;

        const moveZ = Number(keys.forward) - Number(keys.backward);
        const moveX = Number(keys.right) - Number(keys.left);
        const isMoving = moveZ !== 0 || moveX !== 0;

        const baseSpeed = keys.sprint ? 5.5 : 3.2;

        if (isMoving) {
          const inputDir = new THREE.Vector2(moveX, moveZ).normalize();
          vel.x += inputDir.x * baseSpeed * 10.0 * delta;
          vel.z += inputDir.y * baseSpeed * 10.0 * delta;
        }

        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(camera.up, forward).negate().normalize();

        const dispX = (right.x * vel.x + forward.x * vel.z) * delta;
        const dispZ = (right.z * vel.x + forward.z * vel.z) * delta;
        const wallColliders = currentRoomGroupRef.current?.userData?.colliders || [];
        const colliders = [...wallColliders];
        if (furnitureGroupRef.current) {
          for (const item of furnitureGroupRef.current.children) {
            colliders.push(new THREE.Box3().setFromObject(item));
          }
        }
        const playerRadius = 0.25;

        // X-axis collision
        const testPosX = playerPos.current.x + dispX;
        const playerBoxX = new THREE.Box3(
          new THREE.Vector3(testPosX - playerRadius, 0.2, playerPos.current.z - playerRadius),
          new THREE.Vector3(testPosX + playerRadius, 1.8, playerPos.current.z + playerRadius)
        );

        let hitX = false;
        for (const col of colliders) {
          if (col.intersectsBox(playerBoxX)) {
            hitX = true;
            break;
          }
        }
        if (!hitX) {
          playerPos.current.x = testPosX;
        } else {
          vel.x = 0;
        }

        // Z-axis collision
        const testPosZ = playerPos.current.z + dispZ;
        const playerBoxZ = new THREE.Box3(
          new THREE.Vector3(playerPos.current.x - playerRadius, 0.2, testPosZ - playerRadius),
          new THREE.Vector3(playerPos.current.x + playerRadius, 1.8, testPosZ + playerRadius)
        );

        let hitZ = false;
        for (const col of colliders) {
          if (col.intersectsBox(playerBoxZ)) {
            hitZ = true;
            break;
          }
        }
        if (!hitZ) {
          playerPos.current.z = testPosZ;
        } else {
          vel.z = 0;
        }

        playerPos.current.y = 1.65;

        // Camera Modes
        if (avatarRef.current && avatarRef.current.visible) {
          // --- TPS MODE ---
          avatarRef.current.position.set(playerPos.current.x, 0, playerPos.current.z);

          const lookYaw = Math.atan2(forward.x, forward.z);
          avatarRef.current.rotation.y = lookYaw;

          updateAvatarAnimation(avatarRef.current, isMoving, keys.sprint, delta);

          const targetFocus = new THREE.Vector3(playerPos.current.x, 1.45, playerPos.current.z);
          const idealDistance = 2.2;
          const shoulderOffset = 0.25;
          const heightOffset = 0.35;

          const camBack = forward.clone().negate().multiplyScalar(idealDistance);
          const camRight = right.clone().multiplyScalar(shoulderOffset);
          const idealCamPos = targetFocus.clone().add(camBack).add(camRight);
          idealCamPos.y += heightOffset;

          const rayDirection = idealCamPos.clone().sub(targetFocus).normalize();
          const rayLength = targetFocus.distanceTo(idealCamPos);
          const ray = new THREE.Ray(targetFocus, rayDirection);

          let minHitDist = rayLength;
          const hitTarget = new THREE.Vector3();

          for (const col of colliders) {
            if (ray.intersectBox(col, hitTarget)) {
              const d = targetFocus.distanceTo(hitTarget);
              if (d < minHitDist) {
                minHitDist = d;
              }
            }
          }

          const finalDist = Math.max(0.4, minHitDist - 0.25);
          const finalCamPos = targetFocus.clone().add(rayDirection.multiplyScalar(finalDist));

          camera.position.copy(finalCamPos);
        } else {
          // --- FPS MODE ---
          camera.position.copy(playerPos.current);
        }
      } else {
        orbitControls.update();
      }

      renderer.render(scene, camera);
    };
    animate();

    // 10. Resize Handling
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      transformControls.dispose();
      orbitControls.dispose();
      pointerControls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Solar Simulation & Daylight Engine based on roomData.timeOfDay
  useEffect(() => {
    const sunLight = sunLightRef.current;
    const fillLight = fillLightRef.current;
    const moonLight = moonLightRef.current;
    const ambientLight = ambientLightRef.current;
    const scene = sceneRef.current;
    if (!sunLight || !fillLight || !moonLight || !ambientLight || !scene) return;

    const time = roomData?.timeOfDay ?? 12.0;

    if (time >= 6.0 && time < 19.0) {
      // Daytime to Golden Hour
      const solarRatio = (time - 6.0) / 13.0;
      const solarAngle = solarRatio * Math.PI;

      const sunX = -Math.cos(solarAngle) * 26;
      const sunY = Math.max(2, Math.sin(solarAngle) * 23);
      const sunZ = 14;
      sunLight.position.set(sunX, sunY, sunZ);

      if (time < 8.0) {
        // Dawn
        sunLight.color.setHex(0xffba75);
        sunLight.intensity = 0.95;
        ambientLight.intensity = 0.5;
        scene.background.setHex(0x1a1a2e);
      } else if (time > 16.5) {
        // Golden Hour / Sunset
        sunLight.color.setHex(0xf97316);
        sunLight.intensity = 1.15;
        ambientLight.intensity = 0.45;
        scene.background.setHex(0x271728);
      } else {
        // Noon Daylight
        sunLight.color.setHex(0xffffff);
        sunLight.intensity = 1.35;
        ambientLight.intensity = 0.65;
        scene.background.setHex(0x0b0f17);
      }

      moonLight.intensity = 0;
      fillLight.intensity = 0.4;
    } else {
      // Night Mode
      sunLight.intensity = 0;
      fillLight.intensity = 0.05;
      ambientLight.intensity = 0.25;
      moonLight.intensity = 0.35;
      scene.background.setHex(0x020617);
    }

    // Boost interior point lights during evening/night
    if (currentRoomGroupRef.current) {
      currentRoomGroupRef.current.traverse((child) => {
        if (child.isPointLight) {
          child.intensity = (time >= 18.0 || time < 6.5) ? 1.4 : 0.8;
        }
      });
    }
  }, [roomData?.timeOfDay]);

  // Update Geometry ONLY when architectural parameters change (NOT on timeOfDay or navMode)
  const architecturalKey = JSON.stringify({
    layoutType: roomData?.layoutType,
    scannedData: roomData?.scannedData,
    width: roomData?.width,
    length: roomData?.length,
    wallHeight: roomData?.wallHeight,
    wallThickness: roomData?.wallThickness,
    door: roomData?.door,
    window: roomData?.window,
    flooring: roomData?.flooring
  });

  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const orbitControls = orbitControlsRef.current;
    if (!scene || !camera || !orbitControls || !roomData) return;

    // Remove previous room
    if (currentRoomGroupRef.current) {
      scene.remove(currentRoomGroupRef.current);
      currentRoomGroupRef.current.traverse((child) => {
        if (child.isMesh) {
          child.geometry?.dispose();
        }
      });
      currentRoomGroupRef.current = null;
    }

    // Remove previous grid
    if (gridHelperRef.current) {
      scene.remove(gridHelperRef.current);
      gridHelperRef.current.geometry?.dispose();
      gridHelperRef.current = null;
    }

    let newLayout;
    if (roomData.layoutType === 'scanned_blueprint' && roomData.scannedData) {
      newLayout = build3DFromScannedBlueprint(roomData.scannedData);
    } else {
      newLayout = generateApartmentLayout(roomData);
    }

    currentRoomGroupRef.current = newLayout;
    scene.add(newLayout);

    const layoutType = roomData.layoutType || 'custom';
    const span = layoutType === '2bhk' ? 14 : (layoutType === '1bhk' ? 11 : 9);
    const gridSize = Math.ceil(span * 1.6);
    const gridDivisions = Math.max(12, Math.round(gridSize));

    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x38bdf8, 0x1e293b);
    gridHelper.position.y = -0.026;
    gridHelperRef.current = gridHelper;
    scene.add(gridHelper);

    if (newLayout.userData?.spawnPoints?.living) {
      const [sx, sy, sz] = newLayout.userData.spawnPoints.living;
      playerPos.current.set(sx, sy, sz);
    } else {
      playerPos.current.set(0, 1.65, 0);
    }

    const isWalkthrough = navMode === 'fps' || navMode === 'tps';
    updateCeilingVisibility(isWalkthrough);
    if (avatarRef.current) {
      avatarRef.current.visible = navMode === 'tps';
    }

    if (navMode === 'orbit') {
      const camDist = span * 1.35;
      camera.position.set(camDist * 0.8, span * 0.8 + 2.5, camDist * 1.05);
      orbitControls.target.set(0, 1.2, 0);
      camera.lookAt(0, 1.2, 0);
      orbitControls.update();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [architecturalKey, updateCeilingVisibility]);

  // Handle camera mode changes (Orbit vs FPS vs TPS) without destroying room geometry
  useEffect(() => {
    const isWalkthrough = navMode === 'fps' || navMode === 'tps';
    updateCeilingVisibility(isWalkthrough);
    if (avatarRef.current) {
      avatarRef.current.visible = navMode === 'tps';
    }
  }, [navMode, updateCeilingVisibility]);

  // Synchronize staged furniture when layoutType changes
  const prevLayoutTypeRef = useRef(roomData?.layoutType);
  useEffect(() => {
    if (prevLayoutTypeRef.current === roomData?.layoutType) return;
    prevLayoutTypeRef.current = roomData?.layoutType;

    const currentLayout = roomData?.layoutType || 'custom';
    const group = furnitureGroupRef.current;
    if (!group) return;

    if (transformControlsRef.current) {
      transformControlsRef.current.detach();
    }
    setSelectedFurnitureId(null);

    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      child.traverse((c) => {
        if (c.isMesh) c.geometry?.dispose();
      });
    }

    const saved = loadSavedStagedItems(currentLayout);
    saved.forEach((item) => {
      const mesh = createFurnitureMesh(item.typeId);
      mesh.userData.instanceId = item.instanceId;
      mesh.userData.name = item.name;
      mesh.userData.typeId = item.typeId;
      mesh.position.set(item.position.x, item.position.y || 0, item.position.z);
      if (item.rotation) mesh.rotation.set(item.rotation.x, item.rotation.y, item.rotation.z);
      if (item.scale) mesh.scale.set(item.scale.x, item.scale.y, item.scale.z);
      group.add(mesh);
    });
    setStagedItems(saved);
  }, [roomData?.layoutType]);

  // Handle Mode Switch
  const switchNavMode = (mode) => {
    const camera = cameraRef.current;
    const orbitControls = orbitControlsRef.current;
    const pointerControls = pointerControlsRef.current;
    const avatar = avatarRef.current;
    if (!camera || !orbitControls || !pointerControls || !roomData) return;

    if (mode === 'orbit') {
      pointerControls.unlock();
      orbitControls.enabled = true;
      if (avatar) avatar.visible = false;
      updateCeilingVisibility(false);

      const layoutType = roomData.layoutType || 'custom';
      const span = layoutType === '2bhk' ? 14 : (layoutType === '1bhk' ? 11 : 9);
      const camDist = span * 1.35;
      camera.position.set(camDist * 0.8, span * 0.8 + 2.5, camDist * 1.05);
      orbitControls.target.set(0, 1.2, 0);
      camera.lookAt(0, 1.2, 0);
      orbitControls.update();
      setNavMode('orbit');
      setOrbitAngle('perspective');
    } else {
      transformControlsRef.current?.detach();
      setSelectedFurnitureId(null);
      orbitControls.enabled = false;
      updateCeilingVisibility(true);

      if (avatar) {
        avatar.visible = (mode === 'tps');
        avatar.position.set(playerPos.current.x, 0, playerPos.current.z);
      }

      setNavMode(mode);
      pointerControls.lock();
    }
  };

  // Instant Room Teleportation
  const teleportToRoom = useCallback((coords) => {
    if (!coords || coords.length < 3) return;
    const [tx, ty, tz] = coords;
    playerPos.current.set(tx, ty || 1.65, tz);

    if (avatarRef.current) {
      avatarRef.current.position.set(tx, 0, tz);
    }

    if (cameraRef.current && (navMode === 'fps' || navMode === 'tps')) {
      cameraRef.current.position.set(tx, ty || 1.65, tz);
    }
  }, [navMode]);

  useEffect(() => {
    if (roomData?.teleportCoords) {
      teleportToRoom(roomData.teleportCoords);
    }
  }, [roomData?.teleportCoords, teleportToRoom]);

  // Camera angle presets for Orbit mode
  const setCameraView = (type) => {
    const camera = cameraRef.current;
    const orbitControls = orbitControlsRef.current;
    if (!camera || !orbitControls || !roomData) return;

    const layoutType = roomData.layoutType || 'custom';
    const span = layoutType === '2bhk' ? 14 : (layoutType === '1bhk' ? 11 : 9);

    if (type === 'top') {
      camera.position.set(0, span * 1.8 + 2, 0.01);
      orbitControls.target.set(0, 0, 0);
    } else if (type === 'front') {
      camera.position.set(0, 2.5, span * 1.5);
      orbitControls.target.set(0, 1.2, 0);
    } else if (type === 'side') {
      camera.position.set(span * 1.5, 2.5, 0);
      orbitControls.target.set(0, 1.2, 0);
    } else {
      const camDist = span * 1.35;
      camera.position.set(camDist * 0.8, span * 0.8 + 2.5, camDist * 1.05);
      orbitControls.target.set(0, 1.2, 0);
    }

    camera.lookAt(orbitControls.target);
    orbitControls.update();
    setOrbitAngle(type);
  };

  // ---------------------------------------------------------------------------
  // FURNITURE STAGING HANDLERS & GIZMO SYNC
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (transformControlsRef.current) {
      transformControlsRef.current.setMode(gizmoMode);
    }
  }, [gizmoMode]);

  useEffect(() => {
    if (transformControlsRef.current) {
      if (snapEnabled) {
        transformControlsRef.current.setTranslationSnap(0.25);
        transformControlsRef.current.setRotationSnap(THREE.MathUtils.degToRad(15));
        transformControlsRef.current.setScaleSnap(0.1);
      } else {
        transformControlsRef.current.setTranslationSnap(null);
        transformControlsRef.current.setRotationSnap(null);
        transformControlsRef.current.setScaleSnap(null);
      }
    }
  }, [snapEnabled]);

  // Viewport Pointer Pick for Furniture Selection
  const handleCanvasPointerDown = (e) => {
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
    if (transformControlsRef.current?.axis) {
      isDraggingGizmoRef.current = true;
    }
  };

  const handleCanvasPointerUp = (e) => {
    if (navMode !== 'orbit') return;
    if (isDraggingGizmoRef.current || wasDraggingGizmoRef.current) return;
    if (transformControlsRef.current?.axis) return;

    const dx = Math.abs(e.clientX - pointerDownPosRef.current.x);
    const dy = Math.abs(e.clientY - pointerDownPosRef.current.y);
    if (dx > 6 || dy > 6) return; // Orbiting drag, not a click

    const container = mountRef.current;
    if (!container || !cameraRef.current) return;
    const rect = container.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = raycasterRef.current;
    raycaster.setFromCamera(mouse, cameraRef.current);

    // If an item is already attached, check if user clicked on the gizmo helper itself
    const gizmoHelper = sceneRef.current?.getObjectByName('TransformGizmoHelper');
    if (gizmoHelper && transformControlsRef.current?.object) {
      const gizmoHits = raycaster.intersectObject(gizmoHelper, true);
      if (gizmoHits.length > 0) {
        return; // Clicked on gizmo handle; keep active selection!
      }
    }

    const hits = raycaster.intersectObjects(furnitureGroupRef.current.children, true);

    if (hits.length > 0) {
      let current = hits[0].object;
      while (current.parent && current.parent !== furnitureGroupRef.current) {
        current = current.parent;
      }
      if (current.userData?.instanceId) {
        transformControlsRef.current?.attach(current);
        setSelectedFurnitureId(current.userData.instanceId);
        return;
      }
    }

    // Clicked background or floor: deselect
    transformControlsRef.current?.detach();
    setSelectedFurnitureId(null);
  };

  // Drag-and-Drop from Catalog onto Canvas
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    dragCounterRef.current += 1;
    setIsDragOverCanvas(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDragOverCanvas) setIsDragOverCanvas(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0;
      setIsDragOverCanvas(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dragCounterRef.current = 0;
    setIsDragOverCanvas(false);

    let typeId = e.dataTransfer.getData('text/plain');
    if (!typeId) {
      try {
        const json = JSON.parse(e.dataTransfer.getData('application/json'));
        typeId = json?.typeId;
      } catch {
        // ignore
      }
    }
    if (!typeId) return;

    const container = mountRef.current;
    if (!container || !cameraRef.current) return;
    const rect = container.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = raycasterRef.current;
    raycaster.setFromCamera(mouse, cameraRef.current);
    const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersectPoint = new THREE.Vector3();
    const hit = raycaster.ray.intersectPlane(floorPlane, intersectPoint);

    let spawnPos;
    if (hit && Math.abs(intersectPoint.x) < 25 && Math.abs(intersectPoint.z) < 25) {
      spawnPos = intersectPoint;
    } else if (orbitControlsRef.current) {
      spawnPos = new THREE.Vector3(
        orbitControlsRef.current.target.x,
        0,
        orbitControlsRef.current.target.z
      );
    } else {
      spawnPos = new THREE.Vector3(0, 0, 0);
    }

    if (navMode !== 'orbit') {
      switchNavMode('orbit');
    }

    handleAddFurniture(typeId, spawnPos);
  };

  const handleAddFurniture = (typeId, customPos = null) => {
    const meta = FURNITURE_CATALOG.find((i) => i.id === typeId);
    const instanceId = 'furn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);

    const mesh = createFurnitureMesh(typeId);
    mesh.userData.instanceId = instanceId;
    mesh.userData.name = meta?.name || 'Furniture Item';
    mesh.userData.typeId = typeId;

    let posX = 0;
    let posZ = 0;
    if (customPos) {
      posX = customPos.x;
      posZ = customPos.z;
    } else if (orbitControlsRef.current) {
      posX = orbitControlsRef.current.target.x;
      posZ = orbitControlsRef.current.target.z;
    }

    mesh.position.set(posX, 0, posZ);
    furnitureGroupRef.current.add(mesh);

    if (navMode !== 'orbit') {
      switchNavMode('orbit');
    }

    transformControlsRef.current?.attach(mesh);
    setSelectedFurnitureId(instanceId);

    const newItem = {
      instanceId,
      typeId,
      name: meta?.name || 'Furniture Item',
      position: { x: posX, y: 0, z: posZ },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 }
    };

    setStagedItems((prev) => [...prev, newItem]);
  };

  const handleRotate90 = () => {
    const tc = transformControlsRef.current;
    if (!tc || !tc.object) return;
    tc.object.rotation.y += Math.PI / 2;
    const obj = tc.object;
    setStagedItems((prev) =>
      prev.map((item) =>
        item.instanceId === obj.userData.instanceId
          ? {
              ...item,
              rotation: { x: obj.rotation.x, y: obj.rotation.y, z: obj.rotation.z }
            }
          : item
      )
    );
  };

  const handleDuplicate = () => {
    const tc = transformControlsRef.current;
    if (!tc || !tc.object) return;
    const oldId = tc.object.userData.instanceId;
    const oldItem = stagedItems.find((i) => i.instanceId === oldId);
    if (!oldItem) return;

    const clonePos = new THREE.Vector3(
      tc.object.position.x + 0.4,
      0,
      tc.object.position.z + 0.4
    );
    handleAddFurniture(oldItem.typeId, clonePos);
  };

  const handleDeleteFurnitureById = useCallback((id) => {
    const group = furnitureGroupRef.current;
    const child = group.children.find((c) => c.userData?.instanceId === id);
    if (child) {
      if (transformControlsRef.current?.object === child) {
        transformControlsRef.current.detach();
      }
      group.remove(child);
      child.traverse((c) => {
        if (c.isMesh) c.geometry?.dispose();
      });
    }
    setStagedItems((prev) => prev.filter((i) => i.instanceId !== id));
    setSelectedFurnitureId((prev) => (prev === id ? null : prev));
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if (selectedFurnitureId) {
      handleDeleteFurnitureById(selectedFurnitureId);
    }
  }, [selectedFurnitureId, handleDeleteFurnitureById]);

  const handleDeselect = useCallback(() => {
    transformControlsRef.current?.detach();
    setSelectedFurnitureId(null);
  }, []);

  const handleSelectFurnitureById = (id) => {
    const group = furnitureGroupRef.current;
    const child = group.children.find((c) => c.userData?.instanceId === id);
    if (child) {
      if (navMode !== 'orbit') {
        switchNavMode('orbit');
      }
      transformControlsRef.current?.attach(child);
      setSelectedFurnitureId(id);
      if (orbitControlsRef.current) {
        orbitControlsRef.current.target.set(child.position.x, 0.8, child.position.z);
        orbitControlsRef.current.update();
      }
    }
  };

  const handleExportLayout = () => {
    const exportData = {
      layoutType: roomData?.layoutType,
      timestamp: new Date().toISOString(),
      stagedItems
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `furniture_layout_${roomData?.layoutType || 'custom'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportLayout = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data && Array.isArray(data.stagedItems)) {
          handleClearAllFurniture();
          data.stagedItems.forEach((item) => {
            const mesh = createFurnitureMesh(item.typeId);
            mesh.userData.instanceId = item.instanceId;
            mesh.userData.name = item.name;
            mesh.userData.typeId = item.typeId;
            mesh.position.set(item.position.x, item.position.y || 0, item.position.z);
            if (item.rotation) mesh.rotation.set(item.rotation.x, item.rotation.y, item.rotation.z);
            if (item.scale) mesh.scale.set(item.scale.x, item.scale.y, item.scale.z);
            furnitureGroupRef.current.add(mesh);
          });
          setStagedItems(data.stagedItems);
        }
      } catch (err) {
        console.error('Failed to import layout:', err);
      }
    };
    reader.readAsText(file);
  };

  // LocalStorage Persistence
  const storageKey = `virtual_re_staged_furniture_${roomData?.layoutType || 'custom'}`;

  const handleClearAllFurniture = useCallback(() => {
    if (transformControlsRef.current) {
      transformControlsRef.current.detach();
    }
    const group = furnitureGroupRef.current;
    if (group) {
      while (group.children.length > 0) {
        const child = group.children[0];
        group.remove(child);
        child.traverse((c) => {
          if (c.isMesh) {
            c.geometry?.dispose();
          }
        });
      }
    }
    setStagedItems([]);
    setSelectedFurnitureId(null);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(stagedItems));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [stagedItems, storageKey]);

  // Keyboard Shortcuts for Staging in Orbit View
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (navMode === 'orbit') {
        if (e.key === 'g' || e.key === 'G') setGizmoMode('translate');
        if (e.key === 'r' || e.key === 'R') setGizmoMode('rotate');
        if (e.key === 's' || e.key === 'S') setGizmoMode('scale');
        if (e.key === 'Delete' || e.key === 'Backspace') handleDeleteSelected();
        if (e.key === 'Escape') handleDeselect();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navMode, handleDeleteSelected, handleDeselect]);

  const selectedItem = stagedItems.find((i) => i.instanceId === selectedFurnitureId);

  return (
    <div className="viewer-wrapper">
      {/* Top Navigation Toolbar */}
      <div className="viewer-toolbar">
        {/* Tri-Mode Switcher */}
        <div className="mode-switcher">
          <button
            type="button"
            className={`btn-mode ${navMode === 'orbit' ? 'active' : ''}`}
            onClick={() => switchNavMode('orbit')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            CAD Orbit View
          </button>
          <button
            type="button"
            className={`btn-mode ${navMode === 'fps' ? 'active' : ''}`}
            onClick={() => switchNavMode('fps')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="7" r="4" />
              <path d="M5.5 21v-3a4 4 0 0 1 4-4h5a4 4 0 0 1 4 4v3" />
            </svg>
            1st Person (FPS)
          </button>
          <button
            type="button"
            className={`btn-mode ${navMode === 'tps' ? 'active' : ''}`}
            onClick={() => switchNavMode('tps')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            3rd Person (TPS)
          </button>
        </div>

        {/* Orbit View Presets */}
        {navMode === 'orbit' && (
          <div className="view-buttons">
            <button
              type="button"
              className={`btn-view ${orbitAngle === 'perspective' ? 'active' : ''}`}
              onClick={() => setCameraView('perspective')}
            >
              Perspective 3D
            </button>
            <button
              type="button"
              className={`btn-view ${orbitAngle === 'top' ? 'active' : ''}`}
              onClick={() => setCameraView('top')}
            >
              Top View (2D)
            </button>
            <button
              type="button"
              className={`btn-view ${orbitAngle === 'front' ? 'active' : ''}`}
              onClick={() => setCameraView('front')}
            >
              Front View
            </button>
            <button
              type="button"
              className={`btn-view ${orbitAngle === 'side' ? 'active' : ''}`}
              onClick={() => setCameraView('side')}
            >
              Side View
            </button>
          </div>
        )}

        {/* Furniture Staging Catalog Trigger */}
        <button
          type="button"
          className={`btn-furniture-staging ${isCatalogOpen ? 'active' : ''}`}
          onClick={() => setIsCatalogOpen((prev) => !prev)}
          title="Toggle Furniture Catalog & Staging Inspector"
          style={{ pointerEvents: 'auto' }}
        >
          <span className="staging-icon">🛋️</span>
          <span>Furniture Staging</span>
          {stagedItems.length > 0 && (
            <span className="staging-count-pill">{stagedItems.length}</span>
          )}
        </button>

        {/* Walkthrough Status Badge */}
        {(navMode === 'fps' || navMode === 'tps') && (
          <div className="fps-status-badge">
            <span className="live-dot pulse"></span>
            <span>
              {navMode === 'tps' ? '👤 3rd-Person Avatar Tour' : '🚶 1st-Person Eye-Level (1.65m)'}
            </span>
            <span className="hotkey-pill">[V] Toggle View</span>
          </div>
        )}
      </div>

      {/* 3D WebGL Canvas with Click Picking and Drag-and-Drop */}
      <div
        ref={mountRef}
        className={`threejs-canvas-container ${isDragOverCanvas ? 'drag-over-active' : ''}`}
        onPointerDown={handleCanvasPointerDown}
        onPointerUp={handleCanvasPointerUp}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragOverCanvas && (
          <div className="canvas-drag-indicator">
            <span>📍 Drop anywhere on the 3D floor</span>
          </div>
        )}
      </div>

      {/* Floating 3D Transform Gizmo HUD Toolbar */}
      {navMode === 'orbit' && selectedItem && (
        <FurnitureGizmoToolbar
          selectedItem={selectedItem}
          gizmoMode={gizmoMode}
          onChangeMode={setGizmoMode}
          onRotate90={handleRotate90}
          onDuplicate={handleDuplicate}
          onDelete={handleDeleteSelected}
          onDeselect={handleDeselect}
          snapEnabled={snapEnabled}
          onToggleSnap={() => setSnapEnabled((prev) => !prev)}
        />
      )}

      {/* Furniture Catalog & Inspector Drawer */}
      <FurnitureCatalogDrawer
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        onAddFurniture={(typeId) => handleAddFurniture(typeId)}
        stagedItems={stagedItems}
        selectedFurnitureId={selectedFurnitureId}
        onSelectFurniture={handleSelectFurnitureById}
        onDeleteFurniture={handleDeleteFurnitureById}
        onClearAllFurniture={handleClearAllFurniture}
        onExportLayout={handleExportLayout}
        onImportLayout={handleImportLayout}
      />

      {/* Crosshair (during active pointer lock in FPS) */}
      {navMode === 'fps' && isPointerLocked && (
        <div className="fps-crosshair">
          <div className="crosshair-dot"></div>
        </div>
      )}

      {/* Walkthrough Guidance Overlay */}
      {(navMode === 'fps' || navMode === 'tps') && !isPointerLocked && (
        <div
          className="fps-overlay"
          onClick={() => pointerControlsRef.current?.lock()}
          role="button"
          tabIndex={0}
        >
          <div className="fps-overlay-card">
            <div className="fps-icon-pulse">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {navMode === 'tps' ? (
                  <>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                  </>
                ) : (
                  <>
                    <circle cx="12" cy="7" r="4" />
                    <path d="M5.5 21v-3a4 4 0 0 1 4-4h5a4 4 0 0 1 4 4v3" />
                  </>
                )}
              </svg>
            </div>
            <h3>
              {navMode === 'tps' ? 'Enter 3rd-Person Avatar Tour' : 'Enter 1st-Person Walkthrough'}
            </h3>
            <p>
              {navMode === 'tps'
                ? 'Control a 3D visitor avatar with real-time walking animations and anti-wall-clip spring arm camera.'
                : 'Experience the property from an authentic human eye-level perspective.'}
            </p>
            <div className="fps-controls-guide">
              <div className="guide-item">
                <span className="key-badge">W</span>
                <span className="key-badge">A</span>
                <span className="key-badge">S</span>
                <span className="key-badge">D</span>
                <span className="guide-desc">Walk / Strafe</span>
              </div>
              <div className="guide-item">
                <span className="key-badge">Shift</span>
                <span className="guide-desc">Sprint</span>
              </div>
              <div className="guide-item">
                <span className="key-badge">V</span>
                <span className="guide-desc">Switch 1st / 3rd Person</span>
              </div>
              <div className="guide-item">
                <span className="key-badge">ESC</span>
                <span className="guide-desc">Release Cursor</span>
              </div>
            </div>
            <button type="button" className="btn-start-tour">
              Start Virtual Tour
            </button>
            <button
              type="button"
              className="btn-exit-walkthrough"
              onClick={(e) => {
                e.stopPropagation();
                switchNavMode('orbit');
              }}
            >
              Back to CAD Orbit View
            </button>
          </div>
        </div>
      )}

      {/* Persistent Walkthrough HUD */}
      {(navMode === 'fps' || navMode === 'tps') && isPointerLocked && (
        <div className="fps-active-hud">
          <span><strong>WASD:</strong> Move</span>
          <span>·</span>
          <span><strong>Shift:</strong> Sprint</span>
          <span>·</span>
          <span><strong>[V]:</strong> Switch to {navMode === 'fps' ? '3rd Person (TPS)' : '1st Person (FPS)'}</span>
          <span>·</span>
          <span><strong>ESC:</strong> Release Cursor</span>
        </div>
      )}
    </div>
  );
}
