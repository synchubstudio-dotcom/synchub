import { create } from "zustand";

type ExperiencePhase =
  | "hero"
  | "transition"
  | "about";

interface ExperienceStore {
  phase: ExperiencePhase;
  isAnimating: boolean;
  scrollProgress: number;
  targetScrollProgress: number;

  setPhase: (phase: ExperiencePhase) => void;
  setAnimating: (value: boolean) => void;
  setScrollProgress: (progress: number) => void;
  setTargetScrollProgress: (target: number) => void;
}

export const useExperienceStore = create<ExperienceStore>((set) => ({
  phase: "hero",
  isAnimating: false,
  scrollProgress: 0,
  targetScrollProgress: 0,

  setPhase: (phase) => {
    set({ phase });
  },

  setAnimating: (value) => {
    set({
      isAnimating: value,
    });
  },

  setScrollProgress: (scrollProgress) => {
    set({
      scrollProgress,
      phase: scrollProgress < 1.0 ? "hero" : scrollProgress < 3.0 ? "transition" : "about",
    });
  },

  setTargetScrollProgress: (targetScrollProgress) => {
    set({ targetScrollProgress });
  },
}));