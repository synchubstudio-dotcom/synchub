import { create } from "zustand";

export type CameraSection =
  | "hero"
  | "about"
  | "services"
  | "projects"
  | "contact";

interface CameraStore {
  section: CameraSection;
  setSection: (section: CameraSection) => void;
}

export const useCameraStore = create<CameraStore>((set) => ({
  section: "hero",

  setSection: (section) => set({ section }),
}));