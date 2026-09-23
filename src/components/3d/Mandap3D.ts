import * as THREE from 'three';
import { createGoldTexture, createFlameTexture } from './ProceduralAssets';

/**
 * Creates a detailed 3D Royal Indian Mandap with carved pillars, floral drapes,
 * sacred havan kund with flickering flame particles, and warm ambient lanterns.
 */
export function createMandap3D(): {
  group: THREE.Group;
  flameParticles: THREE.Points;
  update: (time: number) => void;
} {
  const group = new THREE.Group();
  group.name = 'RoyalMandap';

  const goldTexture = createGoldTexture();
  const goldMaterial = new THREE.MeshStandardMaterial({
    map: goldTexture,
    roughness: 0.25,
    metalness: 0.8,
  });

  const velvetRedMaterial = new THREE.MeshStandardMaterial({
    color: 0x800000,
    roughness: 0.6,
    metalness: 0.1,
  });

  const ivoryMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFDF9,
    roughness: 0.4,
  });

  const marigoldMaterial = new THREE.MeshStandardMaterial({
    color: 0xFF8C00,
    roughness: 0.7,
  });

  const jasmineMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    roughness: 0.5,
  });

  // 1. Mandap Base Platform (Raised 3-Tier Octagonal/Square Base)
  const baseGeometry = new THREE.CylinderGeometry(6, 6.5, 0.4, 8);
  const baseMesh = new THREE.Mesh(baseGeometry, goldMaterial);
  baseMesh.position.y = 0.2;
  baseMesh.receiveShadow = true;
  group.add(baseMesh);

  const carpetGeometry = new THREE.CylinderGeometry(5.4, 5.4, 0.05, 8);
  const carpetMesh = new THREE.Mesh(carpetGeometry, velvetRedMaterial);
  carpetMesh.position.y = 0.42;
  carpetMesh.receiveShadow = true;
  group.add(carpetMesh);

  // 2. Four Carved Pillars
  const pillarRadius = 0.28;
  const pillarHeight = 4.5;
  const pillarOffset = 3.6;
  const pillarPositions = [
    [-pillarOffset, pillarOffset],
    [pillarOffset, pillarOffset],
    [-pillarOffset, -pillarOffset],
    [pillarOffset, -pillarOffset],
  ];

  pillarPositions.forEach(([px, pz]) => {
    const pillarGroup = new THREE.Group();
    pillarGroup.position.set(px, 0.45, pz);

    // Pillar Base
    const pBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.5, 0.8),
      goldMaterial
    );
    pBase.position.y = 0.25;
    pillarGroup.add(pBase);

    // Main Column
    const pCol = new THREE.Mesh(
      new THREE.CylinderGeometry(pillarRadius, pillarRadius * 1.1, pillarHeight, 16),
      goldMaterial
    );
    pCol.position.y = pillarHeight / 2 + 0.5;
    pCol.castShadow = true;
    pCol.receiveShadow = true;
    pillarGroup.add(pCol);

    // Carved Rings
    for (let r = 1; r <= 3; r++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(pillarRadius + 0.04, 0.03, 8, 16),
        goldMaterial
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.5 + (pillarHeight / 4) * r;
      pillarGroup.add(ring);
    }

    // Capital (Top)
    const pCap = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.4, 0.9),
      goldMaterial
    );
    pCap.position.y = pillarHeight + 0.7;
    pillarGroup.add(pCap);

    // Hanging Marigold Garlands wrapping around pillar
    const garlandCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, pillarHeight + 0.5, 0),
      new THREE.Vector3(pillarRadius + 0.15, pillarHeight * 0.6, 0.2),
      new THREE.Vector3(-(pillarRadius + 0.15), pillarHeight * 0.3, -0.2),
      new THREE.Vector3(0, 0.6, 0),
    ]);
    const garlandGeo = new THREE.TubeGeometry(garlandCurve, 20, 0.06, 8, false);
    const garlandMesh = new THREE.Mesh(garlandGeo, marigoldMaterial);
    pillarGroup.add(garlandMesh);

    group.add(pillarGroup);
  });

  // 3. Mandap Canopy / Roof Arch
  const roofHeight = 5.6;
  const archBeamGeo = new THREE.BoxGeometry(pillarOffset * 2 + 1, 0.35, 0.4);
  
  const beamNorth = new THREE.Mesh(archBeamGeo, goldMaterial);
  beamNorth.position.set(0, roofHeight, pillarOffset);
  group.add(beamNorth);

  const beamSouth = new THREE.Mesh(archBeamGeo, goldMaterial);
  beamSouth.position.set(0, roofHeight, -pillarOffset);
  group.add(beamSouth);

  const beamEast = new THREE.Mesh(archBeamGeo, goldMaterial);
  beamEast.rotation.y = Math.PI / 2;
  beamEast.position.set(pillarOffset, roofHeight, 0);
  group.add(beamEast);

  const beamWest = new THREE.Mesh(archBeamGeo, goldMaterial);
  beamWest.rotation.y = Math.PI / 2;
  beamWest.position.set(-pillarOffset, roofHeight, 0);
  group.add(beamWest);

  // Central Golden Dome Roof
  const domeGeo = new THREE.SphereGeometry(2.5, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
  const domeMesh = new THREE.Mesh(domeGeo, goldMaterial);
  domeMesh.position.y = roofHeight + 0.1;
  domeMesh.scale.set(1.4, 0.6, 1.4);
  group.add(domeMesh);

  // Regal Crown Kalash Pin top
  const kalashMesh = new THREE.Mesh(
    new THREE.ConeGeometry(0.3, 1.2, 8),
    goldMaterial
  );
  kalashMesh.position.y = roofHeight + 1.8;
  group.add(kalashMesh);

  // Draped Fabrics (Ivory Silk & Red Velvet Swags)
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const drapeGroup = new THREE.Group();
    drapeGroup.rotation.y = angle;

    const curtainGeo = new THREE.CylinderGeometry(0.2, 0.5, 4.5, 8, 1, true, 0, Math.PI);
    const curtainMesh = new THREE.Mesh(curtainGeo, velvetRedMaterial);
    curtainMesh.position.set(pillarOffset - 0.2, roofHeight - 2.25, pillarOffset - 0.2);
    curtainMesh.rotation.y = Math.PI / 4;
    drapeGroup.add(curtainMesh);

    group.add(drapeGroup);
  }

  // 4. Sacred Havan Kund (Fire Altar in Center)
  const kundGroup = new THREE.Group();
  kundGroup.position.set(0, 0.45, 0);

  const kundOuter = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.35, 1.6),
    goldMaterial
  );
  kundOuter.position.y = 0.175;
  kundGroup.add(kundOuter);

  const kundInner = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.25, 1.2),
    new THREE.MeshStandardMaterial({ color: 0x2B1810, roughness: 0.9 })
  );
  kundInner.position.y = 0.25;
  kundGroup.add(kundInner);

  // Embers glow bed
  const embersGeo = new THREE.PlaneGeometry(1.0, 1.0);
  const embersMat = new THREE.MeshBasicMaterial({ color: 0xFF4500, side: THREE.DoubleSide });
  const embersMesh = new THREE.Mesh(embersGeo, embersMat);
  embersMesh.rotation.x = -Math.PI / 2;
  embersMesh.position.y = 0.38;
  kundGroup.add(embersMesh);

  // Fire Point Light
  const fireLight = new THREE.PointLight(0xFF7700, 3.5, 10);
  fireLight.position.set(0, 0.8, 0);
  fireLight.castShadow = true;
  kundGroup.add(fireLight);

  group.add(kundGroup);

  // 5. Fire Flame Particle System
  const flameCount = 40;
  const flameGeo = new THREE.BufferGeometry();
  const flamePos = new Float32Array(flameCount * 3);
  const flameSizes = new Float32Array(flameCount);

  for (let i = 0; i < flameCount; i++) {
    flamePos[i * 3] = (Math.random() - 0.5) * 0.6;
    flamePos[i * 3 + 1] = 0.5 + Math.random() * 0.8;
    flamePos[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
    flameSizes[i] = 0.3 + Math.random() * 0.4;
  }

  flameGeo.setAttribute('position', new THREE.BufferAttribute(flamePos, 3));
  flameGeo.setAttribute('size', new THREE.BufferAttribute(flameSizes, 1));

  const flameTexture = createFlameTexture();
  const flameMaterial = new THREE.PointsMaterial({
    map: flameTexture,
    size: 0.5,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const flameParticles = new THREE.Points(flameGeo, flameMaterial);
  flameParticles.position.set(0, 0.45, 0);
  group.add(flameParticles);

  // Update animation for fire flicker & flame rise
  const update = (time: number) => {
    // Light flicker
    fireLight.intensity = 3.0 + Math.sin(time * 12) * 0.8 + Math.cos(time * 19) * 0.5;

    // Particle rise
    const positions = flameParticles.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < flameCount; i++) {
      let y = positions[i * 3 + 1];
      y += 0.015 + (i % 5) * 0.003;
      if (y > 1.4) {
        y = 0.5;
        positions[i * 3] = (Math.random() - 0.5) * 0.6;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
      }
      positions[i * 3 + 1] = y;
    }
    flameParticles.geometry.attributes.position.needsUpdate = true;
  };

  return { group, flameParticles, update };
}
