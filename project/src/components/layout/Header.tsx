import React from 'react';
import { Bell, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Header: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <header className="relative h-16 z-10 flex-shrink-0 flex flex-row items-center justify-between lg:justify-end px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center justify-center w-9 h-9 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <button
          className="flex items-center justify-center relative w-9 h-9 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
        </button>

        {/* User profile */}
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div className="ml-2 hidden md:block">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {user?.name}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;