"use client";

import React, { useEffect, useRef } from "react";

interface SparklesCoreProps {
  id?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  className?: string;
  particleColor?: string;
  speed?: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  fadeSpeed: number;
  active: boolean;
}

export default function SparklesCore({
  id = "sparkles",
  background = "transparent",
  minSize = 0.4,
  maxSize = 1.2,
  particleDensity = 80,
  className = "",
  particleColor = "#ffffff",
  speed = 0.8,
}: SparklesCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = canvas.offsetWidth || 300;
    let height = canvas.offsetHeight || 150;

    canvas.width = width;
    canvas.height = height;

    const createParticle = (isInitial = false): Particle => {
      const size = Math.random() * (maxSize - minSize) + minSize;
      return {
        x: Math.random() * width,
        y: isInitial ? Math.random() * height : height + 10,
        size,
        speedY: -(Math.random() * 0.3 + 0.1) * speed,
        speedX: (Math.random() - 0.5) * 0.15 * speed,
        opacity: isInitial ? Math.random() * 0.8 : 0,
        fadeSpeed: Math.random() * 0.005 + 0.002,
        active: true,
      };
    };

    // Calculate count based on density and canvas area
    const area = width * height;
    const densityFactor = 80000 / particleDensity;
    const count = Math.max(10, Math.floor(area / densityFactor));

    for (let i = 0; i < count; i++) {
      particles.push(createParticle(true));
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.offsetWidth || 300;
      height = canvas.offsetHeight || 150;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, index) => {
        if (!p.active) return;

        // Update positions
        p.y += p.speedY;
        p.x += p.speedX;

        // Fade in when born at bottom, fade out near top
        if (p.opacity < 0.8 && p.y > height - 40) {
          p.opacity += 0.015;
        } else if (p.y < 40) {
          p.opacity -= 0.01;
        }

        // Draw sparkle particle as a glowing circle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));
        ctx.fill();

        // Recycle particle if it dies or goes off screen
        if (p.y < -10 || p.opacity <= 0 || p.x < -10 || p.x > width + 10) {
          particles[index] = createParticle(false);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [minSize, maxSize, particleDensity, particleColor, speed]);

  return (
    <canvas
      ref={canvasRef}
      id={id}
      style={{
        background,
        display: "block",
      }}
      className={className}
    />
  );
}
