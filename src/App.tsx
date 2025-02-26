import React from 'react';
import { Timeline } from './components/Timeline';
import { ThemeToggle } from './components/ThemeToggle';
import { Database } from 'lucide-react';
import { PopulationChart } from './components/charts/PopulationChart';
import { CasualtiesChart } from './components/charts/CasualtiesChart';
import { TerritoryChart } from './components/charts/TerritoryChart';
import { PrisonersChart } from './components/charts/PrisonersChart';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <header className="bg-white dark:bg-gray-800 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Database className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Historical Data Dashboard
                </h1>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid gap-6">
            <div className="col-span-2">
              <Timeline />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <PopulationChart />
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <CasualtiesChart />
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <TerritoryChart />
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <PrisonersChart />
              </div>
            </div>
          </div>
        </main>

        <footer className="bg-white dark:bg-gray-800 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Data sources: UN OCHA, World Bank Open Data
            </p>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
}

export default App;