"use client";

import { Lightformer } from "@react-three/drei";

export default function Lights() {
  return (
    <>
      {/* Soft ambient */}
      <ambientLight intensity={0.15} />

      {/* Main white key light */}
      <directionalLight
        position={[5, 6, 5]}
        intensity={2}
        castShadow
      />

      {/* Blue rim light */}
      <pointLight
        position={[-6, 2, -5]}
        intensity={40}
        color="#4CC9FF"
      />

      {/* Orange rim light */}
      <pointLight
        position={[6, 2, -5]}
        intensity={18}
        color="#FF8A3D"
      />

      {/* Top highlight */}
      <spotLight
        position={[0, 8, 0]}
        intensity={25}
        angle={0.35}
        penumbra={1}
      />

      {/* Reflection panels */}
      <Lightformer
        intensity={5}
        position={[0, 5, -5]}
        scale={[8, 8, 1]}
      />

      <Lightformer
        intensity={4}
        position={[4, 1, 3]}
        scale={[3, 3, 1]}
      />
    </>
  );
}