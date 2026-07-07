"use client";

import {
  EffectComposer,
  Bloom,
  Vignette,
} from "@react-three/postprocessing";

export default function Effects() {
  return (
    <EffectComposer>
      <Bloom
        mipmapBlur
        intensity={0.45}
        luminanceThreshold={0.8}
      />

      <Vignette
        eskil={false}
        offset={0.25}
        darkness={0.9}
      />
    </EffectComposer>
  );
}