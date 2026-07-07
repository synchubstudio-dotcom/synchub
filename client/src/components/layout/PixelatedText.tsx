"use client";

import { useEffect, useRef } from "react";
import { useExperienceStore } from "@/store/useExperienceStore";

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  origX: number; // sampled offscreen x
  origY: number; // sampled offscreen y
  size: number;
  baseSize: number;
  color: string;
  alpha: number;
  sparkle: number;
  sparkleSpeed: number;
}

export default function PixelatedText() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  // Base font size (kept matching the original text size: ~70px)
  const baseFontSize = 70; 

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width;
    let height = canvas.height;

    // Create offscreen canvas to render text and sample pixels
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = 1600;
    offscreenCanvas.height = 500;
    const offscreenCtx = offscreenCanvas.getContext("2d");

    function initParticles() {
      if (!offscreenCtx) return;

      offscreenCtx.clearRect(0, 0, 1600, 500);
      
      // Draw text on offscreen canvas
      offscreenCtx.fillStyle = "white";
      offscreenCtx.font = `bold ${baseFontSize}px Noorliza, sans-serif`;
      offscreenCtx.textAlign = "center";
      offscreenCtx.textBaseline = "middle";
      offscreenCtx.fillText("SyncHub", 800, 250);

      const imgData = offscreenCtx.getImageData(0, 0, 1600, 500);
      const data = imgData.data;
      const step = 3; // Finer density for smaller base font size
      const tempParticles: Particle[] = [];

      for (let y = 0; y < 500; y += step) {
        for (let x = 0; x < 1600; x += step) {
          const alpha = data[(y * 1600 + x) * 4 + 3];
          if (alpha > 100) {
            const baseSize = Math.random() * 1.0 + 1.2; // 1.2px to 2.2px particles
            tempParticles.push({
              x: 0,
              y: 0,
              baseX: 0,
              baseY: 0,
              origX: x,
              origY: y,
              size: baseSize,
              baseSize: baseSize,
              color: "rgba(255, 255, 255, 1)",
              alpha: alpha / 255,
              sparkle: Math.random() * Math.PI,
              sparkleSpeed: Math.random() * 3 + 2,
            });
          }
        }
      }

      particlesRef.current = tempParticles;
      resize();
    }

    function resize() {
      if (!canvas) return;
      
      const parent = canvas.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
      width = rect.width;
      height = rect.height;
      
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      // Map offscreen coordinates to fit onscreen size
      const fitScale = Math.min(width / 1600, height / 500) * 0.95;
      const offsetX = (width - 1600 * fitScale) / 2;
      const offsetY = (height - 500 * fitScale) / 2;

      particlesRef.current.forEach((p) => {
        const bx = p.origX * fitScale + offsetX;
        const by = p.origY * fitScale + offsetY;
        p.baseX = bx;
        p.baseY = by;
        
        if (p.x === 0 && p.y === 0) {
          p.x = bx;
          p.y = by;
        }
      });
    }

    // Wait for fonts to load
    if (document.fonts) {
      document.fonts.ready.then(() => {
        initParticles();
      });
    } else {
      setTimeout(initParticles, 200);
    }

    window.addEventListener("resize", resize);

    // Mouse events (corrected for scale)
    function handleMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) * (width / rect.width);
      mouseRef.current.y = (e.clientY - rect.top) * (height / rect.height);
      mouseRef.current.active = true;
    }

    // Clear mouse position when it leaves
    function handleMouseLeave() {
      mouseRef.current.active = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    }

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Animation Loop
    let lastTime = 0;
    function animate(time: number) {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (ctx) {
        ctx.clearRect(0, 0, width, height);

        const sp = useExperienceStore.getState().scrollProgress;

        if (sp <= 2.0) {
          // Phase 0, 1, 2: solid normal text matching the original size and style (no particles, no hover)
          const fitScale = Math.min(width / 1600, height / 500) * 0.95;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = `bold ${baseFontSize * fitScale}px Noorliza, sans-serif`;
          
          // Re-align particles for the next transition
          particlesRef.current.forEach((p) => {
            p.x = p.baseX;
            p.y = p.baseY;
          });

          // Text gradient identical to original page styles
          const grad = ctx.createLinearGradient(width / 2 - 150 * fitScale, 0, width / 2 + 150 * fitScale, 0);
          grad.addColorStop(0, "#ffffff");
          grad.addColorStop(0.5, "#e5e5e5");
          grad.addColorStop(1, "#a3a3a3");
          
          ctx.fillStyle = grad;
          ctx.fillText("SyncHub", width / 2, height / 2);
        } else {
          // Phase 3 (scrollProgress > 2.0): Zoom increases and text breaks into interactive sparkles!
          const mouse = mouseRef.current;
          const particles = particlesRef.current;
          const radius = 100; // Interaction radius

          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            p.sparkle += delta * p.sparkleSpeed;

            // Physics: repel effect
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let targetX = p.baseX;
            let targetY = p.baseY;
            let force = 0;

            if (mouse.active && dist < radius) {
              force = (radius - dist) / radius; // 0 to 1
              const angle = Math.atan2(dy, dx);
              targetX = p.baseX - Math.cos(angle) * force * 50;
              targetY = p.baseY - Math.sin(angle) * force * 50;
            }

            // Smooth lerp
            p.x += (targetX - p.x) * 0.12;
            p.y += (targetY - p.y) * 0.12;

            let opacity = p.alpha * (Math.sin(p.sparkle) * 0.25 + 0.75);
            let colorStr = `rgba(255, 255, 255, ${opacity})`;
            let size = p.baseSize;

            if (force > 0) {
              // Glow cyan & white sparkle effect under mouse hover
              size = p.baseSize * (1.0 + force * 1.6);
              const mixRatio = Math.sin(p.sparkle * 1.5) * 0.5 + 0.5;
              if (mixRatio > 0.5) {
                colorStr = `rgba(126, 231, 255, ${Math.min(1, opacity * 1.3)})`; // Cyan glow
              } else {
                colorStr = `rgba(255, 255, 255, ${Math.min(1, opacity * 1.5)})`; // White glow
              }
            }

            ctx.fillStyle = colorStr;
            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="block cursor-default select-none pointer-events-auto"
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}
