"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Lights() {
  const orangeLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Move the orange point light slowly from left to right behind the logo (slower motion)
    if (orangeLightRef.current) {
      orangeLightRef.current.position.x = Math.sin(t * 0.35) * 4.5;
      orangeLightRef.current.position.z = -2.5;
    }
  });

  return (
    <>
      {/* 3 White point lights positioned behind the logo (Z = -4) to create soft refractive backlight */}
      
      {/* Left White Light */}
      <pointLight
        position={[-4.5, 0, -4]}
        intensity={0.8}
        distance={10}
        decay={2}
        color="#ffffff"
      />

      {/* Right White Light */}
      <pointLight
        position={[4.5, 0, -4]}
        intensity={0.8}
        distance={10}
        decay={2}
        color="#ffffff"
      />

      {/* Center White Light (Face) */}
      <pointLight
        position={[0, 0, -4]}
        intensity={0.8}
        distance={10}
        decay={2}
        color="#ffffff"
      />

      {/* 1 Moving Orange point light behind the logo (dimmer intensity) */}
      <pointLight
        ref={orangeLightRef}
        position={[0, 0, -2.5]}
        intensity={30}
        distance={12}
        decay={2}
        color="#ff4500"
      />
    </>
  );
}