"use client";

import { forwardRef } from "react";
import * as THREE from "three";

const GlassMaterial = forwardRef<THREE.MeshPhysicalMaterial>((props, ref) => {
  return (
    <meshPhysicalMaterial
      ref={ref}
      color="#7EE7FF"
      metalness={0}
      roughness={0}
      transmission={1}
      thickness={1.5}
      ior={1.45}
      clearcoat={1}
      clearcoatRoughness={0}
      transparent
      opacity={1}
    />
  );
});

GlassMaterial.displayName = "GlassMaterial";
export default GlassMaterial;