import { create } from 'zustand';
import { HistoricalData, TimelineState } from '../types';

interface StoreState {
  timeline: TimelineState;
  customData: HistoricalData[] | null;
  isUsingCustomData: boolean;
  
  setCurrentYear: (year: number) => void;
  togglePlayback: () => void;
  setSpeed: (speed: number) => void;
  setCustomData: (data: HistoricalData[]) => void;
  resetToDefaultData: () => void;
}

export const useStore = create<StoreState>((set) => ({
  timeline: {
    currentYear: 1948,
    isPlaying: false,
    speed: 1,
  },
  customData: null,
  isUsingCustomData: false,
  
  setCurrentYear: (year) => set((state) => ({
    timeline: { ...state.timeline, currentYear: year }
  })),
  
  togglePlayback: () => set((state) => ({
    timeline: { ...state.timeline, isPlaying: !state.timeline.isPlaying }
  })),
  
  setSpeed: (speed) => set((state) => ({
    timeline: { ...state.timeline, speed }
  })),
  
  setCustomData: (data) => set({
    customData: data,
    isUsingCustomData: true,
  }),
  
  resetToDefaultData: () => set({
    customData: null,
    isUsingCustomData: false,
  }),
}));
