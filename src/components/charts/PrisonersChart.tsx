import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useStore } from '../../store/useStore';
import { useHistoricalData } from '../../hooks/useHistoricalData';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const PrisonersChart: React.FC = () => {
  const { timeline } = useStore();
  const { data } = useHistoricalData();
  const chartRef = useRef<ChartJS<"bar">>(null);
  
  // Animate when currentYear changes
  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      chart.update('none');
    }
  }, [timeline.currentYear]);

  const currentYearData = data?.find(d => d.year === timeline.currentYear);

  const chartData = {
    labels: ['Palestine', 'Israel'],
    datasets: [
      {
        label: 'Prisoners',
        data: [
          currentYearData?.prisoners.palestine || 0,
          currentYearData?.prisoners.israel || 0,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
        ],
        hoverBackgroundColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
        ],
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
        text: `Prisoners (${timeline.currentYear})`,
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
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Prisoners',
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

  return (
    <motion.div 
      className="relative w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Bar ref={chartRef} data={chartData} options={options} />
      
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
              {timeline.currentYear} Prisoners
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Palestine</span>
                </div>
                <p className="text-sm font-medium">
                  {new Intl.NumberFormat().format(Math.round(currentYearData.prisoners.palestine || 0))}
                </p>
              </div>
              <div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Israel</span>
                </div>
                <p className="text-sm font-medium">
                  {new Intl.NumberFormat().format(Math.round(currentYearData.prisoners.israel || 0))}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
