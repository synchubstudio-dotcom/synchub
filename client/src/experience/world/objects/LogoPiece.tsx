"use client";

import { RoundedBox } from "@react-three/drei";

type LogoPieceProps = {
  position: [number, number, number];
  rotation?: [number, number, number];
};

export default function LogoPiece({
  position,
  rotation = [0, 0, 0],
}: LogoPieceProps) {
  return (
    <RoundedBox
      args={[2.4, 0.28, 0.35]}
      radius={0.12}
      smoothness={8}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <meshPhysicalMaterial
        color="#8EEBFF"
        transmission={1}
        roughness={0.02}
        thickness={2}
        ior={1.45}
        clearcoat={1}
        clearcoatRoughness={0}
      />
    </RoundedBox>
  );
}