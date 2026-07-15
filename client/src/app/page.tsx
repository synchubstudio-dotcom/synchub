"use client";

import { useEffect } from "react";
import { useExperienceStore } from "@/store/useExperienceStore";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import BlurText from "@/components/ui/BlurText";

export default function Home() {
  const scrollProgress = useExperienceStore((state) => state.scrollProgress);
  const isIntroComplete = useExperienceStore((state) => state.isIntroComplete);

  useEffect(() => {
    // Reset intro complete state on mount to prevent dev hot-reload persistence
    useExperienceStore.getState().setIntroComplete(false);

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
  let textY = 0;

  if (!isIntroComplete) {
    // Hidden during logo auto-zoom intro
    textFade = 0.0;
  } else {
    // Normal scroll animation logic once intro is complete
    if (scrollProgress < 1.0) {
      textFade = 1.0;
    } else if (scrollProgress >= 1.0 && scrollProgress < 3.0) {
      // In transition 1 and middle logo section, keep text flat white and visible
      textFade = 1.0;
    } else if (scrollProgress >= 3.0) {
      // Transition 2: flat text fades out and slides up
      const p = scrollProgress - 3.0;
      textFade = Math.max(0.0, 1.0 - p / 0.5);
      textY = -p * 120;
    }
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
          transform: `translateY(${textY}px)`,
          opacity: textFade,
          transition: "transform 0.1s ease-out, opacity 0.1s ease-out",
        }}
        className="relative origin-center select-none flex items-center justify-center pointer-events-auto"
      >
        {isIntroComplete && (
          <BlurText
            text="SyncHUB"
            delay={80}
            animateBy="letters"
            direction="bottom"
            className="text-[68px] sm:text-[84px] tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#e5e5e5] to-[#a3a3a3] select-none text-center"
            stepDuration={0.4}
            style={(index) => ({
              fontFamily: "var(--font-space-grotesk)",
              fontWeight: index >= 4 ? 800 : 300,
              lineHeight: 1.0,
            })}
          />
        )}
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
 