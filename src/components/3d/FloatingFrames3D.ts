import * as THREE from 'three';
import { createGoldTexture, createCouplePhotoCanvas } from './ProceduralAssets';

export interface FrameData {
  id: string;
  title: string;
  subtitle: string;
  position: [number, number, number];
  rotation: [number, number, number];
  color1?: string;
  color2?: string;
}

export const SAMPLE_FRAMES: FrameData[] = [
  {
    id: 'first-met',
    title: 'First Glance',
    subtitle: 'Where our story began',
    position: [-3.5, 2.8, 18.0],
    rotation: [0, 0.35, 0],
    color1: '#800000',
    color2: '#D4AF37',
  },
  {
    id: 'the-proposal',
    title: 'The Proposal',
    subtitle: 'Under the starlit canopy',
    position: [3.5, 2.2, 14.5],
    rotation: [0, -0.4, 0],
    color1: '#4A0E17',
    color2: '#FFD700',
  },
  {
    id: 'pre-wedding',
    title: 'Pre-Wedding Magic',
    subtitle: 'Moments captured forever',
    position: [-3.8, 1.8, 10.5],
    rotation: [0, 0.45, 0],
    color1: '#1F3A2B',
    color2: '#E8C39E',
  },
  {
    id: 'forever-promise',
    title: 'Forever Promise',
    subtitle: 'Two souls, one journey',
    position: [3.8, 2.6, 6.5],
    rotation: [0, -0.35, 0],
    color1: '#2D1B36',
    color2: '#F5E6D3',
  },
];

/**
 * Creates 3D Floating Ornate Golden Photo Frames.
 */
export function createFloatingFrames3D(): {
  group: THREE.Group;
  update: (time: number) => void;
} {
  const group = new THREE.Group();
  group.name = 'FloatingPhotoCorridor';

  const goldTexture = createGoldTexture();
  const goldMaterial = new THREE.MeshStandardMaterial({
    map: goldTexture,
    roughness: 0.3,
    metalness: 0.85,
  });

  const frameMeshes: THREE.Group[] = [];

  SAMPLE_FRAMES.forEach((frame) => {
    const frameGroup = new THREE.Group();
    frameGroup.position.set(...frame.position);
    frameGroup.rotation.set(...frame.rotation);
    frameGroup.userData = { ...frame, initialY: frame.position[1] };

    // Outer Golden Ornate Bevel Frame
    const outerWidth = 2.4;
    const outerHeight = 3.2;
    const thickness = 0.15;

    const frameOuterGeo = new THREE.BoxGeometry(outerWidth, outerHeight, thickness);
    const frameOuterMesh = new THREE.Mesh(frameOuterGeo, goldMaterial);
    frameOuterMesh.castShadow = true;
    frameGroup.add(frameOuterMesh);

    // Inner Canvas Picture
    const photoTexture = createCouplePhotoCanvas(
      frame.title,
      frame.subtitle,
      frame.color1 || '#800000',
      frame.color2 || '#D4AF37'
    );
    const photoMaterial = new THREE.MeshStandardMaterial({
      map: photoTexture,
      roughness: 0.4,
    });

    const innerPhotoGeo = new THREE.PlaneGeometry(1.9, 2.7);
    const innerPhotoMesh = new THREE.Mesh(innerPhotoGeo, photoMaterial);
    innerPhotoMesh.position.z = thickness / 2 + 0.01;
    frameGroup.add(innerPhotoMesh);

    // Back Panel
    const backMat = new THREE.MeshStandardMaterial({ color: 0x1A141A, roughness: 0.8 });
    const backMesh = new THREE.Mesh(innerPhotoGeo, backMat);
    backMesh.rotation.y = Math.PI;
    backMesh.position.z = -(thickness / 2 + 0.01);
    frameGroup.add(backMesh);

    // Soft Warm Spotlight pointing at photo frame
    const spot = new THREE.SpotLight(0xFFD700, 1.8, 8, Math.PI / 4, 0.5);
    spot.position.set(0, 1.5, 2.5);
    spot.target = frameOuterMesh;
    frameGroup.add(spot);

    group.add(frameGroup);
    frameMeshes.push(frameGroup);
  });

  // Floating oscillation animation
  const update = (time: number) => {
    frameMeshes.forEach((fGroup, idx) => {
      const initialY = fGroup.userData.initialY || 2.0;
      fGroup.position.y = initialY + Math.sin(time * 1.5 + idx * 1.2) * 0.12;
      fGroup.rotation.z = Math.sin(time * 1.0 + idx) * 0.03;
    });
  };

  return { group, update };
}
