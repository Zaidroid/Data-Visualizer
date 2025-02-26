export interface HistoricalData {
  year: number;
  population: {
    palestine: number;
    israel: number;
  };
  casualties: {
    palestine: number;
    israel: number;
  };
  prisoners: {
    palestine: number;
    israel: number;
  };
  territory: {
    palestine: number;
    israel: number;
  };
}

export type Theme = 'light' | 'dark';

export interface TimelineState {
  currentYear: number;
  isPlaying: boolean;
  speed: number;
}