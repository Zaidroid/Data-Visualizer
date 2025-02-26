import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useStore } from '../../store/useStore';
import { useHistoricalData } from '../../hooks/useHistoricalData';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const PopulationChart: React.FC = () => {
  const { timeline } = useStore();
  const { data } = useHistoricalData();
  const chartRef = useRef<ChartJS<"line">>(null);
  
  // Animate the vertical line when currentYear changes
  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      
      // Create custom animation
      const yearIndex = timeline.currentYear - 1948;
      if (yearIndex >= 0 && yearIndex < (2024 - 1948 + 1)) {
        const meta = chart.getDatasetMeta(0);
        if (meta.data[yearIndex]) {
          // Highlight the current year's data point
          chart.update('none');
        }
      }
    }
  }, [timeline.currentYear]);

  const chartData = {
    labels: data?.map(d => d.year.toString()) || [],
    datasets: [
      {
        label: 'Palestine Population',
        data: data?.map(d => d.population.palestine) || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.3,
        pointBackgroundColor: (context: any) => {
          const index = context.dataIndex;
          const year = 1948 + index;
          return year === timeline.currentYear ? 'rgb(34, 197, 94)' : 'rgba(34, 197, 94, 0.5)';
        },
        pointRadius: (context: any) => {
          const index = context.dataIndex;
          const year = 1948 + index;
          return year === timeline.currentYear ? 8 : 3;
        },
        pointHoverRadius: 8,
      },
      {
        label: 'Israel Population',
        data: data?.map(d => d.population.israel) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
        pointBackgroundColor: (context: any) => {
          const index = context.dataIndex;
          const year = 1948 + index;
          return year === timeline.currentYear ? 'rgb(59, 130, 246)' : 'rgba(59, 130, 246, 0.5)';
        },
        pointRadius: (context: any) => {
          const index = context.dataIndex;
          const year = 1948 + index;
          return year === timeline.currentYear ? 8 : 3;
        },
        pointHoverRadius: 8,
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
        text: 'Population Trends',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US').format(context.parsed.y);
            }
            return label;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Population',
        },
        ticks: {
          callback: function(value: any) {
            return new Intl.NumberFormat('en-US', { 
              notation: 'compact',
              compactDisplay: 'short' 
            }).format(value);
          }
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
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

  const currentYearData = data?.find(d => d.year === timeline.currentYear);
  
  return (
    <motion.div 
      className="relative w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Line ref={chartRef} data={chartData} options={options} />
      
      <div 
        className="absolute top-0 left-0 w-0.5 h-full bg-red-500 z-10 pointer-events-none" 
        style={{ 
          left: `calc(${((timeline.currentYear - 1948) / (2024 - 1948)) * 100}% + 8px)`,
          boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)'
        }} 
      />
      
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
              {timeline.currentYear} Population
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Palestine</span>
                </div>
                <p className="text-sm font-medium">
                  {new Intl.NumberFormat().format(Math.round(currentYearData.population.palestine))}
                </p>
              </div>
              <div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Israel</span>
                </div>
                <p className="text-sm font-medium">
                  {new Intl.NumberFormat().format(Math.round(currentYearData.population.israel))}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
