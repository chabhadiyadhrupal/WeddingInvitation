import * as THREE from 'three';
import { createGoldTexture } from './ProceduralAssets';

export interface Event3DInfo {
  name: string;
  date: string;
  venue: string;
  themeColor: number;
  lightColor: number;
  position: [number, number, number];
}

export const WEDDING_EVENTS_3D: Event3DInfo[] = [
  {
    name: 'Haldi Rasam',
    date: 'Dec 14, 2026 • 10:00 AM',
    venue: 'Royal Sun Garden, Ahmedabad',
    themeColor: 0xFFD700, // Gold / Marigold
    lightColor: 0xFFB300,
    position: [-4.2, 0.5, 4.0],
  },
  {
    name: 'Mehndi Ceremony',
    date: 'Dec 14, 2026 • 04:00 PM',
    venue: 'Emerald Lawn, Ahmedabad',
    themeColor: 0x1B5E20, // Henna Green
    lightColor: 0x66BB6A,
    position: [4.2, 0.5, 0.5],
  },
  {
    name: 'Sangeet Night',
    date: 'Dec 14, 2026 • 07:30 PM',
    venue: 'Grand Crystal Ballroom',
    themeColor: 0x4A148C, // Royal Purple / Gold
    lightColor: 0xBA68C8,
    position: [-4.2, 0.5, -3.0],
  },
  {
    name: 'Wedding Ceremony',
    date: 'Dec 15, 2026 • 11:15 AM',
    venue: 'The Palace Mandap',
    themeColor: 0x800000, // Royal Velvet Red
    lightColor: 0xFF5252,
    position: [0, 0.5, -8.0],
  },
  {
    name: 'Grand Reception',
    date: 'Dec 15, 2026 • 07:00 PM',
    venue: 'The Royal Heritage Palace',
    themeColor: 0x1A237E, // Royal Midnight Sapphire
    lightColor: 0x7986CB,
    position: [4.2, 0.5, -12.5],
  },
];

/**
 * Creates 3D Display Pedestals for Wedding Event Stages.
 */
export function createEventsScene3D(): {
  group: THREE.Group;
  update: (time: number) => void;
} {
  const group = new THREE.Group();
  group.name = 'WeddingEvents3DPedestals';

  const goldTexture = createGoldTexture();
  const goldMaterial = new THREE.MeshStandardMaterial({
    map: goldTexture,
    roughness: 0.3,
    metalness: 0.8,
  });

  const eventStages: THREE.Group[] = [];

  WEDDING_EVENTS_3D.forEach((evt) => {
    const stageGroup = new THREE.Group();
    stageGroup.position.set(...evt.position);

    // Pedestal Base
    const pedestalGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.4, 16);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: evt.themeColor,
      roughness: 0.5,
      metalness: 0.4,
    });
    const pedestalMesh = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestalMesh.position.y = 0.2;
    pedestalMesh.receiveShadow = true;
    stageGroup.add(pedestalMesh);

    // Golden Trim Ring
    const trimMesh = new THREE.Mesh(
      new THREE.TorusGeometry(1.7, 0.05, 8, 24),
      goldMaterial
    );
    trimMesh.rotation.x = Math.PI / 2;
    trimMesh.position.y = 0.4;
    stageGroup.add(trimMesh);

    // Glowing Arch Motif on Pedestal
    const archCurve = new THREE.EllipseCurve(0, 0, 1.2, 1.8, 0, Math.PI, false, 0);
    const points = archCurve.getPoints(30);
    const archGeo = new THREE.BufferGeometry().setFromPoints(
      points.map((p) => new THREE.Vector3(p.x, p.y + 0.4, 0))
    );
    const archMat = new THREE.LineBasicMaterial({ color: evt.lightColor, linewidth: 3 });
    const archLine = new THREE.Line(archGeo, archMat);
    stageGroup.add(archLine);

    // Point Light for event ambiance
    const light = new THREE.PointLight(evt.lightColor, 2.0, 6);
    light.position.set(0, 1.5, 0);
    stageGroup.add(light);

    // Floating Brass Diya / Candle on Top
    const diyaGeo = new THREE.ConeGeometry(0.3, 0.2, 12);
    const diyaMesh = new THREE.Mesh(diyaGeo, goldMaterial);
    diyaMesh.rotation.x = Math.PI;
    diyaMesh.position.set(0, 0.55, 0);
    stageGroup.add(diyaMesh);

    group.add(stageGroup);
    eventStages.push(stageGroup);
  });

  const update = (time: number) => {
    eventStages.forEach((stg, i) => {
      stg.rotation.y = Math.sin(time * 0.5 + i) * 0.08;
    });
  };

  return { group, update };
}
