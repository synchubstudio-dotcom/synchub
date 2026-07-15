"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

export default function SceneEnvironment() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Rotate environment lights faster to make reflections crawl quicker along the glass
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.45;
    }
  });

  return (
    <Environment
      files="/hdr/studio.hdr"
      background={false}
    >
      <group ref={groupRef}>
        {/* Vibrant warm orange reflection panel */}
        <Lightformer
          form="rect"
          intensity={3.0}
          color="#ff7f1a"
          position={[-3, 2, -2]}
          scale={[10, 5, 1]}
          target={[0, 0, 0]}
        />
        
        {/* Dim, soft white highlight circle */}
        <Lightformer
          form="circle"
          intensity={0.0}
          color="#ffffff"
          position={[3, -1, 2]}
          scale={[5, 5, 1]}
          target={[0, 0, 0]}
        />

        {/* Vibrant orange accent panel (replacing the pink panel) */}
        <Lightformer
          form="rect"
          intensity={2.5}
          color="#ff5500"
          position={[0, 4, -3]}
          scale={[8, 2, 1]}
          target={[0, 0, 0]}
        />
      </group>
    </Environment>
  );
}