"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperienceStore } from "@/store/useExperienceStore";
import GlassMaterial from "../materials/GlassMaterial";

export default function SyncHubLogo() {
  const group = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  const curve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 200;
    const scale = 4.0; // overall size

    for (let i = 0; i < segments; i++) {
      const t = (i / segments) * Math.PI * 2;

      // Lemniscate of Bernoulli (figure-eight / infinity curve)
      const denom = 1 + Math.sin(t) * Math.sin(t);
      const x = (scale * Math.cos(t)) / denom;
      const y = (scale * Math.sin(t) * Math.cos(t)) / denom;

      points.push(new THREE.Vector3(x, y, 0));
    }

    return new THREE.CatmullRomCurve3(points, true, "centripetal", 0.5);
  }, []);

  const geometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 400, 0.18, 64, true);
  }, [curve]);

  useFrame((state) => {
    if (!group.current) return;

    const t = state.clock.elapsedTime;

    group.current.rotation.y = t * 0.2;
    group.current.rotation.x = Math.sin(t * 0.5) * 0.03;
    group.current.position.y = -0.05 + Math.sin(t * 0.8) * 0.06;

    const sp = useExperienceStore.getState().scrollProgress;

    let targetScale = 0.5;
    let targetOpacity = 1.0;

    if (sp < 1.0) {
      targetScale = 20.0;
      targetOpacity = 0.0;
    } else if (sp >= 1.0 && sp < 2.0) {
      const p = sp - 1.0;
      targetScale = 20.0 - p * 19.5; // Zoom in / shrink down to 0.5
      targetOpacity = p; // Fade in to 1.0
    } else if (sp >= 2.0 && sp < 3.0) {
      targetScale = 0.5;
      targetOpacity = 1.0;
    } else if (sp >= 3.0 && sp < 4.0) {
      const p = sp - 3.0;
      targetScale = 0.5 + p * 19.5; // Zoom out / scale up to 20
      targetOpacity = Math.max(0.0, 1.0 - p); // Fade out to 0.0
    } else {
      targetScale = 20.0;
      targetOpacity = 0.0;
    }

    group.current.scale.setScalar(targetScale);

    if (materialRef.current) {
      materialRef.current.opacity = targetOpacity;
      materialRef.current.visible = targetOpacity > 0.001;
    }
  });

  return (
    <group ref={group} scale={0.5}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <GlassMaterial ref={materialRef} />
      </mesh>
    </group>
  );
}
