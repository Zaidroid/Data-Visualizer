import React, { useState } from 'react';
import { Timeline } from './components/Timeline';
import { ThemeToggle } from './components/ThemeToggle';
import { Database, BarChart, LineChart, PieChart, Users } from 'lucide-react';
import { PopulationChart } from './components/charts/PopulationChart';
import { CasualtiesChart } from './components/charts/CasualtiesChart';
import { TerritoryChart } from './components/charts/TerritoryChart';
import { PrisonersChart } from './components/charts/PrisonersChart';
import { AnimatedPopulationChart } from './components/charts/AnimatedPolulationChart';
import { DataInputForm } from './components/DataInputForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStore } from './store/useStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const queryClient = new QueryClient();

function DataDashboard() {
  const { timeline } = useStore();
  const [activeChart, setActiveChart] = useState<'standard' | 'animated'>('standard');

  return (
    <div className="grid gap-6">
      <div className="col-span-2">
        <Timeline />
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Population Data
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveChart('standard')}
              className={`p-2 rounded-md ${
                activeChart === 'standard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <LineChart className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveChart('animated')}
              className={`p-2 rounded-md ${
                activeChart === 'animated'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <LineChart className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="h-80">
          {activeChart === 'standard' ? (
            <PopulationChart />
          ) : (
            <AnimatedPopulationChart />
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Casualties ({timeline.currentYear})
            </h2>
          </div>
          <div className="h-64">
            <CasualtiesChart />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <PieChart className="w-5 h-5 text-green-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Territory Distribution ({timeline.currentYear})
            </h2>
          </div>
          <div className="h-64">
            <TerritoryChart />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Prisoners ({timeline.currentYear})
            </h2>
          </div>
          <div className="h-64">
            <PrisonersChart />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <DataInputForm />
        </div>
      </div>
    </div>
  );
}

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
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <DataDashboard />
            </TabsContent>
            
            <TabsContent value="about">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  About This Dashboard
                </h2>
                <div className="prose dark:prose-invert">
                  <p>
                    This dashboard visualizes historical data related to the Israeli-Palestinian conflict
                    from 1948 to the present day. The data includes population trends, casualties,
                    territorial changes, and prisoner statistics.
                  </p>
                  <p>
                    Use the timeline control to navigate through different years and observe how
                    statistics have changed over time. You can also upload your own custom dataset
                    in the appropriate JSON format.
                  </p>
                  <h3>Data Sources</h3>
                  <p>
                    The data used in this dashboard is compiled from multiple sources including:
                  </p>
                  <ul>
                    <li>UN Office for the Coordination of Humanitarian Affairs (OCHA)</li>
                    <li>World Bank Open Data</li>
                    <li>Various historical records and academic sources</li>
                  </ul>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    Note: The historical data presented is for educational purposes and
                    should be cross-referenced with official sources for accuracy.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>

        <footer className="bg-white dark:bg-gray-800 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Data sources: UN OCHA, World Bank Open Data • Last updated: February 2025
            </p>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
}

export default App;
