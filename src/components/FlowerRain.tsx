'use client';

import React, { useEffect, useRef } from 'react';

export default function FlowerRain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cElement = canvas;
    const ctx = cElement.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const petals: Petal[] = [];
    const maxPetals = 65;

    const resizeCanvas = () => {
      cElement.width = window.innerWidth;
      cElement.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Petal {
      x: number = 0;
      y: number = 0;
      size: number = 0;
      speedY: number = 0;
      speedX: number = 0;
      angle: number = 0;
      spin: number = 0;
      color: string = '';
      opacity: number = 0;
      type: 'petal' | 'sparkle' = 'petal';

      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * cElement.width;
        this.y = init ? Math.random() * cElement.height : -10;
        this.type = Math.random() > 0.4 ? 'sparkle' : 'petal';
        
        if (this.type === 'sparkle') {
          this.size = Math.random() * 4 + 3; // Smaller sparkles
          this.speedY = Math.random() * 0.7 + 0.3; // Slower drift
          this.speedX = Math.random() * 0.4 - 0.2;
          this.angle = Math.random() * 360;
          this.spin = Math.random() * 3 - 1.5;
          this.opacity = Math.random() * 0.5 + 0.3;
          this.color = 'rgba(212, 175, 55, '; // Gold theme color
        } else {
          this.size = Math.random() * 8 + 6; // Petal sizes
          this.speedY = Math.random() * 1.2 + 0.8;
          this.speedX = Math.random() * 1 - 0.5;
          this.angle = Math.random() * 360;
          this.spin = Math.random() * 2 - 1;
          this.opacity = Math.random() * 0.5 + 0.4;
          
          // Traditional Gujarati Marigold Colors (Oranges, Yellows, Golds)
          const colors = [
            'rgba(249, 115, 22, ', // orange
            'rgba(234, 179, 8, ',  // yellow
            'rgba(245, 158, 11, ', // amber
            'rgba(239, 68, 68, ',  // red
          ];
          this.color = colors[Math.floor(Math.random() * colors.length)];
        }
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y / 30) * 0.3; // Gentle wind swing
        this.angle += this.spin;

        if (this.type === 'sparkle') {
          // Twinkle effect: oscillate opacity dynamically over time
          this.opacity = 0.2 + 0.6 * Math.abs(Math.sin((Date.now() + this.x * 10) / 400));
        }

        if (this.y > cElement.height + 20 || this.x < -20 || this.x > cElement.width + 20) {
          this.reset();
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.translate(this.x, this.y);
        c.rotate((this.angle * Math.PI) / 180);
        c.fillStyle = this.color + this.opacity + ')';
        
        if (this.type === 'sparkle') {
          // Draw a beautiful 4-pointed twinkling star
          c.beginPath();
          c.moveTo(0, -this.size);
          c.quadraticCurveTo(0, 0, this.size, 0);
          c.quadraticCurveTo(0, 0, 0, this.size);
          c.quadraticCurveTo(0, 0, -this.size, 0);
          c.quadraticCurveTo(0, 0, 0, -this.size);
          c.closePath();
          c.fill();
        } else {
          // Draw a soft almond petal or marigold floret shape
          c.beginPath();
          c.moveTo(0, -this.size / 2);
          c.quadraticCurveTo(this.size / 2, -this.size / 2, this.size / 2, 0);
          c.quadraticCurveTo(this.size / 2, this.size / 2, 0, this.size / 2);
          c.quadraticCurveTo(-this.size / 2, this.size / 2, -this.size / 2, 0);
          c.quadraticCurveTo(-this.size / 2, -this.size / 2, 0, -this.size / 2);
          c.closePath();
          c.fill();
        }
        
        c.restore();
      }
    }

    // Initialize petals (increased count to 65 for rich details)
    for (let i = 0; i < maxPetals; i++) {
      petals.push(new Petal());
    }

    const animate = () => {
      ctx.clearRect(0, 0, cElement.width, cElement.height);
      petals.forEach(p => {
        p.update();
        p.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20 w-full h-full select-none"
    />
  );
}
