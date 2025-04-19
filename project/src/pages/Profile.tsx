import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Moon, Sun, Download, Upload } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSaving(true);
    
    // Simulate API request delay
    setTimeout(() => {
      updateUser({ name });
      setIsSaving(false);
    }, 800);
  };
  
  const handleExportData = () => {
    const dataToExport = {
      user: localStorage.getItem('user'),
      transactions: localStorage.getItem('transactions'),
      categories: localStorage.getItem('categories'),
      budgets: localStorage.getItem('budgets'),
    };
    
    const dataStr = JSON.stringify(dataToExport);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileName = `fintrack_export_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
  };
  
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        
        if (importedData.user) localStorage.setItem('user', importedData.user);
        if (importedData.transactions) localStorage.setItem('transactions', importedData.transactions);
        if (importedData.categories) localStorage.setItem('categories', importedData.categories);
        if (importedData.budgets) localStorage.setItem('budgets', importedData.budgets);
        
        // Reload the page to reflect changes
        window.location.reload();
      } catch (error) {
        alert('Failed to import data. Please check the file format.');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-4">Profile Settings</h2>
            
            <form onSubmit={handleUpdateProfile}>
              <div className="space-y-4">
                {/* User Avatar */}
                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-medium">
                    {user?.name ? user.name.charAt(0) : <User size={36} />}
                  </div>
                </div>
                
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input w-full"
                    placeholder="Your name"
                    required
                  />
                </div>
                
                {/* Email (readonly) */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={user?.email || ''}
                    className="input w-full bg-gray-50 dark:bg-gray-700"
                    readOnly
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Email cannot be changed
                  </p>
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        
        {/* Preferences and Data */}
        <div className="space-y-6">
          {/* Preferences */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-4">Preferences</h2>
            
            <div className="space-y-4">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Dark Mode
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Toggle between light and dark theme
                  </p>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className="flex items-center justify-center w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 relative transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-pressed={isDarkMode}
                >
                  <span className="sr-only">Toggle dark mode</span>
                  <span
                    className={`absolute left-1 transform ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-0'
                    } transition-transform w-4 h-4 rounded-full bg-white flex items-center justify-center`}
                  >
                    {isDarkMode ? (
                      <Moon size={10} className="text-gray-800" />
                    ) : (
                      <Sun size={10} className="text-amber-500" />
                    )}
                  </span>
                </button>
              </div>
              
              {/* Currency Format - disabled for now */}
              <div className="flex items-center justify-between opacity-60">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Currency Format
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Select your preferred currency
                  </p>
                </div>
                <select
                  className="input py-1"
                  disabled
                >
                  <option value="USD">USD ($)</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Data Management */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-4">Data Management</h2>
            
            <div className="space-y-3">
              {/* Export Data */}
              <button
                onClick={handleExportData}
                className="flex items-center justify-between w-full p-3 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="text-left">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Export Data
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Download all your financial data
                  </p>
                </div>
                <Download size={18} className="text-gray-500 dark:text-gray-400" />
              </button>
              
              {/* Import Data */}
              <div className="relative">
                <input
                  type="file"
                  id="importData"
                  accept=".json"
                  onChange={handleImportData}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex items-center justify-between w-full p-3 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <div className="text-left">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Import Data
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Upload previously exported data
                    </p>
                  </div>
                  <Upload size={18} className="text-gray-500 dark:text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;