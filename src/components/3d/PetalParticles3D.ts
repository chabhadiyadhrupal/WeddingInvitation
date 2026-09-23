import * as THREE from 'three';
import { createPetalTexture } from './ProceduralAssets';

/**
 * Atmospheric 3D Particle System featuring drifting flower petals (Rose & Marigold)
 * and sparkling golden dust bokeh motes across the scene.
 */
export function createPetalParticles3D(count = 180): {
  group: THREE.Group;
  update: (time: number) => void;
} {
  const group = new THREE.Group();
  group.name = 'Atmospheric3DParticles';

  // 1. Rose & Marigold Flower Petals
  const roseTexture = createPetalTexture(true);
  const marigoldTexture = createPetalTexture(false);

  const petalGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const rotations = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  const scales = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // Spread across 3D bounds: X: [-20, 20], Y: [-2, 18], Z: [-25, 30]
    positions[i * 3] = (Math.random() - 0.5) * 36;
    positions[i * 3 + 1] = Math.random() * 20 - 2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 55;

    rotations[i * 3] = Math.random() * Math.PI * 2;
    rotations[i * 3 + 1] = Math.random() * Math.PI * 2;
    rotations[i * 3 + 2] = Math.random() * Math.PI * 2;

    speeds[i] = 0.015 + Math.random() * 0.025;
    scales[i] = 0.35 + Math.random() * 0.45;
  }

  petalGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const petalMaterial = new THREE.PointsMaterial({
    map: roseTexture,
    size: 0.8,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });

  const petalsMesh = new THREE.Points(petalGeo, petalMaterial);
  group.add(petalsMesh);

  // 2. Sparkling Gold Dust Bokeh Motes
  const dustCount = 220;
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(dustCount * 3);

  for (let i = 0; i < dustCount; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 40;
    dustPos[i * 3 + 1] = Math.random() * 22;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 60;
  }

  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));

  const dustMaterial = new THREE.PointsMaterial({
    color: 0xFFD700,
    size: 0.18,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
  });

  const dustMesh = new THREE.Points(dustGeo, dustMaterial);
  group.add(dustMesh);

  const update = (time: number) => {
    const posArr = petalGeo.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Gentle downward spiral drift
      let y = posArr[i * 3 + 1];
      let x = posArr[i * 3];
      let z = posArr[i * 3 + 2];

      y -= speeds[i];
      x += Math.sin(time * 1.2 + i) * 0.015;
      z += Math.cos(time * 0.9 + i) * 0.012;

      // Reset when falling below scene ground
      if (y < -3) {
        y = 18;
        x = (Math.random() - 0.5) * 36;
        z = (Math.random() - 0.5) * 55;
      }

      posArr[i * 3] = x;
      posArr[i * 3 + 1] = y;
      posArr[i * 3 + 2] = z;
    }

    petalGeo.attributes.position.needsUpdate = true;

    // Subtle floating shimmer for dust
    dustMesh.rotation.y = time * 0.02;
    dustMesh.rotation.x = Math.sin(time * 0.015) * 0.05;
  };

  return { group, update };
}
