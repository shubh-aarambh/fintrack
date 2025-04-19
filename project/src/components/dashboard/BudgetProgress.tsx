import React from 'react';
import { useTransactions } from '../../context/TransactionsContext';
import { useCategories } from '../../context/CategoriesContext';
import { AlertTriangle } from 'lucide-react';

const BudgetProgress: React.FC = () => {
  const { transactions } = useTransactions();
  const { categories, budgets } = useCategories();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Calculate budget progress for all budgets
  const budgetProgress = budgets.map((budget) => {
    const category = categories.find((c) => c.id === budget.categoryId);
    
    if (!category) return null;
    
    // Calculate expenses for this category in current month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const categoryExpenses = transactions
      .filter((t) => {
        const transactionDate = new Date(t.date);
        return (
          t.type === 'expense' &&
          t.categoryId === category.id &&
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);
    
    const percentUsed = (categoryExpenses / budget.amount) * 100;
    
    return {
      id: budget.id,
      categoryId: budget.categoryId,
      categoryName: category.name,
      budgetAmount: budget.amount,
      spent: categoryExpenses,
      percentUsed: Math.min(percentUsed, 100),
      isOverBudget: categoryExpenses > budget.amount,
      isNearLimit: percentUsed >= 80 && percentUsed < 100,
    };
  }).filter(Boolean);
  
  return (
    <div className="card hover:shadow-md transition-shadow h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Budget Progress
        </h2>
      </div>
      
      {budgetProgress.length > 0 ? (
        <div className="space-y-5">
          {budgetProgress.map((budget) => (
            <div key={budget?.id} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {budget?.categoryName}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {formatCurrency(budget?.spent || 0)} / {formatCurrency(budget?.budgetAmount || 0)}
                </div>
              </div>
              
              <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`absolute top-0 left-0 h-full rounded-full ${
                    budget?.isOverBudget 
                      ? 'bg-error' 
                      : budget?.isNearLimit 
                        ? 'bg-warning'
                        : 'bg-secondary'
                  }`}
                  style={{ width: `${budget?.percentUsed}%` }}
                ></div>
              </div>
              
              {budget?.isOverBudget && (
                <div className="flex items-center text-error text-xs">
                  <AlertTriangle size={12} className="mr-1" />
                  <span>Over budget by {formatCurrency(budget.spent - budget.budgetAmount)}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-gray-500 dark:text-gray-400">
          No budgets set. Create a budget to track your spending!
        </div>
      )}
    </div>
  );
};

export default BudgetProgress;