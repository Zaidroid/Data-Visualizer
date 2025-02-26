import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, FastForward, Rewind, Settings } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion'; // For smooth animations

export const Timeline: React.FC = () => {
  const { timeline, setCurrentYear, togglePlayback, setSpeed } = useStore();
  const animationRef = useRef<number>();
  const [showSettings, setShowSettings] = useState(false);
  const [previewYear, setPreviewYear] = useState<number | null>(null);

  useEffect(() => {
    let lastTimestamp = 0;
    const animationStep = 1;
    
    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      
      const elapsed = timestamp - lastTimestamp;
      if (elapsed > (1000 / timeline.speed)) {
        lastTimestamp = timestamp;
        
        setCurrentYear(prevYear => {
          const nextYear = prevYear + animationStep;
          return nextYear >= 2024 ? 1948 : nextYear;
        });
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    if (timeline.isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [timeline.isPlaying, timeline.speed, setCurrentYear]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = parseInt(e.target.value);
    setPreviewYear(year);
  };

  const handleSliderRelease = () => {
    if (previewYear !== null) {
      setCurrentYear(previewYear);
      setPreviewYear(null);
    }
  };

  return (
    <motion.div 
      className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold dark:text-white">Timeline Control</h2>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSpeed(Math.max(0.5, timeline.speed - 0.5))}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            disabled={timeline.speed <= 0.5}
          >
            <Rewind className="w-5 h-5 dark:text-white" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlayback}
            className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={timeline.isPlaying ? 'pause' : 'play'}
                initial={{ opacity: 0, rotate: -30 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 30 }}
                transition={{ duration: 0.2 }}
              >
                {timeline.isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSpeed(Math.min(5, timeline.speed + 0.5))}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            disabled={timeline.speed >= 5}
          >
            <FastForward className="w-5 h-5 dark:text-white" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Settings className="w-5 h-5 dark:text-white" />
          </motion.button>
        </div>
      </div>
      
      <div className="relative mb-4">
        <input
          type="range"
          min="1948"
          max="2024"
          value={previewYear !== null ? previewYear : timeline.currentYear}
          onChange={handleSliderChange}
          onMouseUp={handleSliderRelease}
          onTouchEnd={handleSliderRelease}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        
        <div className="absolute -mt-10 top-0 transform -translate-x-1/2 px-2 py-1 bg-blue-600 text-white rounded-md"
             style={{ left: `${((previewYear !== null ? previewYear : timeline.currentYear) - 1948) / (2024 - 1948) * 100}%` }}>
          {previewYear !== null ? previewYear : timeline.currentYear}
        </div>
      </div>
      
      <div className="flex justify-between mt-2">
        <span className="text-sm text-gray-600 dark:text-gray-300">1948</span>
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          <motion.span
            key={timeline.currentYear}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Current Year: {timeline.currentYear}
          </motion.span>
          {timeline.isPlaying && (
            <span className="ml-2 text-blue-600 dark:text-blue-400">
              Speed: {timeline.speed}x
            </span>
          )}
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-300">2024</span>
      </div>
      
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden"
          >
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Animation Speed
            </h3>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={timeline.speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer dark:bg-blue-700"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">Slow</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Fast</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
