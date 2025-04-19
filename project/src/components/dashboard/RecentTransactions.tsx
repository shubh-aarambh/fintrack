import React from 'react';
import { useTransactions } from '../../context/TransactionsContext';
import { useCategories } from '../../context/CategoriesContext';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Transaction } from '../../types';

const RecentTransactions: React.FC = () => {
  const { getRecentTransactions } = useTransactions();
  const { getCategoryById } = useCategories();
  
  const recentTransactions = getRecentTransactions(5);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Recent Transactions
        </h2>
      </div>
      
      <div className="space-y-4">
        {recentTransactions.length > 0 ? (
          recentTransactions.map((transaction) => (
            <TransactionItem 
              key={transaction.id} 
              transaction={transaction} 
              getCategoryById={getCategoryById}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          ))
        ) : (
          <div className="py-6 text-center text-gray-500 dark:text-gray-400">
            No transactions yet. Add your first transaction!
          </div>
        )}
      </div>
      
      {recentTransactions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className="text-sm text-primary hover:text-primary-dark dark:hover:text-primary-light transition-colors">
            View all transactions
          </button>
        </div>
      )}
    </div>
  );
};

interface TransactionItemProps {
  transaction: Transaction;
  getCategoryById: (id: string) => any;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  getCategoryById,
  formatCurrency,
  formatDate,
}) => {
  const category = getCategoryById(transaction.categoryId);
  
  return (
    <div className="flex items-center justify-between py-2 group">
      <div className="flex items-center">
        <div 
          className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
            transaction.type === 'income' 
              ? 'bg-secondary/10 text-secondary' 
              : 'bg-error/10 text-error'
          }`}
        >
          {transaction.type === 'income' ? (
            <ArrowUp size={18} />
          ) : (
            <ArrowDown size={18} />
          )}
        </div>
        
        <div>
          <div className="font-medium text-gray-800 dark:text-gray-200">
            {transaction.description}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <span>{category?.name || 'Uncategorized'}</span>
            <span className="mx-1.5">•</span>
            <span>{formatDate(transaction.date)}</span>
          </div>
        </div>
      </div>
      
      <div className={`font-medium ${
        transaction.type === 'income' 
          ? 'text-secondary' 
          : 'text-error'
      }`}>
        {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
      </div>
    </div>
  );
};

export default RecentTransactions;