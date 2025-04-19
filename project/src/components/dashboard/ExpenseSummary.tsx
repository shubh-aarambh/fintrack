import React, { useMemo } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';
import { useTransactions } from '../../context/TransactionsContext';
import { useCategories } from '../../context/CategoriesContext';

const ExpenseSummary: React.FC = () => {
  const { transactions } = useTransactions();
  const { categories } = useCategories();
  
  const expenseData = useMemo(() => {
    const expenseTransactions = transactions.filter(
      (transaction) => transaction.type === 'expense'
    );
    
    const expensesByCategory: Record<string, number> = {};
    
    expenseTransactions.forEach((transaction) => {
      const { categoryId, amount } = transaction;
      
      if (expensesByCategory[categoryId]) {
        expensesByCategory[categoryId] += amount;
      } else {
        expensesByCategory[categoryId] = amount;
      }
    });
    
    return Object.entries(expensesByCategory).map(([categoryId, value]) => {
      const category = categories.find((cat) => cat.id === categoryId);
      return {
        name: category ? category.name : 'Uncategorized',
        value,
        color: category ? category.color : '#CBD5E1',
      };
    }).sort((a, b) => b.value - a.value);
  }, [transactions, categories]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };
  
  const totalExpenses = expenseData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="card hover:shadow-md transition-shadow h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Expense Summary
        </h2>
      </div>
      
      {expenseData.length > 0 ? (
        <div className="flex flex-col h-full">
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Amount']} 
                  contentStyle={{ 
                    borderRadius: '0.375rem', 
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    padding: '8px 12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  }}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  formatter={(value) => (
                    <span className="text-xs">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Expenses: {formatCurrency(totalExpenses)}
            </p>
            
            <div className="space-y-1.5">
              {expenseData.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-xs font-medium">
                    {formatCurrency(item.value)} ({Math.round((item.value / totalExpenses) * 100)}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400">
            No expense data available
          </p>
        </div>
      )}
    </div>
  );
};

export default ExpenseSummary;