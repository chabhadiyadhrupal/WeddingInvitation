import * as THREE from 'three';
import { createMapGroundTexture, createGoldTexture } from './ProceduralAssets';

/**
 * Creates a stylized 3D map terrain scene with an animated glowing route line
 * and 3D royal venue location pin marker.
 */
export function createLocationMap3D(): {
  group: THREE.Group;
  update: (time: number) => void;
} {
  const group = new THREE.Group();
  group.name = 'LocationMap3D';
  group.position.set(0, -1.0, -18.0);

  // 1. Stylized Dark Ground Plane
  const groundTexture = createMapGroundTexture();
  const groundGeo = new THREE.PlaneGeometry(24, 24);
  const groundMat = new THREE.MeshStandardMaterial({
    map: groundTexture,
    roughness: 0.8,
    metalness: 0.2,
  });
  const groundMesh = new THREE.Mesh(groundGeo, groundMat);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.receiveShadow = true;
  group.add(groundMesh);

  // 2. Animated Glowing Route Curve Line
  const routePoints = [
    new THREE.Vector3(-8, 0.08, 8),
    new THREE.Vector3(-4, 0.08, 4),
    new THREE.Vector3(-1, 0.08, 1),
    new THREE.Vector3(2, 0.08, -2),
    new THREE.Vector3(0, 0.08, -5), // Venue Destination
  ];
  const routeCurve = new THREE.CatmullRomCurve3(routePoints);
  const tubeGeo = new THREE.TubeGeometry(routeCurve, 60, 0.12, 8, false);

  const routeMat = new THREE.MeshBasicMaterial({
    color: 0xFFD700,
    wireframe: false,
    transparent: true,
    opacity: 0.9,
  });
  const routeMesh = new THREE.Mesh(tubeGeo, routeMat);
  group.add(routeMesh);

  // Outer glowing line halo
  const tubeHaloGeo = new THREE.TubeGeometry(routeCurve, 60, 0.25, 8, false);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0xFF8C00,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
  });
  const haloMesh = new THREE.Mesh(tubeHaloGeo, haloMat);
  group.add(haloMesh);

  // 3. 3D Royal Venue Pin Marker
  const pinGroup = new THREE.Group();
  pinGroup.position.set(0, 0, -5);

  const goldTexture = createGoldTexture();
  const goldMaterial = new THREE.MeshStandardMaterial({
    map: goldTexture,
    roughness: 0.2,
    metalness: 0.9,
  });

  // Pin Head (Sphere)
  const pinHeadGeo = new THREE.SphereGeometry(0.7, 16, 16);
  const pinHeadMesh = new THREE.Mesh(pinHeadGeo, goldMaterial);
  pinHeadMesh.position.y = 2.4;
  pinGroup.add(pinHeadMesh);

  // Pin Cone Pointer
  const pinConeGeo = new THREE.ConeGeometry(0.7, 1.8, 16);
  const pinConeMesh = new THREE.Mesh(pinConeGeo, goldMaterial);
  pinConeMesh.rotation.x = Math.PI;
  pinConeMesh.position.y = 1.3;
  pinGroup.add(pinConeMesh);

  // Gem Emblem inside pin head
  const gemGeo = new THREE.OctahedronGeometry(0.35);
  const gemMat = new THREE.MeshStandardMaterial({ color: 0x800000, roughness: 0.1, metalness: 0.5 });
  const gemMesh = new THREE.Mesh(gemGeo, gemMat);
  gemMesh.position.y = 2.4;
  pinGroup.add(gemMesh);

  // Pulsing Target Rings on Ground
  const ringGeo1 = new THREE.RingGeometry(0.8, 1.0, 32);
  const ringMat1 = new THREE.MeshBasicMaterial({ color: 0xFFD700, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
  const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
  ringMesh1.rotation.x = -Math.PI / 2;
  ringMesh1.position.y = 0.05;
  pinGroup.add(ringMesh1);

  const ringGeo2 = new THREE.RingGeometry(1.4, 1.6, 32);
  const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xFF8C00, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
  const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
  ringMesh2.rotation.x = -Math.PI / 2;
  ringMesh2.position.y = 0.05;
  pinGroup.add(ringMesh2);

  // Pin Light
  const pinLight = new THREE.PointLight(0xFFD700, 3.0, 8);
  pinLight.position.set(0, 3.0, 0);
  pinGroup.add(pinLight);

  group.add(pinGroup);

  const update = (time: number) => {
    // Pin hover bobbing & spin
    pinGroup.position.y = Math.sin(time * 2.5) * 0.15;
    pinGroup.rotation.y = time * 0.8;
    gemMesh.rotation.y = -time * 1.5;

    // Ring expansion pulse
    const scale1 = 1 + Math.sin(time * 3) * 0.15;
    ringMesh1.scale.set(scale1, scale1, 1);

    const scale2 = 1 + Math.cos(time * 3) * 0.2;
    ringMesh2.scale.set(scale2, scale2, 1);
  };

  return { group, update };
}
