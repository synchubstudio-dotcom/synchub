"use client";

import { useExperienceStore } from "@/store/useExperienceStore";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function Floor() {
  const mesh = useRef<THREE.Mesh>(null);

  const phase = useExperienceStore((state) => state.phase);

  useFrame((state, delta) => {
    if (!mesh.current) return;

    if (phase === "hero") {
      mesh.current.rotation.z = THREE.MathUtils.lerp(
        mesh.current.rotation.z,
        0,
        delta * 2
      );

      mesh.current.scale.setScalar(
        THREE.MathUtils.lerp(mesh.current.scale.x, 1, delta * 2)
      );
    }

    if (phase === "transition") {
      mesh.current.rotation.z += delta * 0.15;

      const s = 1 + Math.sin(state.clock.elapsedTime * 20) * 0.02;

      mesh.current.scale.setScalar(s);
    }
  });

  return (
    <mesh
      ref={mesh}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1.5, 0]}
      receiveShadow
    >
      <planeGeometry args={[40, 40]} />

      <meshStandardMaterial
        color="#080808"
        metalness={0.4}
        roughness={0.8}
      />
    </mesh>
  );
}