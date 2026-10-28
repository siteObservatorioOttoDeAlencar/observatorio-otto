import { create } from "zustand";

interface SettingsState {
  useCustomCoordinates: boolean;
  latitude: number;
  longitude: number;
  nightModeDim: boolean;
  setCoordinates: (lat: number, lon: number) => void;
  toggleNightModeDim: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  useCustomCoordinates: false,
  latitude: -3.7793,
  longitude: -38.5661,
  nightModeDim: false,
  setCoordinates: (lat, lon) => set({ latitude: lat, longitude: lon, useCustomCoordinates: true }),
  toggleNightModeDim: () => set((state) => ({ nightModeDim: !state.nightModeDim })),
}));
