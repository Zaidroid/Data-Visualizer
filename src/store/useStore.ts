import { create } from 'zustand';
import { Theme, TimelineState } from '../types';

interface Store {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  timeline: TimelineState;
  setCurrentYear: (year: number) => void;
  togglePlayback: () => void;
  setSpeed: (speed: number) => void;
}

export const useStore = create<Store>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
  timeline: {
    currentYear: 1948,
    isPlaying: false,
    speed: 1,
  },
  setCurrentYear: (year) =>
    set((state) => ({ timeline: { ...state.timeline, currentYear: year } })),
  togglePlayback: () =>
    set((state) => ({
      timeline: { ...state.timeline, isPlaying: !state.timeline.isPlaying },
    })),
  setSpeed: (speed) =>
    set((state) => ({ timeline: { ...state.timeline, speed } })),
}));