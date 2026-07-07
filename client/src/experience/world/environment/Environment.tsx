"use client";

import { Environment } from "@react-three/drei";

export default function SceneEnvironment() {
  return (
    <Environment
      files="/hdr/studio.hdr"
      background={false}
    />
  );
}