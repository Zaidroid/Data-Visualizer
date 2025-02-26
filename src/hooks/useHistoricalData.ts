import { useQuery } from '@tanstack/react-query';
import { HistoricalData } from '../types';

// More structured historical data with key events reflected
const generateHistoricalData = (): HistoricalData[] => {
  return Array.from({ length: 2024 - 1948 + 1 }, (_, i) => {
    const year = 1948 + i;
    
    // Key inflection points in population growth
    let palestinePopGrowth = 100000;
    let israelPopGrowth = 150000;
    let palestineBasePop = 1_500_000;
    let israelBasePop = 800_000;
    
    // Adjust for historical events
    if (year >= 1967) {
      // Six-Day War impact
      palestinePopGrowth = 110000;
    }
    if (year >= 1987) {
      // First Intifada period
      palestinePopGrowth = 120000;
    }
    if (year >= 1990) {
      // Soviet immigration to Israel
      israelPopGrowth = 180000;
    }
    if (year >= 2000) {
      // Second Intifada
      palestinePopGrowth = 125000;
    }
    if (year >= 2005) {
      // Post-disengagement
      palestinePopGrowth = 130000;
      israelPopGrowth = 160000;
    }
    
    // Calculate populations with more realistic growth curves
    const palestinePopulation = palestineBasePop + (i * palestinePopGrowth);
    const israelPopulation = israelBasePop + (i * israelPopGrowth);
    
    // Casualties with spikes during conflict years
    let palestineCasualties = 50 + Math.floor(Math.random() * 100);
    let israelCasualties = 10 + Math.floor(Math.random() * 30);
    
    // Adjusting for major conflicts
    if ([1948, 1956, 1967, 1973, 1982, 1987, 2000, 2006, 2008, 2014, 2021, 2023].includes(year)) {
      palestineCasualties = 1000 + Math.floor(Math.random() * 2000);
      israelCasualties = 200 + Math.floor(Math.random() * 500);
    }
    
    // Territory changes with key historical shifts
    let palestineTerritory = 100;
    let israelTerritory = 0;
    
    if (year >= 1948) {
      // UN Partition Plan and aftermath
      palestineTerritory = 45;
      israelTerritory = 55;
    }
    if (year >= 1967) {
      // After Six-Day War
      palestineTerritory = 22;
      israelTerritory = 78;
    }
    if (year >= 1994) {
      // Oslo Accords
      palestineTerritory = 25;
      israelTerritory = 75;
    }
    
    // Prisoners with realistic fluctuations
    let palestinePrisoners = 2000;
    let israelPrisoners = 20;
    
    if (year >= 1967) {
      palestinePrisoners = 4000 + Math.floor(Math.random() * 2000);
    }
    if (year >= 1987) {
      // First Intifada
      palestinePrisoners = 8000 + Math.floor(Math.random() * 3000);
    }
    if (year >= 2000) {
      // Second Intifada
      palestinePrisoners = 7000 + Math.floor(Math.random() * 3000);
    }
    if (year >= 2006) {
      israelPrisoners = 10 + Math.floor(Math.random() * 15);
    }
    
    return {
      year,
      population: {
        palestine: palestinePopulation,
        israel: israelPopulation,
      },
      casualties: {
        palestine: palestineCasualties,
        israel: israelCasualties,
      },
      prisoners: {
        palestine: palestinePrisoners,
        israel: israelPrisoners,
      },
      territory: {
        palestine: palestineTerritory,
        israel: israelTerritory,
      },
    };
  });
};

// Cache the generated data to avoid regenerating random values on each query
const mockData = generateHistoricalData();

export const useHistoricalData = () => {
  return useQuery({
    queryKey: ['historical-data'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockData;
    },
    staleTime: Infinity, // Keep the data fresh indefinitely since it's static
  });
};
