import React, { useEffect, useRef } from 'react';
import { Play, Pause, FastForward, Rewind } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Timeline: React.FC = () => {
  const { timeline, setCurrentYear, togglePlayback, setSpeed } = useStore();
  const animationRef = useRef<number>();

  useEffect(() => {
    if (timeline.isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [timeline.isPlaying]);

  const animate = () => {
    setCurrentYear(
      timeline.currentYear + timeline.speed >= 2024
        ? 1948
        : timeline.currentYear + timeline.speed
    );
    animationRef.current = requestAnimationFrame(animate);
  };

  return (
    <div className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold dark:text-white">Timeline Control</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSpeed(Math.max(0.5, timeline.speed - 0.5))}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Rewind className="w-5 h-5 dark:text-white" />
          </button>
          <button
            onClick={togglePlayback}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {timeline.isPlaying ? (
              <Pause className="w-5 h-5 dark:text-white" />
            ) : (
              <Play className="w-5 h-5 dark:text-white" />
            )}
          </button>
          <button
            onClick={() => setSpeed(Math.min(2, timeline.speed + 0.5))}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FastForward className="w-5 h-5 dark:text-white" />
          </button>
        </div>
      </div>
      <input
        type="range"
        min="1948"
        max="2024"
        value={timeline.currentYear}
        onChange={(e) => setCurrentYear(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
      <div className="flex justify-between mt-2">
        <span className="text-sm text-gray-600 dark:text-gray-300">1948</span>
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {timeline.currentYear}
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-300">2024</span>
      </div>
    </div>
  );
};