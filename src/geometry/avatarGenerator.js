import * as THREE from 'three';

/**
 * Creates a modern, stylized procedural 3D humanoid avatar.
 * Articulated with movable limbs for realistic walking animation.
 * Height: ~1.75m (Standard human scale).
 * 
 * @returns {THREE.Group} avatarGroup with articulated limb nodes and update hooks
 */
export function createAvatar() {
  const avatar = new THREE.Group();
  avatar.name = 'PlayerAvatar';

  // Materials
  const skinMaterial = new THREE.MeshStandardMaterial({
    color: 0xfbbf24, // Warm stylized tone
    roughness: 0.6,
    metalness: 0.05
  });

  const jacketMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f172a, // Deep slate navy blazer
    roughness: 0.7,
    metalness: 0.1
  });

  const shirtMaterial = new THREE.MeshStandardMaterial({
    color: 0x0284c7, // Vibrant cyan-blue inner shirt
    roughness: 0.8,
    metalness: 0.05
  });

  const pantsMaterial = new THREE.MeshStandardMaterial({
    color: 0x334155, // Charcoal slate trousers
    roughness: 0.85,
    metalness: 0.02
  });

  const shoesMaterial = new THREE.MeshStandardMaterial({
    color: 0x020617, // Clean dark shoes
    roughness: 0.4,
    metalness: 0.2
  });

  const visorMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    roughness: 0.1,
    metalness: 0.2,
    transmission: 0.5,
    transparent: true,
    opacity: 0.75
  });

  // 1. PELVIS / HIPS (Pivot at Y = 0.95m)
  const hips = new THREE.Group();
  hips.position.y = 0.95;
  avatar.add(hips);

  // 2. TORSO / CHEST
  const torsoGeo = new THREE.BoxGeometry(0.42, 0.52, 0.24);
  const torso = new THREE.Mesh(torsoGeo, jacketMaterial);
  torso.position.y = 0.3;
  torso.castShadow = true;
  hips.add(torso);

  // Shirt accent on front
  const shirtGeo = new THREE.BoxGeometry(0.18, 0.4, 0.02);
  const shirt = new THREE.Mesh(shirtGeo, shirtMaterial);
  shirt.position.set(0, 0.3, 0.125);
  hips.add(shirt);

  // 3. NECK & HEAD
  const neckGeo = new THREE.CylinderGeometry(0.07, 0.08, 0.1, 16);
  const neck = new THREE.Mesh(neckGeo, skinMaterial);
  neck.position.y = 0.61;
  hips.add(neck);

  const headGeo = new THREE.SphereGeometry(0.13, 20, 20);
  const head = new THREE.Mesh(headGeo, skinMaterial);
  head.position.y = 0.76;
  head.castShadow = true;
  hips.add(head);

  // Stylish architectural visor / glass faceplate
  const visorGeo = new THREE.BoxGeometry(0.2, 0.08, 0.1);
  const visor = new THREE.Mesh(visorGeo, visorMaterial);
  visor.position.set(0, 0.76, 0.09);
  hips.add(visor);

  // 4. ARMS (Articulated at shoulder pivots)
  const shoulderOffset = 0.25;
  const shoulderHeight = 0.52;

  // Left Arm
  const leftShoulder = new THREE.Group();
  leftShoulder.position.set(-shoulderOffset, shoulderHeight, 0);
  hips.add(leftShoulder);

  const leftArmGeo = new THREE.BoxGeometry(0.1, 0.48, 0.1);
  const leftArm = new THREE.Mesh(leftArmGeo, jacketMaterial);
  leftArm.position.y = -0.24;
  leftArm.castShadow = true;
  leftShoulder.add(leftArm);

  const leftHandGeo = new THREE.SphereGeometry(0.05, 12, 12);
  const leftHand = new THREE.Mesh(leftHandGeo, skinMaterial);
  leftHand.position.y = -0.49;
  leftShoulder.add(leftHand);

  // Right Arm
  const rightShoulder = new THREE.Group();
  rightShoulder.position.set(shoulderOffset, shoulderHeight, 0);
  hips.add(rightShoulder);

  const rightArmGeo = new THREE.BoxGeometry(0.1, 0.48, 0.1);
  const rightArm = new THREE.Mesh(rightArmGeo, jacketMaterial);
  rightArm.position.y = -0.24;
  rightArm.castShadow = true;
  rightShoulder.add(rightArm);

  const rightHandGeo = new THREE.SphereGeometry(0.05, 12, 12);
  const rightHand = new THREE.Mesh(rightHandGeo, skinMaterial);
  rightHand.position.y = -0.49;
  rightShoulder.add(rightHand);

  // 5. LEGS (Articulated at hip pivots)
  const hipOffset = 0.12;

  // Left Leg
  const leftHip = new THREE.Group();
  leftHip.position.set(-hipOffset, 0, 0);
  hips.add(leftHip);

  const leftLegGeo = new THREE.BoxGeometry(0.13, 0.78, 0.13);
  const leftLeg = new THREE.Mesh(leftLegGeo, pantsMaterial);
  leftLeg.position.y = -0.39;
  leftLeg.castShadow = true;
  leftHip.add(leftLeg);

  const leftShoeGeo = new THREE.BoxGeometry(0.14, 0.1, 0.24);
  const leftShoe = new THREE.Mesh(leftShoeGeo, shoesMaterial);
  leftShoe.position.set(0, -0.83, 0.05);
  leftShoe.castShadow = true;
  leftHip.add(leftShoe);

  // Right Leg
  const rightHip = new THREE.Group();
  rightHip.position.set(hipOffset, 0, 0);
  hips.add(rightHip);

  const rightLegGeo = new THREE.BoxGeometry(0.13, 0.78, 0.13);
  const rightLeg = new THREE.Mesh(rightLegGeo, pantsMaterial);
  rightLeg.position.y = -0.39;
  rightLeg.castShadow = true;
  rightHip.add(rightLeg);

  const rightShoeGeo = new THREE.BoxGeometry(0.14, 0.1, 0.24);
  const rightShoe = new THREE.Mesh(rightShoeGeo, shoesMaterial);
  rightShoe.position.set(0, -0.83, 0.05);
  rightShoe.castShadow = true;
  rightHip.add(rightShoe);

  // Store references for limb animation
  avatar.userData = {
    leftShoulder,
    rightShoulder,
    leftHip,
    rightHip,
    hips,
    animTime: 0
  };

  return avatar;
}

/**
 * Updates avatar limb swing animation and subtle torso bobbing based on movement.
 * @param {THREE.Group} avatar 
 * @param {boolean} isMoving 
 * @param {boolean} isSprinting 
 * @param {number} delta - Time delta in seconds
 */
export function updateAvatarAnimation(avatar, isMoving, isSprinting, delta) {
  if (!avatar || !avatar.userData) return;
  const { leftShoulder, rightShoulder, leftHip, rightHip, hips } = avatar.userData;

  if (isMoving) {
    const freq = isSprinting ? 14 : 9;
    avatar.userData.animTime += delta * freq;
    const t = avatar.userData.animTime;

    const maxLegSwing = isSprinting ? 0.65 : 0.42;
    const maxArmSwing = maxLegSwing * 0.8;

    const swing = Math.sin(t);

    // Left leg swings forward when right arm swings forward (natural human locomotion)
    leftHip.rotation.x = swing * maxLegSwing;
    rightHip.rotation.x = -swing * maxLegSwing;

    leftShoulder.rotation.x = -swing * maxArmSwing;
    rightShoulder.rotation.x = swing * maxArmSwing;

    // Slight vertical bounce
    hips.position.y = 0.95 + Math.abs(Math.sin(t * 2)) * 0.035;
  } else {
    // Smoothly damp back to idle standing pose
    const damping = Math.min(1, delta * 10);
    leftHip.rotation.x += (0 - leftHip.rotation.x) * damping;
    rightHip.rotation.x += (0 - rightHip.rotation.x) * damping;
    leftShoulder.rotation.x += (0 - leftShoulder.rotation.x) * damping;
    rightShoulder.rotation.x += (0 - rightShoulder.rotation.x) * damping;
    hips.position.y += (0.95 - hips.position.y) * damping;
  }
}
