import React, { useState } from 'react';
import { Search, Filter, Edit, Trash2, Plus } from 'lucide-react';
import { useTransactions } from '../../context/TransactionsContext';
import { useCategories } from '../../context/CategoriesContext';
import { Transaction } from '../../types';
import TransactionForm from './TransactionForm';

const TransactionsList: React.FC = () => {
  const { transactions, deleteTransaction } = useTransactions();
  const { getCategoryById } = useCategories();
  
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  
  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter((transaction) => {
      // Filter by search term
      const searchMatch = transaction.description
        .toLowerCase()
        .includes(search.toLowerCase());
      
      // Filter by type
      const typeMatch =
        filterType === 'all' ||
        transaction.type === filterType;
      
      return searchMatch && typeMatch;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Group transactions by date
  const groupedTransactions: Record<string, Transaction[]> = {};
  
  filteredTransactions.forEach((transaction) => {
    const date = transaction.date;
    if (!groupedTransactions[date]) {
      groupedTransactions[date] = [];
    }
    groupedTransactions[date].push(transaction);
  });
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };
  
  const handleEdit = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setIsFormOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };
  
  const handleAddTransaction = () => {
    setTransactionToEdit(null);
    setIsFormOpen(true);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header with filters */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter size={16} className="text-gray-400" />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="input pl-9 pr-8 py-2"
                >
                  <option value="all">All</option>
                  <option value="income">Income</option>
                  <option value="expense">Expenses</option>
                </select>
              </div>
              
              <button
                onClick={handleAddTransaction}
                className="btn btn-primary whitespace-nowrap"
              >
                <Plus size={18} className="mr-1" />
                Add
              </button>
            </div>
          </div>
        </div>
        
        {/* Transactions list */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {Object.keys(groupedTransactions).length > 0 ? (
            Object.entries(groupedTransactions)
              .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
              .map(([date, transactions]) => (
                <div key={date} className="py-2">
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/60">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {formatDate(date)}
                    </h3>
                  </div>
                  
                  <ul className="divide-y divide-gray-100 dark:divide-gray-700/70">
                    {transactions.map((transaction) => {
                      const category = getCategoryById(transaction.categoryId);
                      
                      return (
                        <li
                          key={transaction.id}
                          className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                        >
                          <div className="flex items-center">
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                              style={{ 
                                backgroundColor: category ? `${category.color}20` : '#E5E7EB',
                                color: category?.color || '#6B7280'
                              }}
                            >
                              {/* You can add a category icon here */}
                              <span className="text-lg">{category?.icon || '?'}</span>
                            </div>
                            
                            <div>
                              <div className="font-medium text-gray-800 dark:text-gray-200">
                                {transaction.description}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {category?.name || 'Uncategorized'}
                                {transaction.isRecurring && (
                                  <>
                                    <span className="mx-1.5">•</span>
                                    <span>Recurring ({transaction.recurringInterval})</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className={`font-medium ${
                              transaction.type === 'income' 
                                ? 'text-secondary' 
                                : 'text-error'
                            }`}>
                              {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleEdit(transaction)}
                                className="p-1 text-gray-500 hover:text-primary transition-colors"
                                aria-label="Edit transaction"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(transaction.id)}
                                className="p-1 text-gray-500 hover:text-error transition-colors"
                                aria-label="Delete transaction"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
          ) : (
            <div className="py-16 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {search || filterType !== 'all'
                  ? 'No transactions match your filters'
                  : 'No transactions yet'}
              </p>
              {!search && filterType === 'all' && (
                <button
                  onClick={handleAddTransaction}
                  className="btn btn-primary"
                >
                  <Plus size={18} className="mr-1" />
                  Add your first transaction
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setTransactionToEdit(null);
        }}
        transactionToEdit={transactionToEdit}
      />
    </>
  );
};

export default TransactionsList;