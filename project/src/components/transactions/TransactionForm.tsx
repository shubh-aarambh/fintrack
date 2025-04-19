import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { useCategories } from '../../context/CategoriesContext';
import { useTransactions } from '../../context/TransactionsContext';
import { TransactionType } from '../../types';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  transactionToEdit?: any;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ 
  isOpen, 
  onClose,
  transactionToEdit,
}) => {
  const { categories } = useCategories();
  const { addTransaction, updateTransaction } = useTransactions();
  
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [recurringInterval, setRecurringInterval] = useState<string>('monthly');
  
  // Reset form on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setType('expense');
        setAmount('');
        setDescription('');
        setCategoryId('');
        setDate(new Date().toISOString().split('T')[0]);
        setIsRecurring(false);
        setRecurringInterval('monthly');
      }, 300);
    }
  }, [isOpen]);
  
  // Populate form with transaction data when editing
  useEffect(() => {
    if (transactionToEdit) {
      setType(transactionToEdit.type);
      setAmount(transactionToEdit.amount.toString());
      setDescription(transactionToEdit.description);
      setCategoryId(transactionToEdit.categoryId);
      setDate(transactionToEdit.date);
      setIsRecurring(!!transactionToEdit.isRecurring);
      setRecurringInterval(transactionToEdit.recurringInterval || 'monthly');
    }
  }, [transactionToEdit]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!amount || !description || !categoryId || !date) {
      return;
    }
    
    const transactionData = {
      type,
      amount: parseFloat(amount),
      description,
      categoryId,
      date,
      ...(isRecurring && { 
        isRecurring, 
        recurringInterval: recurringInterval as 'daily' | 'weekly' | 'monthly' | 'yearly' 
      }),
    };
    
    if (transactionToEdit) {
      updateTransaction(transactionToEdit.id, transactionData);
    } else {
      addTransaction(transactionData);
    }
    
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md animate-slide-up"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {transactionToEdit ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Transaction Type
              </label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  className={`flex-1 py-2 px-3 rounded-md border ${
                    type === 'income'
                      ? 'bg-secondary text-white border-secondary'
                      : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
                  }`}
                  onClick={() => setType('income')}
                >
                  Income
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-3 rounded-md border ${
                    type === 'expense'
                      ? 'bg-error text-white border-error'
                      : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
                  }`}
                  onClick={() => setType('expense')}
                >
                  Expense
                </button>
              </div>
            </div>
            
            {/* Amount */}
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400">$</span>
                </div>
                <input
                  type="number"
                  id="amount"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input pl-7 w-full"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            
            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Description
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input w-full"
                placeholder="What was this for?"
                required
              />
            </div>
            
            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Category
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="input w-full"
                required
              >
                <option value="">Select a category</option>
                {categories
                  .filter((category) => category.type === type)
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>
            
            {/* Date */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input w-full"
                required
              />
            </div>
            
            {/* Is Recurring */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isRecurring"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="h-4 w-4 rounded text-primary focus:ring-primary border-gray-300"
              />
              <label
                htmlFor="isRecurring"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                This is a recurring transaction
              </label>
            </div>
            
            {/* Recurring Interval (only shown if isRecurring is checked) */}
            {isRecurring && (
              <div>
                <label
                  htmlFor="recurringInterval"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Repeats
                </label>
                <select
                  id="recurringInterval"
                  value={recurringInterval}
                  onChange={(e) => setRecurringInterval(e.target.value)}
                  className="input w-full"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn btn-primary"
            >
              <Plus size={18} className="mr-1" />
              {transactionToEdit ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;