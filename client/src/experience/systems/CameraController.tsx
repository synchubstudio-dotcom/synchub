"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { useCameraStore } from "@/store/useCameraStore";
import { useExperienceStore } from "@/store/useExperienceStore";

export default function CameraController() {
  const { camera } = useThree();

  const section = useCameraStore((state) => state.section);
  useFrame((state, delta) => {
    const sp = useExperienceStore.getState().scrollProgress;

    let targetZ = 3.0;
    if (sp >= 1.0 && sp < 2.0) {
      targetZ = 3.0 + (sp - 1.0) * 5.0; // zooms out from 3 to 8
    } else if (sp >= 2.0 && sp < 3.0) {
      targetZ = 8.0;
    } else if (sp >= 3.0 && sp < 4.0) {
      targetZ = 8.0 - (sp - 3.0) * 5.0; // zooms in from 8 to 3
    } else if (sp >= 4.0) {
      targetZ = 3.0;
    }

    easing.damp3(
      camera.position,
      [0, 0, targetZ],
      0.18,
      delta
    );

    camera.lookAt(0, 0, 0);
  });

  return null;
}
