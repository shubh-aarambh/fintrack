import React from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useTransactions } from '../../context/TransactionsContext';

const BalanceCard: React.FC = () => {
  const { getTotalIncome, getTotalExpenses, getBalance } = useTransactions();
  
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = getBalance();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Current Balance
          </h2>
          <div className="p-2 bg-primary/10 text-primary rounded-full">
            <Wallet size={20} />
          </div>
        </div>
        
        <div className="mt-2">
          <div className="text-3xl font-semibold text-gray-900 dark:text-white">
            {formatCurrency(balance)}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex flex-col">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
              <TrendingUp size={16} className="text-secondary mr-1" />
              <span>Income</span>
            </div>
            <span className="text-lg font-medium text-secondary">
              {formatCurrency(totalIncome)}
            </span>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
              <TrendingDown size={16} className="text-error mr-1" />
              <span>Expenses</span>
            </div>
            <span className="text-lg font-medium text-error">
              {formatCurrency(totalExpenses)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;