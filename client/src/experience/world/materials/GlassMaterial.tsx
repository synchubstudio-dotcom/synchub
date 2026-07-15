"use client";

import { forwardRef } from "react";
import * as THREE from "three";

const GlassMaterial = forwardRef<THREE.MeshPhysicalMaterial>((props, ref) => {
  return (
    <meshPhysicalMaterial
      ref={ref}
      color="#ffffff"             // Clear transparent body
      metalness={0}
      roughness={0.32}            // Roughness scatters the light passing through, making refracted backlights look blurry and volumetric
      transmission={1.0}          // Fully transmissive glass body
      thickness={2.0}             // Glass thickness for refraction depth
      ior={1.45}                  // Index of Refraction for realistic glass refraction
      clearcoat={0.0}             // Disable clearcoat to completely eliminate sharp outline reflections
      clearcoatRoughness={0.0}
      transparent
      opacity={0.25}              // Highly transparent body
      envMapIntensity={0.0}       // Disable environment map reflections entirely for pure refraction
    />
  );
});

GlassMaterial.displayName = "GlassMaterial";
export default GlassMaterial;