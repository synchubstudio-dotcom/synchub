"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useExperienceStore } from "@/store/useExperienceStore";

export default function PlaneCracks() {
  const material = useRef<THREE.MeshBasicMaterial>(null);

  const phase = useExperienceStore((state) => state.phase);

  useFrame((_, delta) => {
    if (!material.current) return;

    const target = phase === "transition" ? 1 : 0;

    material.current.opacity = THREE.MathUtils.lerp(
      material.current.opacity,
      target,
      delta * 3
    );
  });

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1.49, 0]}
    >
      <planeGeometry args={[40, 40]} />

      <meshBasicMaterial
        ref={material}
        color="#00D9FF"
        transparent
        opacity={0}
        wireframe
      />
    </mesh>
  );
}