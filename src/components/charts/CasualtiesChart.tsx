import React from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const CasualtiesChart: React.FC = () => {
  const { timeline } = useStore();
  const { data } = useHistoricalData();

  const currentYearData = data?.find(d => d.year === timeline.currentYear);

  const chartData = {
    labels: ['Palestine', 'Israel'],
    datasets: [
      {
        label: 'Casualties',
        data: [
          currentYearData?.casualties.palestine || 0,
          currentYearData?.casualties.israel || 0,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
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
        text: `Casualties (${timeline.currentYear})`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};