/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  vRot: number;
  shape: 'square' | 'sparkle' | 'circle';
}

export interface ParticleCanvasRef {
  burstAtCells: (cellCoords: { x: number; y: number; color?: string }[]) => void;
  celebrate: () => void;
}

export const ParticleCanvas = forwardRef<ParticleCanvasRef, {}>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const startLoop = () => {
    if (animFrameRef.current !== null) return;

    const MAX_PARTICLES = 110;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animFrameRef.current = null;
        return;
      }

      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) {
        animFrameRef.current = null;
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const len = particles.length;
      if (len === 0) {
        animFrameRef.current = null;
        return;
      }

      for (let i = len - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // smooth gravity
        p.vx *= 0.96; // air resistance
        p.vy *= 0.96;
        p.rotation += p.vRot;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x * dpr, p.y * dpr);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        const s = p.size * dpr;
        if (p.shape === 'square') {
          ctx.fillRect(-s * 0.5, -s * 0.5, s, s);
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.45, 0, 6.283);
          ctx.fill();
        } else {
          // Sparkle 4-point diamond
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.lineTo(s * 0.35, 0);
          ctx.lineTo(0, s);
          ctx.lineTo(-s * 0.35, 0);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      if (particles.length > 0) {
        animFrameRef.current = requestAnimationFrame(render);
      } else {
        animFrameRef.current = null;
      }
    };

    animFrameRef.current = requestAnimationFrame(render);
  };

  useImperativeHandle(ref, () => ({
    burstAtCells: (cellCoords) => {
      const colors = ['#60A5FA', '#34D399', '#FBBF24', '#F472B6', '#A78BFA', '#38BDF8', '#FB7185'];
      const particles = particlesRef.current;

      // Ensure total particles do not exceed max
      const perCell = Math.max(6, Math.min(14, Math.floor(90 / (cellCoords.length || 1))));

      for (const cell of cellCoords) {
        if (particles.length >= 110) break;
        const baseColor = cell.color || colors[Math.floor(Math.random() * colors.length)];

        for (let i = 0; i < perCell; i++) {
          const angle = Math.random() * 6.283;
          const speed = 2.5 + Math.random() * 5.5;
          const shape: 'square' | 'sparkle' | 'circle' =
            i % 3 === 0 ? 'square' : i % 3 === 1 ? 'sparkle' : 'circle';

          particles.push({
            x: cell.x,
            y: cell.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.8,
            size: 4 + Math.random() * 5,
            color: Math.random() < 0.25 ? '#FFFFFF' : baseColor,
            alpha: 1,
            decay: 0.024 + Math.random() * 0.025,
            rotation: Math.random() * 6.283,
            vRot: (Math.random() - 0.5) * 0.25,
            shape,
          });
        }
      }

      startLoop();
    },

    celebrate: () => {
      const colors = ['#F59E0B', '#EC4899', '#3B82F6', '#10B981', '#8B5CF6', '#06B6D4'];
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight * 0.4;
      const particles = particlesRef.current;

      for (let i = 0; i < 60; i++) {
        const angle = Math.random() * 6.283;
        const speed = 3.5 + Math.random() * 7;
        particles.push({
          x: cx + (Math.random() - 0.5) * 50,
          y: cy + (Math.random() - 0.5) * 50,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2.5,
          size: 5 + Math.random() * 6,
          color: colors[i % colors.length],
          alpha: 1,
          decay: 0.018 + Math.random() * 0.018,
          rotation: Math.random() * 6.283,
          vRot: (Math.random() - 0.5) * 0.2,
          shape: i % 2 === 0 ? 'square' : 'sparkle',
        });
      }

      startLoop();
    },
  }));

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full gpu-accelerated"
      style={{ width: '100vw', height: '100vh', touchAction: 'none' }}
    />
  );
});

ParticleCanvas.displayName = 'ParticleCanvas';
