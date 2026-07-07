"use client";

import { useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperienceStore } from "@/store/useExperienceStore";

export default function ScrollController() {
  const setTargetScrollProgress = useExperienceStore((state) => state.setTargetScrollProgress);
  const setScrollProgress = useExperienceStore((state) => state.setScrollProgress);

  useEffect(() => {
    function handleWheel(e: WheelEvent) {
      const speed = 0.0006; // Slowed down from 0.0015 to make zoom more gradual
      const change = e.deltaY * speed;

      const currentTarget = useExperienceStore.getState().targetScrollProgress;
      const newTarget = THREE.MathUtils.clamp(currentTarget + change, 0, 6.0);
      setTargetScrollProgress(newTarget);
    }

    window.addEventListener("wheel", handleWheel, {
      passive: true,
    });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [setTargetScrollProgress]);

  useFrame((_, delta) => {
    const currentProgress = useExperienceStore.getState().scrollProgress;
    const targetProgress = useExperienceStore.getState().targetScrollProgress;

    // Glides slowly and smoothly (lerp factor reduced from 4.0 to 1.8)
    const nextProgress = THREE.MathUtils.lerp(
      currentProgress,
      targetProgress,
      delta * 1.8
    );

    if (Math.abs(currentProgress - nextProgress) > 0.0001) {
      setScrollProgress(nextProgress);
    }
  });

  return null;
}