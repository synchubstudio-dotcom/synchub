import { create } from "zustand";

type ExperienceState = {
  isReady: boolean;
  setReady: (value: boolean) => void;
};

export const useExperienceStore = create<ExperienceState>((set) => ({
  isReady: false,

  setReady: (value) =>
    set({
      isReady: value,
    }),
}));