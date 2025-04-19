import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ReceiptText, 
  PieChart, 
  Wallet, 
  UserCircle, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/transactions', icon: <ReceiptText size={20} />, label: 'Transactions' },
    { to: '/categories', icon: <PieChart size={20} />, label: 'Categories' },
    { to: '/budget', icon: <Wallet size={20} />, label: 'Budget' },
    { to: '/profile', icon: <UserCircle size={20} />, label: 'Profile' },
  ];

  return (
    <aside
      className={`${
        collapsed ? 'w-16' : 'w-64'
      } h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out flex flex-col shadow-sm z-10`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'px-4'}`}>
          <div className="flex-shrink-0 flex items-center">
            <div className="bg-primary rounded-lg p-1.5">
              <DollarSign size={collapsed ? 20 : 24} className="text-white" />
            </div>
            {!collapsed && (
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
                FinTrack
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 pt-4 pb-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-2 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary dark:text-primary-light'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/60'
                  } ${collapsed ? 'justify-center' : ''}`
                }
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <button
          onClick={() => logout()}
          className={`flex items-center text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut size={20} />
          {!collapsed && <span className="ml-3">Log out</span>}
        </button>
      </div>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="self-center mb-6 p-1.5 rounded-full text-gray-500 hover:text-primary hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700/60 transition-colors"
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
    </aside>
  );
};

export default Sidebar;