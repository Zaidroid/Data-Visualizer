import { useQuery } from '@tanstack/react-query';
import { HistoricalData } from '../types';

// Simulated historical data - replace with actual API call
const mockData: HistoricalData[] = Array.from({ length: 2024 - 1948 + 1 }, (_, i) => {
  const year = 1948 + i;
  return {
    year,
    population: {
      palestine: 1_500_000 + i * 100000 + Math.random() * 50000,
      israel: 800_000 + i * 150000 + Math.random() * 50000,
    },
    casualties: {
      palestine: Math.floor(Math.random() * 1000),
      israel: Math.floor(Math.random() * 200),
    },
    prisoners: {
      palestine: Math.floor(5000 + Math.random() * 3000),
      israel: Math.floor(100 + Math.random() * 50),
    },
    territory: {
      palestine: Math.max(0, 100 - i * 0.5),
      israel: Math.min(100, i * 0.5),
    },
  };
});

export const useHistoricalData = () => {
  return useQuery({
    queryKey: ['historical-data'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockData;
    },
  });
};