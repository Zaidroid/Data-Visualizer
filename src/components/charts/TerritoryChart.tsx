import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useStore } from '../../store/useStore';
import { useHistoricalData } from '../../hooks/useHistoricalData';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

export const TerritoryChart: React.FC = () => {
  const { timeline } = useStore();
  const { data } = useHistoricalData();
  const chartRef = useRef<ChartJS<"pie">>(null);
  
  // Animate when currentYear changes
  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      chart.update('none');
    }
  }, [timeline.currentYear]);

  const currentYearData = data?.find(d => d.year === timeline.currentYear);

  const chartData = {
    labels: ['Palestine Territory', 'Israel Territory'],
    datasets: [
      {
        data: [
          currentYearData?.territory.palestine || 0,
          currentYearData?.territory.israel || 0,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        borderWidth: 1,
        hoverBackgroundColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        hoverBorderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        hoverBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Territory Distribution (${timeline.currentYear})`,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${new Intl.NumberFormat('en-US').format(value)} km² (${percentage}%)`;
          }
        }
      },
    },
    animation: {
      duration: 500,
      easing: 'easeOutQuart',
    },
    transitions: {
      active: {
        animation: {
          duration: 300,
        }
      }
    },
  };

  return (
    <motion.div 
      className="relative w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Pie ref={chartRef} data={chartData} options={options} />
      
      {currentYearData && (
        <div className="absolute bottom-12 left-0 right-0 flex justify-center">
          <motion.div 
            className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={timeline.currentYear}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
              {timeline.currentYear} Territory
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Palestine</span>
                </div>
                <p className="text-sm font-medium">
                  {new Intl.NumberFormat().format(Math.round(currentYearData.territory.palestine || 0))} km²
                </p>
                <p className="text-xs text-gray-500">
                  {Math.round((currentYearData.territory.palestine / 
                    (currentYearData.territory.palestine + currentYearData.territory.israel)) * 100)}%
                </p>
              </div>
              <div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Israel</span>
                </div>
                <p className="text-sm font-medium">
                  {new Intl.NumberFormat().format(Math.round(currentYearData.territory.israel || 0))} km²
                </p>
                <p className="text-xs text-gray-500">
                  {Math.round((currentYearData.territory.israel / 
                    (currentYearData.territory.palestine + currentYearData.territory.israel)) * 100)}%
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
