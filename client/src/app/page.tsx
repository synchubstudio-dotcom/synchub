"use client";

import { useEffect } from "react";
import { useExperienceStore } from "@/store/useExperienceStore";
import ShapeBlur from "@/components/layout/ShapeBlur";
import { SparklesCore } from "@/components/ui/sparkles";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";

export default function Home() {
  const scrollProgress = useExperienceStore((state) => state.scrollProgress);

  useEffect(() => {
    const preventDefault = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener("touchmove", preventDefault, { passive: false });
    document.addEventListener("dragstart", preventDefault);
    document.addEventListener("selectstart", preventDefault);

    return () => {
      document.removeEventListener("touchmove", preventDefault);
      document.removeEventListener("dragstart", preventDefault);
      document.removeEventListener("selectstart", preventDefault);
    };
  }, []);


  // Base text state parameters (Phase 1, scrollProgress < 1.0, fully active and visible)
  let textFade = 1.0;
  let textScale = 1.5;
  let textY = 0;
  let effectActive = 1.0;
  let sparklesOpacity = 1.0;

  if (scrollProgress < 1.0) {
    const t = 1.0 - scrollProgress;
    textFade = 1.0;
    textScale = 1.0 + t * 0.5; // goes from 1.5 down to 1.0
    effectActive = t; // goes from 1.0 to 0.0
    sparklesOpacity = t; // goes from 1.0 to 0.0
  } else if (scrollProgress >= 1.0 && scrollProgress < 3.0) {
    // In transition 1 and middle logo section, keep text flat white and visible at scale 1.0
    textFade = 1.0;
    textScale = 1.0;
    effectActive = 0.0;
    sparklesOpacity = 0.0;
  } else if (scrollProgress >= 3.0) {
    // Transition 2: flat text fades out and slides up
    const p = scrollProgress - 3.0;
    textFade = Math.max(0.0, 1.0 - p / 0.5);
    textScale = Math.max(0.8, 1.0 - p * 0.2);
    textY = -p * 120;
    effectActive = 0.0;
    sparklesOpacity = 0.0;
  }

  // scrollProgress 3.2 to 4.2: About section fades and slides in
  const aboutProgress =
    scrollProgress > 3.2 ? Math.min(1.0, (scrollProgress - 3.2) / 1.0) : 0.0;
  const aboutEnter =
    scrollProgress > 3.2 ? Math.min(1, scrollProgress - 3.2) : 0;

  const aboutExit =
    scrollProgress > 4.2 ? Math.min(1, scrollProgress - 4.2) : 0;

  const aboutOpacity = aboutEnter * (1 - aboutExit);

  const aboutY = (1 - aboutEnter) * 80 - aboutExit * 120;
  const isAboutActive = scrollProgress >= 3.8;

  const servicesProgress =
    scrollProgress > 4.2 ? Math.min(1, scrollProgress - 4.2) : 0;

  const servicesOpacity = servicesProgress;

  const servicesY = (1 - servicesProgress) * 80;

  const isServicesActive = scrollProgress >= 4.8;

  return (
    <main className="min-h-screen w-full flex items-center justify-center overflow-hidden pointer-events-none relative">
      {/* SyncHub Text Div (centered exactly in the viewport) */}
      <div
        style={{
          transform: `scale(${textScale}) translateY(${textY}px)`,
          opacity: textFade,
          transition: "transform 0.1s ease-out, opacity 0.1s ease-out",
          width: "750px",
          height: "180px",
        }}
        className="relative origin-center select-none flex items-center justify-center pointer-events-auto"
      >
        <ShapeBlur
          className="w-full h-full"
          circleSize={0.2}
          effectActive={effectActive}
          gradientStrength={effectActive}
        />

        {/* Aceternity Sparkles Container - positioned directly underneath the text */}
        <div
          style={{
            opacity: sparklesOpacity,
            transition: "opacity 0.2s ease-out",
            width: "450px",
            height: "150px",
            position: "absolute",
            top: "135px", // Minimize gap, aligns exactly at the bottom baseline of the letters
            left: "50%",
            transform: "translateX(-50%)",
            maskImage:
              "radial-gradient(ellipse at top, black 25%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at top, black 25%, transparent 75%)",
          }}
          className="pointer-events-none select-none flex flex-col items-center justify-start overflow-hidden"
        >
          {/* Glow Line Gradients (from Aceternity layout) at the top of the container */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[40px]">
            <div className="absolute inset-x-0 top-0 bg-gradient-to-r from-transparent via-neutral-400 to-transparent h-[2px] blur-sm" />
            <div className="absolute inset-x-0 top-0 bg-gradient-to-r from-transparent via-neutral-300 to-transparent h-px" />
            <div className="absolute inset-x-10 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[4px] blur-sm" />
            <div className="absolute inset-x-10 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px" />
          </div>

          {/* Sparkles Canvas */}
          <SparklesCore
            background="transparent"
            minSize={0.15}
            maxSize={0.6}
            particleDensity={1200}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
        </div>
      </div>

      {/* About Section */}
      <About
        opacity={aboutOpacity}
        translateY={aboutY}
        isActive={isAboutActive}
      />

      <Services
        opacity={servicesOpacity}
        translateY={servicesY}
        isActive={isServicesActive}
      />
    </main>
  );
}
 