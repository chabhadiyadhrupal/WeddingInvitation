import * as THREE from 'three';

/**
 * Procedural Asset Generator for Three.js 3D Wedding Experience.
 * Generates high-quality canvas textures for golden frames, petals, drapes, fire, and photos.
 */

// 1. Ornate Gold Texture
export function createGoldTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createLinearGradient(0, 0, 512, 512);
  gradient.addColorStop(0, '#B8860B');
  gradient.addColorStop(0.25, '#FFD700');
  gradient.addColorStop(0.5, '#FFF8DC');
  gradient.addColorStop(0.75, '#DAA520');
  gradient.addColorStop(1, '#8B6508');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  // Add subtle metallic noise & filigree dots
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.fillRect(x, y, 2, 2);
  }

  // Border inlay
  ctx.strokeStyle = 'rgba(139, 101, 8, 0.6)';
  ctx.lineWidth = 12;
  ctx.strokeRect(20, 20, 472, 472);
  ctx.strokeStyle = 'rgba(255, 248, 220, 0.8)';
  ctx.lineWidth = 4;
  ctx.strokeRect(28, 28, 456, 456);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 2. Flower Petal Particle Texture (Rose & Marigold)
export function createPetalTexture(isRose = true): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 128, 128);

  ctx.save();
  ctx.translate(64, 64);

  // Draw petal shape
  ctx.beginPath();
  ctx.moveTo(0, 50);
  ctx.bezierCurveTo(45, 40, 55, -20, 0, -50);
  ctx.bezierCurveTo(-55, -20, -45, 40, 0, 50);
  ctx.closePath();

  const gradient = ctx.createRadialGradient(0, 0, 5, 0, 0, 55);
  if (isRose) {
    gradient.addColorStop(0, '#FF4D6D');
    gradient.addColorStop(0.6, '#C77DFF');
    gradient.addColorStop(1, '#800000');
  } else {
    // Marigold
    gradient.addColorStop(0, '#FFF500');
    gradient.addColorStop(0.5, '#FF9100');
    gradient.addColorStop(1, '#D84315');
  }

  ctx.fillStyle = gradient;
  ctx.fill();

  // Veins
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, 40);
  ctx.lineTo(0, -40);
  ctx.stroke();

  ctx.restore();

  return new THREE.CanvasTexture(canvas);
}

// 3. Fire / Flame Particle Texture for Havan Kund
export function createFlameTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 60);
  gradient.addColorStop(0, 'rgba(255, 255, 220, 1)');
  gradient.addColorStop(0.3, 'rgba(255, 140, 0, 0.9)');
  gradient.addColorStop(0.7, 'rgba(230, 40, 0, 0.4)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(64, 64, 60, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

// 4. Stylized Map Ground Texture with Grid & Route
export function createMapGroundTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Dark royal map background
  ctx.fillStyle = '#0F0B15';
  ctx.fillRect(0, 0, 1024, 1024);

  // Soft topographical / grid lines
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.12)';
  ctx.lineWidth = 1;
  const step = 64;
  for (let x = 0; x <= 1024; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();
  }
  for (let y = 0; y <= 1024; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Decorative compass/mandala in center corner
  ctx.save();
  ctx.translate(512, 512);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 200, 0, Math.PI * 2);
  ctx.arc(0, 0, 350, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 5. Pre-wedding Couple Photo Texture Fallback Generator
export function createCouplePhotoCanvas(title: string, subtitle: string, colorHex1 = '#800000', colorHex2 = '#D4AF37'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 800;
  const ctx = canvas.getContext('2d')!;

  // Luxury gradient
  const grad = ctx.createLinearGradient(0, 0, 600, 800);
  grad.addColorStop(0, colorHex1);
  grad.addColorStop(0.5, '#2A0812');
  grad.addColorStop(1, '#0F0B15');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 600, 800);

  // Ornate inner frame
  ctx.strokeStyle = colorHex2;
  ctx.lineWidth = 6;
  ctx.strokeRect(30, 30, 540, 740);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.strokeRect(42, 42, 516, 716);

  // Stylized Silhouette / Motif
  ctx.save();
  ctx.translate(300, 340);
  
  // Heart/Mandala glow
  const radialGlow = ctx.createRadialGradient(0, 0, 10, 0, 0, 180);
  radialGlow.addColorStop(0, 'rgba(212, 175, 55, 0.4)');
  radialGlow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = radialGlow;
  ctx.beginPath();
  ctx.arc(0, 0, 180, 0, Math.PI * 2);
  ctx.fill();

  // Couple Silhouette outline
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 80px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('𑁍', 0, -20);
  ctx.restore();

  // Typography
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, 300, 580);

  ctx.fillStyle = '#D4AF37';
  ctx.font = 'italic 24px sans-serif';
  ctx.fillText(subtitle, 300, 630);

  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '16px sans-serif';
  ctx.fillText('AARAV & KIARA • 2026', 300, 680);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
