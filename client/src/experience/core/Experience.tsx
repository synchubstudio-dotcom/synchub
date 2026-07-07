"use client";

import { useExperienceStore } from "@/store/useExperienceStore";
import ExperienceCanvas from "../world/ExperienceCanvas";

export default function Experience() {
  const scrollProgress = useExperienceStore((state) => state.scrollProgress);

  let opacity = 1.0;
  if (scrollProgress < 1.0) {
    opacity = 0.0;
  } else if (scrollProgress >= 1.0 && scrollProgress < 2.0) {
    opacity = scrollProgress - 1.0;
  } else if (scrollProgress >= 2.0 && scrollProgress < 3.0) {
    opacity = 1.0;
  } else if (scrollProgress >= 3.0 && scrollProgress < 4.0) {
    opacity = Math.max(0.0, 1.0 - (scrollProgress - 3.0));
  } else {
    opacity = 0.0;
  }

  return (
    <div 
      style={{ 
        opacity,
        pointerEvents: opacity === 0 ? "none" : "auto",
        transition: "opacity 0.1s ease-out",
      }} 
      className="fixed inset-0 -z-0"
    >
      <ExperienceCanvas />
    </div>
  );
}