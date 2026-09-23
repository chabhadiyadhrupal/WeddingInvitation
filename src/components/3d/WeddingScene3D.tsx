'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createMandap3D } from './Mandap3D';
import { createFloatingFrames3D } from './FloatingFrames3D';
import { createEventsScene3D } from './EventsScene3D';
import { createLocationMap3D } from './LocationMap3D';
import { createPetalParticles3D } from './PetalParticles3D';

gsap.registerPlugin(ScrollTrigger);

interface WeddingScene3DProps {
  onProgressUpdate?: (progress: number, activeSectionIndex: number) => void;
  onLoaded?: () => void;
}

export default function WeddingScene3D({ onProgressUpdate, onLoaded }: WeddingScene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const isMobile = window.innerWidth < 768;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0D0814');
    scene.fog = new THREE.FogExp2('#0D0814', 0.022);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      120
    );
    camera.position.set(0, 3.5, 24.0);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // 2. Professional Lighting
    const ambientLight = new THREE.AmbientLight(0xFFF5E6, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xFFD700, 2.8);
    sunLight.position.set(12, 18, 15);
    scene.add(sunLight);

    const mandapSpot = new THREE.PointLight(0xFF8C00, 4.5, 35);
    mandapSpot.position.set(0, 8, -8);
    scene.add(mandapSpot);

    const rimLight = new THREE.DirectionalLight(0xE6B8B8, 1.2);
    rimLight.position.set(-10, 10, -10);
    scene.add(rimLight);

    // 3. Assemble 3D Scene Components
    const mandap = createMandap3D();
    mandap.group.position.set(0, 0, -8.0);
    scene.add(mandap.group);

    const photoCorridor = createFloatingFrames3D();
    scene.add(photoCorridor.group);

    const eventsScene = createEventsScene3D();
    scene.add(eventsScene.group);

    const locationMap = createLocationMap3D();
    scene.add(locationMap.group);

    const particles = createPetalParticles3D(isMobile ? 80 : 180);
    scene.add(particles.group);

    // Fire onLoaded callback immediately on frame 1
    if (onLoaded) {
      requestAnimationFrame(() => {
        onLoaded();
      });
    }

    // 4. GSAP Scroll Driven Camera Waypoints
    const cameraTarget = new THREE.Vector3(0, 2.0, -8.0);

    const cameraWaypoints = [
      { pos: [0, 3.5, 24.0], target: [0, 2.0, 0] },         // 0: Hero
      { pos: [-1.2, 2.5, 15.0], target: [0, 2.2, 8.0] },      // 1: Story
      { pos: [1.8, 2.2, 6.0], target: [-1.0, 1.8, 0] },       // 2: Events
      { pos: [0, 1.8, -1.5], target: [0, 2.0, -8.0] },        // 3: Mandap
      { pos: [-2.5, 3.0, -6.0], target: [1.5, 2.0, -10.0] },   // 4: Gallery
      { pos: [0, 8.0, -12.0], target: [0, -1.0, -22.0] },     // 5: Location Map
      { pos: [0, 5.5, 26.0], target: [0, 2.0, -8.0] },        // 6: RSVP Final
    ];

    const currentPos = { x: cameraWaypoints[0].pos[0], y: cameraWaypoints[0].pos[1], z: cameraWaypoints[0].pos[2] };
    const currentTarget = { x: cameraWaypoints[0].target[0], y: cameraWaypoints[0].target[1], z: cameraWaypoints[0].target[2] };

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.0,
        onUpdate: (self) => {
          const p = self.progress;
          const sectionIdx = Math.min(Math.floor(p * 7), 6);
          if (onProgressUpdate) {
            onProgressUpdate(p, sectionIdx);
          }
        },
      },
    });

    for (let i = 0; i < cameraWaypoints.length - 1; i++) {
      const nextWp = cameraWaypoints[i + 1];
      scrollTl.to(currentPos, {
        x: nextWp.pos[0],
        y: nextWp.pos[1],
        z: nextWp.pos[2],
        ease: 'power1.inOut',
        duration: 1,
      }, i);

      scrollTl.to(currentTarget, {
        x: nextWp.target[0],
        y: nextWp.target[1],
        z: nextWp.target[2],
        ease: 'power1.inOut',
        duration: 1,
      }, i);
    }

    // 5. Animation Render Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      mandap.update(elapsedTime);
      photoCorridor.update(elapsedTime);
      eventsScene.update(elapsedTime);
      locationMap.update(elapsedTime);
      particles.update(elapsedTime);

      camera.position.set(currentPos.x, currentPos.y, currentPos.z);
      cameraTarget.set(currentTarget.x, currentTarget.y, currentTarget.z);
      camera.lookAt(cameraTarget);

      // Subtle float
      camera.position.x += Math.sin(elapsedTime * 0.8) * 0.03;
      camera.position.y += Math.cos(elapsedTime * 0.6) * 0.02;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!canvasRef.current) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      renderer.dispose();
    };
  }, [onLoaded, onProgressUpdate]);

  return (
    <div ref={containerRef} className="relative w-full h-[700vh]">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      />
    </div>
  );
}
