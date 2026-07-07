"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import Scene from "./Scene";

export default function ExperienceCanvas() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
      }}
      camera={{
        position: [0, 0, 6],
        fov: 45,
      }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
