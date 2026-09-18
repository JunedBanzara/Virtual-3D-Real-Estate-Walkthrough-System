import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { generateRoom } from '../geometry/roomGenerator';

export default function Viewer3D({ roomData }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const currentRoomGroupRef = useRef(null);
  const gridHelperRef = useRef(null);
  const animationFrameIdRef = useRef(null);

  const [viewAngle, setViewAngle] = useState('perspective');

  // Initialize Three.js Scene, Camera, Renderer, Controls
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Deep slate dark backdrop
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(6, 6, 8);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // Don't flip all the way underneath floor
    controls.minDistance = 1;
    controls.maxDistance = 100;
    controlsRef.current = controls;

    // 5. Lighting
    // Ambient light for general soft visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Directional light representing sun/key light with soft shadows
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(10, 15, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 50;
    const d = 10;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    scene.add(dirLight);

    // Secondary fill light for soft shadows
    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.5);
    fillLight.position.set(-10, 10, -10);
    scene.add(fillLight);

    // 6. Animation Loop
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 7. Handle Resize
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

    // Cleanup on unmount
    return () => {
      resizeObserver.disconnect();
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Room Geometry when roomData changes
  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!scene || !camera || !controls || !roomData) return;

    // Remove previous room mesh group
    if (currentRoomGroupRef.current) {
      scene.remove(currentRoomGroupRef.current);
      // Clean up child geometries to avoid leaks
      currentRoomGroupRef.current.traverse((child) => {
        if (child.isMesh) {
          child.geometry?.dispose();
        }
      });
      currentRoomGroupRef.current = null;
    }

    // Remove previous grid helper
    if (gridHelperRef.current) {
      scene.remove(gridHelperRef.current);
      gridHelperRef.current.geometry?.dispose();
      gridHelperRef.current = null;
    }

    // Generate new room group via pure geometry module
    const newRoom = generateRoom(roomData);
    currentRoomGroupRef.current = newRoom;
    scene.add(newRoom);

    // Add adaptive Ground Grid Helper (slightly larger than room)
    const W = roomData.width / 1000;
    const L = roomData.length / 1000;
    const H = roomData.wallHeight / 1000;
    const maxSpan = Math.max(W, L);
    const gridSize = Math.ceil(maxSpan * 1.8);
    const gridDivisions = Math.max(10, Math.round(gridSize));

    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x475569, 0x1e293b);
    gridHelper.position.y = -0.026; // Just below floor box
    gridHelperRef.current = gridHelper;
    scene.add(gridHelper);

    // Position camera optimally based on room dimensions
    const camDist = maxSpan * 1.35;
    camera.position.set(camDist * 0.8, H * 1.6 + 1.5, camDist * 1.1);
    controls.target.set(0, H * 0.35, 0);
    camera.lookAt(0, H * 0.35, 0);
    controls.update();
    setViewAngle('perspective');
  }, [roomData]);

  // View Angle Presets
  const setCameraView = (type) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls || !roomData) return;

    const W = roomData.width / 1000;
    const L = roomData.length / 1000;
    const H = roomData.wallHeight / 1000;
    const maxSpan = Math.max(W, L);

    if (type === 'top') {
      camera.position.set(0, maxSpan * 1.8 + 2, 0.01);
      controls.target.set(0, 0, 0);
    } else if (type === 'front') {
      camera.position.set(0, H * 0.8, maxSpan * 1.6);
      controls.target.set(0, H * 0.5, 0);
    } else if (type === 'side') {
      camera.position.set(maxSpan * 1.6, H * 0.8, 0);
      controls.target.set(0, H * 0.5, 0);
    } else {
      // Perspective
      const camDist = maxSpan * 1.35;
      camera.position.set(camDist * 0.8, H * 1.6 + 1.5, camDist * 1.1);
      controls.target.set(0, H * 0.35, 0);
    }

    camera.lookAt(controls.target);
    controls.update();
    setViewAngle(type);
  };

  return (
    <div className="viewer-wrapper">
      <div className="viewer-toolbar">
        <div className="toolbar-info">
          <span className="live-dot"></span>
          <span className="toolbar-title">Interactive 3D Viewport</span>
          <span className="toolbar-hint">· Left-Click: Rotate | Right-Click: Pan | Scroll: Zoom</span>
        </div>

        <div className="view-buttons">
          <button
            type="button"
            className={`btn-view ${viewAngle === 'perspective' ? 'active' : ''}`}
            onClick={() => setCameraView('perspective')}
          >
            Perspective 3D
          </button>
          <button
            type="button"
            className={`btn-view ${viewAngle === 'top' ? 'active' : ''}`}
            onClick={() => setCameraView('top')}
          >
            Top View (2D)
          </button>
          <button
            type="button"
            className={`btn-view ${viewAngle === 'front' ? 'active' : ''}`}
            onClick={() => setCameraView('front')}
          >
            Front View
          </button>
          <button
            type="button"
            className={`btn-view ${viewAngle === 'side' ? 'active' : ''}`}
            onClick={() => setCameraView('side')}
          >
            Side View
          </button>
        </div>
      </div>

      <div ref={mountRef} className="threejs-canvas-container" />
    </div>
  );
}
