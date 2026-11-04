import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { generateHomeLayout } from '../geometry/homeGenerator';
import { createFurnitureMesh } from '../geometry/furnitureLibrary';
import FurnitureGizmoToolbar from './FurnitureGizmoToolbar';

export default function Viewer3D({
  project,
  navMode = 'orbit',
  onNavModeChange,
  orbitAngle = 'perspective',
  showCeiling = true,
  selectedWall = null,
  onSelectWall,
  selectedFurnitureId = null,
  onSelectFurniture,
  stagedItems = [],
  onUpdateStagedItems,
  onAddFurnitureToScene
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const orbitControlsRef = useRef(null);
  const pointerControlsRef = useRef(null);
  const homeGroupRef = useRef(null);
  const gridHelperRef = useRef(null);
  const furnitureGroupRef = useRef(new THREE.Group());
  const transformControlsRef = useRef(null);
  const wallHighlightMeshRef = useRef(null);
  const onUpdateStagedItemsRef = useRef(onUpdateStagedItems);
  useEffect(() => {
    onUpdateStagedItemsRef.current = onUpdateStagedItems;
  }, [onUpdateStagedItems]);

  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [gizmoMode, setGizmoMode] = useState('translate'); // 'translate' | 'rotate' | 'scale'
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [isDragOverCanvas, setIsDragOverCanvas] = useState(false);
  const dragCounterRef = useRef(0);

  const isDraggingGizmoRef = useRef(false);
  const wasDraggingGizmoRef = useRef(false);
  const raycasterRef = useRef(new THREE.Raycaster());
  const pointerDownPosRef = useRef({ x: 0, y: 0 });

  // Player position & movement physics for FPP Walkthrough
  const playerPos = useRef(new THREE.Vector3(0, 1.65, 0));
  const keysPressed = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false
  });
  const velocity = useRef(new THREE.Vector3());
  const prevTime = useRef(0);

  // Initialize Three.js Scene, Camera, Renderer, Controls
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    prevTime.current = performance.now();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0f17); // Sleek modern dark slate
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(10, 10, 12);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls (Bird's-Eye CAD Overview)
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.05;
    orbitControls.maxPolarAngle = Math.PI / 2 + 0.05;
    orbitControls.minDistance = 0.8;
    orbitControls.maxDistance = 150;
    orbitControlsRef.current = orbitControls;

    // 5. Pointer Lock Controls (First-Person Walkthrough FPP)
    const pointerControls = new PointerLockControls(camera, container);
    pointerControlsRef.current = pointerControls;

    pointerControls.addEventListener('lock', () => {
      setIsPointerLocked(true);
    });
    pointerControls.addEventListener('unlock', () => {
      setIsPointerLocked(false);
    });

    // 6. Architectural Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(14, 20, 14);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 60;
    const shadowDist = 16;
    sunLight.shadow.camera.left = -shadowDist;
    sunLight.shadow.camera.right = shadowDist;
    sunLight.shadow.camera.top = shadowDist;
    sunLight.shadow.camera.bottom = -shadowDist;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xf8fafc, 0.25);
    fillLight.position.set(-12, 12, -12);
    scene.add(fillLight);

    // 7. Furniture Group
    const furnitureGroup = furnitureGroupRef.current;
    furnitureGroup.name = 'FurnitureStagingGroup';
    scene.add(furnitureGroup);

    // 8. TransformControls for Interactive Gizmo
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
        obj.position.y = 0; // Keep grounded on floor
      }
      if (onUpdateStagedItemsRef.current) {
        onUpdateStagedItemsRef.current((prev) =>
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
      }
    });

    // 9. Keyboard Handlers (WASD Walkthrough)
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

    // 10. Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = performance.now();
      const delta = Math.min((time - prevTime.current) / 1000, 0.1);
      prevTime.current = time;

      if (pointerControls.isLocked) {
        // First-Person Walkthrough Physics
        const keys = keysPressed.current;
        const vel = velocity.current;

        vel.x -= vel.x * 10.0 * delta;
        vel.z -= vel.z * 10.0 * delta;

        const baseSpeed = keys.sprint ? 5.5 : 3.0;

        if (keys.forward) vel.z += baseSpeed * 10.0 * delta;
        if (keys.backward) vel.z -= baseSpeed * 10.0 * delta;
        if (keys.left) vel.x -= baseSpeed * 10.0 * delta;
        if (keys.right) vel.x += baseSpeed * 10.0 * delta;

        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(camera.up, forward).negate().normalize();

        const dispX = (right.x * vel.x + forward.x * vel.z) * delta;
        const dispZ = (right.z * vel.x + forward.z * vel.z) * delta;

        // Collision detection with room boundaries & walls
        const wallColliders = homeGroupRef.current?.userData?.colliders || [];
        const colliders = [...wallColliders];
        if (furnitureGroupRef.current) {
          for (const item of furnitureGroupRef.current.children) {
            colliders.push(new THREE.Box3().setFromObject(item));
          }
        }
        const playerRadius = 0.25;

        // Test X displacement
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

        // Test Z displacement
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

        playerPos.current.y = 1.65; // Human eye-level
        camera.position.copy(playerPos.current);
      } else {
        orbitControls.update();
      }

      renderer.render(scene, camera);
    };
    animate();

    // 11. Resize handling
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
      cancelAnimationFrame(animationFrameId);
      transformControls.dispose();
      orbitControls.dispose();
      pointerControls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Architectural Home Layout Geometry
  const projectKey = JSON.stringify({
    rooms: project?.rooms?.map((r) => ({
      id: r.id,
      w: r.width,
      l: r.length,
      h: r.wallHeight,
      t: r.wallThickness,
      pos: r.position,
      rot: r.rotation,
      fl: r.flooring,
      fin: r.wallFinishes,
      fc: r.falseCeiling,
      doors: r.doors,
      win: r.windows
    }))
  });

  const showCeilingRef = useRef(showCeiling);
  useEffect(() => {
    showCeilingRef.current = showCeiling;
  }, [showCeiling]);

  const projectRef = useRef(project);
  useEffect(() => {
    projectRef.current = project;
  }, [project]);

  const navModeRef = useRef(navMode);
  useEffect(() => {
    navModeRef.current = navMode;
  }, [navMode]);

  useEffect(() => {
    const scene = sceneRef.current;
    const currentProject = projectRef.current;
    if (!scene || !currentProject) return;

    // Remove previous home layout and dispose resources
    if (homeGroupRef.current) {
      scene.remove(homeGroupRef.current);
      homeGroupRef.current.traverse((child) => {
        if (child.isMesh || child.isLineSegments) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m?.dispose());
          } else if (child.material) {
            child.material.dispose();
          }
        }
        if (child.isLight && child.shadow?.map) {
          child.shadow.map.dispose();
        }
      });
      homeGroupRef.current = null;
    }

    // Remove previous grid
    if (gridHelperRef.current) {
      scene.remove(gridHelperRef.current);
      gridHelperRef.current.geometry?.dispose();
      gridHelperRef.current.material?.dispose();
      gridHelperRef.current = null;
    }

    // Generate new layout
    const newHome = generateHomeLayout(currentProject, showCeilingRef.current);
    homeGroupRef.current = newHome;
    scene.add(newHome);

    // Compute bounds for adaptive grid
    const bbox = new THREE.Box3().setFromObject(newHome);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    const center = new THREE.Vector3();
    bbox.getCenter(center);
    const maxDim = Math.max(12, Math.max(size.x, size.z) * 1.5);

    const gridHelper = new THREE.GridHelper(maxDim, Math.round(maxDim), 0x38bdf8, 0x1e293b);
    gridHelper.position.set(center.x, -0.026, center.z);
    gridHelperRef.current = gridHelper;
    scene.add(gridHelper);

    // Center orbit controls target on the home in orbit mode
    if (orbitControlsRef.current && navModeRef.current === 'orbit') {
      orbitControlsRef.current.target.set(center.x, Math.min(center.y, 1.5), center.z);
      orbitControlsRef.current.update();
    }

    // Spawn point for FPP walkthrough
    const firstRoom = currentProject.rooms?.[0];
    if (firstRoom) {
      playerPos.current.set(firstRoom.position?.x || 0, 1.65, firstRoom.position?.z || 0);
    } else {
      playerPos.current.set(0, 1.65, 0);
    }
  }, [projectKey]);

  // Synchronize Ceiling Visibility without rebuilding geometry
  useEffect(() => {
    if (!homeGroupRef.current) return;
    homeGroupRef.current.traverse((child) => {
      if (child.userData?.type === 'ceiling') {
        child.visible = showCeiling;
      }
    });
  }, [showCeiling]);

  // Highlight Selected Wall
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (wallHighlightMeshRef.current) {
      scene.remove(wallHighlightMeshRef.current);
      wallHighlightMeshRef.current.geometry?.dispose();
      wallHighlightMeshRef.current.material?.dispose();
      wallHighlightMeshRef.current = null;
    }

    if (!selectedWall || !homeGroupRef.current) return;

    // Find the wall mesh in the scene
    let targetMesh = null;
    homeGroupRef.current.traverse((child) => {
      if (
        child.userData?.type === 'wall' &&
        child.userData?.roomId === selectedWall.roomId &&
        child.userData?.wallSide === selectedWall.wallSide
      ) {
        targetMesh = child;
      }
    });

    if (targetMesh) {
      targetMesh.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(targetMesh);
      const boxSize = new THREE.Vector3();
      box.getSize(boxSize);
      const boxCenter = new THREE.Vector3();
      box.getCenter(boxCenter);

      const outlineGeo = new THREE.BoxGeometry(boxSize.x * 1.02, boxSize.y * 1.02, boxSize.z * 1.02);
      const outlineMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.85
      });
      const highlight = new THREE.Mesh(outlineGeo, outlineMat);
      highlight.position.copy(boxCenter);
      scene.add(highlight);
      wallHighlightMeshRef.current = highlight;
    }
  }, [selectedWall, projectKey]);

  // Synchronize Staged Furniture Meshes
  useEffect(() => {
    const group = furnitureGroupRef.current;
    if (!group) return;

    // Detach gizmo if needed
    if (transformControlsRef.current && !selectedFurnitureId) {
      transformControlsRef.current.detach();
    }

    // Rebuild staged items in scene if count or IDs change
    const existingIds = new Set(group.children.map((c) => c.userData.instanceId));
    const targetIds = new Set(stagedItems.map((i) => i.instanceId));

    let needFullRebuild = false;
    if (existingIds.size !== targetIds.size) {
      needFullRebuild = true;
    } else {
      for (const id of targetIds) {
        if (!existingIds.has(id)) {
          needFullRebuild = true;
          break;
        }
      }
    }

    if (needFullRebuild) {
      while (group.children.length > 0) {
        const child = group.children[0];
        group.remove(child);
        child.traverse((c) => {
          if (c.isMesh) c.geometry?.dispose();
        });
      }

      stagedItems.forEach((item) => {
        const mesh = createFurnitureMesh(item.productId || item.modelId || item.id);
        mesh.userData.instanceId = item.instanceId;
        mesh.userData.name = item.name;
        mesh.userData.productId = item.productId;
        mesh.position.set(item.position.x, item.position.y || 0, item.position.z);
        if (item.rotation) mesh.rotation.set(item.rotation.x, item.rotation.y, item.rotation.z);
        if (item.scale) mesh.scale.set(item.scale.x, item.scale.y, item.scale.z);
        group.add(mesh);
      });
    }

    // Attach gizmo to currently selected furniture
    if (selectedFurnitureId) {
      const selectedMesh = group.children.find((c) => c.userData.instanceId === selectedFurnitureId);
      if (selectedMesh) {
        transformControlsRef.current?.attach(selectedMesh);
      } else {
        transformControlsRef.current?.detach();
      }
    }
  }, [stagedItems, selectedFurnitureId]);

  // Handle Navigation Mode Switch (Orbit vs FPP)
  const switchNavMode = (mode) => {
    const camera = cameraRef.current;
    const orbitControls = orbitControlsRef.current;
    const pointerControls = pointerControlsRef.current;
    if (!camera || !orbitControls || !pointerControls) return;

    if (mode === 'orbit') {
      pointerControls.unlock();
      orbitControls.enabled = true;
      if (onNavModeChange) onNavModeChange('orbit');
    } else {
      // First-person walkthrough
      transformControlsRef.current?.detach();
      if (onSelectFurniture) onSelectFurniture(null);
      orbitControls.enabled = false;
      if (onNavModeChange) onNavModeChange('fps');
      pointerControls.lock();
    }
  };

  // Preset Camera Angles for Orbit View
  const setCameraView = (type) => {
    const camera = cameraRef.current;
    const orbitControls = orbitControlsRef.current;
    if (!camera || !orbitControls || !homeGroupRef.current) return;

    const bbox = new THREE.Box3().setFromObject(homeGroupRef.current);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    const center = new THREE.Vector3();
    bbox.getCenter(center);
    const span = Math.max(8, Math.max(size.x, size.z));

    if (type === 'top') {
      camera.position.set(center.x, span * 1.8 + 2, center.z + 0.01);
      orbitControls.target.copy(center);
    } else if (type === 'front') {
      camera.position.set(center.x, center.y + 2.5, center.z + span * 1.5);
      orbitControls.target.copy(center);
    } else if (type === 'side') {
      camera.position.set(center.x + span * 1.5, center.y + 2.5, center.z);
      orbitControls.target.copy(center);
    } else {
      // Perspective / Isometric
      camera.position.set(center.x + span * 1.1, center.y + span * 0.9, center.z + span * 1.1);
      orbitControls.target.copy(center);
    }

    camera.lookAt(orbitControls.target);
    orbitControls.update();
  };

  // Sync Gizmo Mode & Snapping
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

  // Pointer Picking: Click Wall or Furniture
  const handleCanvasPointerDown = (e) => {
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
    if (transformControlsRef.current?.axis) {
      isDraggingGizmoRef.current = true;
    }
  };

  const handleCanvasPointerUp = (e) => {
    if (isDraggingGizmoRef.current || wasDraggingGizmoRef.current) return;
    if (transformControlsRef.current?.axis) return;

    const dx = Math.abs(e.clientX - pointerDownPosRef.current.x);
    const dy = Math.abs(e.clientY - pointerDownPosRef.current.y);
    if (dx > 6 || dy > 6) return; // Orbiting drag, not a direct click

    const container = mountRef.current;
    if (!container || !cameraRef.current) return;
    const rect = container.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = raycasterRef.current;
    raycaster.setFromCamera(mouse, cameraRef.current);

    // 1. Check if user clicked on transform gizmo itself
    const gizmoHelper = sceneRef.current?.getObjectByName('TransformGizmoHelper');
    if (gizmoHelper && transformControlsRef.current?.object) {
      const gizmoHits = raycaster.intersectObject(gizmoHelper, true);
      if (gizmoHits.length > 0) return;
    }

    // 2. Check if clicked on furniture
    const furnHits = raycaster.intersectObjects(furnitureGroupRef.current.children, true);
    if (furnHits.length > 0) {
      let current = furnHits[0].object;
      while (current.parent && current.parent !== furnitureGroupRef.current) {
        current = current.parent;
      }
      if (current.userData?.instanceId) {
        if (onSelectFurniture) onSelectFurniture(current.userData.instanceId);
        if (onSelectWall) onSelectWall(null);
        return;
      }
    }

    // 3. Check if clicked on wall
    if (homeGroupRef.current) {
      const wallHits = raycaster.intersectObject(homeGroupRef.current, true);
      if (wallHits.length > 0) {
        const wallObj = wallHits.find((h) => h.object.userData?.type === 'wall');
        if (wallObj) {
          const { roomId, wallSide, roomName } = wallObj.object.userData;
          if (onSelectWall) onSelectWall({ roomId, wallSide, roomName });
          if (onSelectFurniture) onSelectFurniture(null);
          return;
        }
      }
    }

    // 4. Clicked floor or empty background: deselect
    if (onSelectFurniture) onSelectFurniture(null);
    if (onSelectWall) onSelectWall(null);
  };

  // Drag-and-Drop from Furniture Catalog onto 3D Scene
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

    let productId = e.dataTransfer.getData('text/plain');
    if (!productId) {
      try {
        const json = JSON.parse(e.dataTransfer.getData('application/json'));
        productId = json?.productId || json?.id;
      } catch {
        // ignore
      }
    }
    if (!productId) return;

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
    if (hit && Math.abs(intersectPoint.x) < 30 && Math.abs(intersectPoint.z) < 30) {
      spawnPos = intersectPoint;
    } else if (orbitControlsRef.current) {
      spawnPos = new THREE.Vector3(orbitControlsRef.current.target.x, 0, orbitControlsRef.current.target.z);
    } else {
      spawnPos = new THREE.Vector3(0, 0, 0);
    }

    if (onAddFurnitureToScene) {
      onAddFurnitureToScene(productId, spawnPos);
    }
  };

  const selectedItemData = stagedItems.find((i) => i.instanceId === selectedFurnitureId);

  const handleRotate90 = () => {
    const mesh = furnitureGroupRef.current?.children.find(
      (c) => c.userData.instanceId === selectedFurnitureId
    );
    if (!mesh) return;
    mesh.rotation.y += Math.PI / 2;
    if (onUpdateStagedItems) {
      onUpdateStagedItems((prev) =>
        prev.map((i) =>
          i.instanceId === selectedFurnitureId
            ? { ...i, rotation: { ...i.rotation, y: mesh.rotation.y } }
            : i
        )
      );
    }
  };

  const handleDuplicate = () => {
    if (!selectedItemData || !onAddFurnitureToScene) return;
    const newPos = {
      x: selectedItemData.position.x + 0.4,
      y: 0,
      z: selectedItemData.position.z + 0.4
    };
    onAddFurnitureToScene(selectedItemData.productId, newPos);
  };

  const handleDeleteSelected = () => {
    if (!selectedFurnitureId || !onUpdateStagedItems) return;
    transformControlsRef.current?.detach();
    onUpdateStagedItems((prev) => prev.filter((i) => i.instanceId !== selectedFurnitureId));
    if (onSelectFurniture) onSelectFurniture(null);
  };

  return (
    <div className="viewer-3d-wrapper">
      {/* 3D Viewport Toolbar */}
      <div className="viewport-overlay-controls">
        {/* Camera Mode Pills */}
        <div className="mode-toggle-group">
          <button
            type="button"
            className={`btn-mode ${navMode === 'orbit' ? 'active' : ''}`}
            onClick={() => switchNavMode('orbit')}
            title="Bird's-Eye CAD Orbit Camera"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            Bird's-Eye Orbit
          </button>
          <button
            type="button"
            className={`btn-mode ${navMode === 'fps' ? 'active' : ''}`}
            onClick={() => switchNavMode('fps')}
            title="First-Person Walkthrough (Eye-Level 1.65m)"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="7" r="4" />
              <path d="M5.5 21v-3a4 4 0 0 1 4-4h5a4 4 0 0 1 4 4v3" />
            </svg>
            1st-Person Walkthrough
          </button>
        </div>

        {/* Orbit View Presets */}
        {navMode === 'orbit' && (
          <div className="view-buttons">
            <button
              type="button"
              className={`btn-view ${orbitAngle === 'perspective' ? 'active' : ''}`}
              onClick={() => setCameraView('perspective')}
              title="Isometric 3D Perspective"
            >
              Perspective
            </button>
            <button
              type="button"
              className={`btn-view ${orbitAngle === 'top' ? 'active' : ''}`}
              onClick={() => setCameraView('top')}
              title="Top 2D Architectural View"
            >
              Top View
            </button>
            <button
              type="button"
              className={`btn-view ${orbitAngle === 'front' ? 'active' : ''}`}
              onClick={() => setCameraView('front')}
              title="Front Elevation"
            >
              Front
            </button>
            <button
              type="button"
              className={`btn-view ${orbitAngle === 'side' ? 'active' : ''}`}
              onClick={() => setCameraView('side')}
              title="Side Elevation"
            >
              Side
            </button>
          </div>
        )}

        {/* First-Person HUD Badge */}
        {navMode === 'fps' && (
          <div className="fps-status-badge">
            <span className="live-dot pulse"></span>
            <span>🚶 1st-Person Walkthrough Active</span>
            <span className="hotkey-pill">ESC to Exit</span>
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
            <span>📍 Drop anywhere to place furniture on floor</span>
          </div>
        )}
      </div>

      {/* Floating 3D Transform Gizmo HUD Toolbar */}
      {navMode === 'orbit' && selectedItemData && (
        <FurnitureGizmoToolbar
          selectedItem={selectedItemData}
          gizmoMode={gizmoMode}
          onChangeMode={setGizmoMode}
          onRotate90={handleRotate90}
          onDuplicate={handleDuplicate}
          onDelete={handleDeleteSelected}
          onDeselect={() => {
            transformControlsRef.current?.detach();
            if (onSelectFurniture) onSelectFurniture(null);
          }}
          snapEnabled={snapEnabled}
          onToggleSnap={() => setSnapEnabled((prev) => !prev)}
        />
      )}

      {/* Crosshair (during active pointer lock in FPS) */}
      {navMode === 'fps' && isPointerLocked && (
        <div className="fps-crosshair">
          <div className="crosshair-dot"></div>
        </div>
      )}

      {/* Walkthrough Guidance Overlay */}
      {navMode === 'fps' && !isPointerLocked && (
        <div
          className="fps-overlay"
          onClick={() => pointerControlsRef.current?.lock()}
          role="button"
          tabIndex={0}
        >
          <div className="fps-overlay-card">
            <div className="fps-icon-pulse">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="7" r="4" />
                <path d="M5.5 21v-3a4 4 0 0 1 4-4h5a4 4 0 0 1 4 4v3" />
              </svg>
            </div>
            <h3>Click to Enter 1st-Person Walkthrough</h3>
            <p>
              Explore your architectural home at true eye level (1.65m) with realistic collisions.
            </p>
            <div className="fps-controls-guide">
              <div className="guide-item">
                <span className="key-badge">W</span>
                <span className="key-badge">A</span>
                <span className="key-badge">S</span>
                <span className="key-badge">D</span>
                <span className="guide-desc">Walk & Strafe</span>
              </div>
              <div className="guide-item">
                <span className="key-badge">Shift</span>
                <span className="guide-desc">Sprint</span>
              </div>
              <div className="guide-item">
                <span className="key-badge">Mouse</span>
                <span className="guide-desc">Look Around</span>
              </div>
              <div className="guide-item">
                <span className="key-badge">ESC</span>
                <span className="guide-desc">Release Mouse</span>
              </div>
            </div>
            <button type="button" className="btn-start-tour">
              Enter Walkthrough
            </button>
            <button
              type="button"
              className="btn-exit-walkthrough"
              onClick={(e) => {
                e.stopPropagation();
                switchNavMode('orbit');
              }}
            >
              Back to Bird's-Eye Orbit
            </button>
          </div>
        </div>
      )}

      {/* Persistent Walkthrough Active Controls Bar */}
      {navMode === 'fps' && isPointerLocked && (
        <div className="fps-active-hud">
          <span><strong>WASD:</strong> Move</span>
          <span>·</span>
          <span><strong>Shift:</strong> Sprint</span>
          <span>·</span>
          <span><strong>Mouse:</strong> Look</span>
          <span>·</span>
          <span><strong>ESC:</strong> Exit</span>
        </div>
      )}
    </div>
  );
}
