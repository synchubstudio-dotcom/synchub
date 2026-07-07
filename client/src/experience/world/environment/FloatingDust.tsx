"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function FloatingDust() {
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(800 * 3);

    for (let i = 0; i < 800; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    return geometry;
  }, []);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        color="#8fdcff"
        size={0.03}
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </points>
  );
}