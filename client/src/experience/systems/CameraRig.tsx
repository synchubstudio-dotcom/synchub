"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";

export default function CameraRig() {
  const { camera, pointer } = useThree();

  useFrame((state, delta) => {
    easing.damp3(
      camera.position,
      [
        pointer.x * 1.2,
        pointer.y * 0.8,
        camera.position.z,
      ],
      0.25,
      delta
    );

    camera.lookAt(0, 0, 0);
  });

  return null;
}