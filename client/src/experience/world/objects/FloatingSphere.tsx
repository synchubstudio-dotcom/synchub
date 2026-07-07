"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function FloatingSphere() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;

    const t = state.clock.elapsedTime;

    mesh.current.position.y = Math.sin(t * 0.8) * 0.15;

    mesh.current.rotation.y = t * 0.2;

    mesh.current.rotation.x = Math.sin(t * 0.3) * 0.06;

    mesh.current.rotation.z = Math.cos(t * 0.4) * 0.04;

    const scale = 1 + Math.sin(t * 1.5) * 0.01;

    mesh.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={mesh} castShadow receiveShadow>
      <sphereGeometry args={[1, 256, 256]} />

      <meshPhysicalMaterial
        color="#8EEBFF"
        metalness={0}
        roughness={0.02}
        transmission={1}
        thickness={2}
        ior={1.45}
        clearcoat={1}
        clearcoatRoughness={0}
        reflectivity={1}
        attenuationColor="#6BE6FF"
        attenuationDistance={1.5}
      />
    </mesh>
  );
}
