import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useStore } from '../store/useStore';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useStore();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5 text-white" />
      )}
    </button>
  );
};