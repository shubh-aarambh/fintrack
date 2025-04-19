import React, { useState } from 'react';
import { Plus, Edit, AlertTriangle, Info } from 'lucide-react';
import { useCategories } from '../context/CategoriesContext';
import { useTransactions } from '../context/TransactionsContext';
import { Budget as BudgetType } from '../types';

const Budget: React.FC = () => {
  const { categories, budgets, addBudget, updateBudget, deleteBudget } = useCategories();
  const { transactions } = useTransactions();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState<BudgetType | null>(null);
  
  // Form state
  const [categoryId, setCategoryId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Calculate budget progress
  const calculateProgress = (budget: BudgetType) => {
    // Get expenses for the category within the current period
    const now = new Date();
    
    // Determine date range based on period
    let startDate = new Date();
    if (period === 'weekly') {
      startDate.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
    } else if (period === 'monthly') {
      startDate.setDate(1); // Start of month
    } else if (period === 'yearly') {
      startDate.setMonth(0, 1); // Start of year
    }
    
    // Filter transactions by category, date range, and type (expense)
    const categoryExpenses = transactions
      .filter((t) => 
        t.categoryId === budget.categoryId && 
        t.type === 'expense' &&
        new Date(t.date) >= startDate && 
        new Date(t.date) <= now
      )
      .reduce((sum, t) => sum + t.amount, 0);
    
    const percentUsed = (categoryExpenses / budget.amount) * 100;
    
    return {
      spent: categoryExpenses,
      percentUsed: Math.min(percentUsed, 100),
      isOverBudget: categoryExpenses > budget.amount,
      isNearLimit: percentUsed >= 80 && percentUsed < 100,
    };
  };
  
  // Reset form
  const resetForm = () => {
    setCategoryId('');
    setAmount('');
    setPeriod('monthly');
    setBudgetToEdit(null);
  };
  
  // Handle form open
  const handleAddBudget = () => {
    resetForm();
    setIsFormOpen(true);
  };
  
  // Handle edit
  const handleEdit = (budget: BudgetType) => {
    setBudgetToEdit(budget);
    setCategoryId(budget.categoryId);
    setAmount(budget.amount.toString());
    setPeriod(budget.period);
    setIsFormOpen(true);
  };
  
  // Handle delete
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      deleteBudget(id);
    }
  };
  
  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryId || !amount) {
      return;
    }
    
    // Check if a budget already exists for this category
    const existingBudget = budgets.find(
      (b) => b.categoryId === categoryId && b.id !== (budgetToEdit?.id || '')
    );
    
    if (existingBudget) {
      alert('A budget already exists for this category. Edit it instead.');
      return;
    }
    
    if (budgetToEdit) {
      updateBudget(budgetToEdit.id, {
        categoryId,
        amount: parseFloat(amount),
        period,
        startDate: new Date().toISOString().split('T')[0],
      });
    } else {
      addBudget({
        categoryId,
        amount: parseFloat(amount),
        period,
        startDate: new Date().toISOString().split('T')[0],
      });
    }
    
    resetForm();
    setIsFormOpen(false);
  };
  
  // Get expense categories
  const expenseCategories = categories.filter(
    (category) => category.type === 'expense'
  );
  
  // Get categories with budgets
  const categoriesWithBudgets = new Set(budgets.map((b) => b.categoryId));
  
  // Get available categories (without budgets)
  const availableCategories = expenseCategories.filter(
    (category) => !categoriesWithBudgets.has(category.id) || category.id === categoryId
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Budget</h1>
        
        <button
          onClick={handleAddBudget}
          className="btn btn-primary"
        >
          <Plus size={18} className="mr-1" />
          Add Budget
        </button>
      </div>
      
      {budgets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((budget) => {
            const category = categories.find((c) => c.id === budget.categoryId);
            const progress = calculateProgress(budget);
            
            if (!category) return null;
            
            return (
              <div 
                key={budget.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                      style={{ 
                        backgroundColor: `${category.color}20`,
                        color: category.color
                      }}
                    >
                      <span className="text-lg">{category.icon}</span>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                        {category.name}
                      </h3>
                      <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {budget.period} budget
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleEdit(budget)}
                    className="p-1.5 text-gray-500 hover:text-primary transition-colors"
                    aria-label="Edit budget"
                  >
                    <Edit size={18} />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Budget</div>
                      <div className="text-xl font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(budget.amount)}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Spent</div>
                      <div className={`text-xl font-semibold ${
                        progress.isOverBudget 
                          ? 'text-error' 
                          : progress.isNearLimit
                            ? 'text-warning'
                            : 'text-gray-900 dark:text-white'
                      }`}>
                        {formatCurrency(progress.spent)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        {progress.percentUsed.toFixed(0)}% used
                      </div>
                      <div>
                        {progress.isOverBudget 
                          ? formatCurrency(-(budget.amount - progress.spent)) + ' over' 
                          : formatCurrency(budget.amount - progress.spent) + ' left'}
                      </div>
                    </div>
                    
                    <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`absolute top-0 left-0 h-full rounded-full ${
                          progress.isOverBudget 
                            ? 'bg-error' 
                            : progress.isNearLimit
                              ? 'bg-warning'
                              : 'bg-secondary'
                        }`}
                        style={{ width: `${progress.percentUsed}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {progress.isOverBudget && (
                    <div className="flex items-start mt-2 p-2 bg-error/10 rounded text-sm text-error">
                      <AlertTriangle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                      <span>You've exceeded your budget for {category.name}.</span>
                    </div>
                  )}
                  
                  {progress.isNearLimit && !progress.isOverBudget && (
                    <div className="flex items-start mt-2 p-2 bg-warning/10 rounded text-sm text-warning">
                      <Info size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                      <span>You're getting close to your budget limit.</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No budgets set yet. Start managing your spending by setting a budget.
          </p>
          <button
            onClick={handleAddBudget}
            className="btn btn-primary"
          >
            <Plus size={18} className="mr-1" />
            Create your first budget
          </button>
        </div>
      )}
      
      {/* Budget Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md animate-slide-up"
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {budgetToEdit ? 'Edit Budget' : 'Add Budget'}
              </h2>
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <span className="sr-only">Close</span>
                <AlertTriangle size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4">
              <div className="space-y-4">
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
                    {availableCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  
                  {availableCategories.length === 0 && (
                    <p className="mt-1 text-sm text-error">
                      All expense categories already have budgets. Edit existing budgets or create a new expense category.
                    </p>
                  )}
                </div>
                
                {/* Amount */}
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Budget Amount
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
                
                {/* Period */}
                <div>
                  <label
                    htmlFor="period"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Budget Period
                  </label>
                  <select
                    id="period"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as 'weekly' | 'monthly' | 'yearly')}
                    className="input w-full"
                    required
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    resetForm();
                  }}
                  className="flex-1 btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn btn-primary"
                  disabled={availableCategories.length === 0}
                >
                  {budgetToEdit ? 'Update' : 'Add'} Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;