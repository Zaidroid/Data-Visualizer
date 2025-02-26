import React from 'react';
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

  const chartData = {
    labels: data?.map(d => d.year.toString()) || [],
    datasets: [
      {
        label: 'Palestine Population',
        data: data?.map(d => d.population.palestine) || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Israel Population',
        data: data?.map(d => d.population.israel) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
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
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Population',
        },
      },
    },
  };

  return (
    <div className="relative">
      <Line data={chartData} options={options} />
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none border-l-2 border-red-500 opacity-50" 
           style={{ left: `${((timeline.currentYear - 1948) / (2024 - 1948)) * 100}%` }} />
    </div>
  );
};