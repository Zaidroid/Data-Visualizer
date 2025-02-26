import React from 'react';
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

ChartJS.register(ArcElement, Title, Tooltip, Legend);

export const TerritoryChart: React.FC = () => {
  const { timeline } = useStore();
  const { data } = useHistoricalData();

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
      },
    },
  };

  return <Pie data={chartData} options={options} />;
};