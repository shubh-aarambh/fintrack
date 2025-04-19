import React, { useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useTransactions } from '../../context/TransactionsContext';
import { Transaction } from '../../types';

const MonthlyTrend: React.FC = () => {
  const { transactions } = useTransactions();
  
  const monthlyData = useMemo(() => {
    const last6Months = getLastMonths(6);
    
    const monthlyTotals = last6Months.map((month) => {
      const incomeTotal = getSumForMonth(
        transactions, 
        month.month, 
        month.year, 
        'income'
      );
      
      const expenseTotal = getSumForMonth(
        transactions, 
        month.month, 
        month.year, 
        'expense'
      );
      
      return {
        name: month.label,
        income: incomeTotal,
        expenses: expenseTotal,
        balance: incomeTotal - expenseTotal,
      };
    });
    
    return monthlyTotals;
  }, [transactions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Monthly Trend
        </h2>
      </div>
      
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={monthlyData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00C853" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#00C853" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F44336" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#F44336" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              stroke="#9CA3AF"
            />
            <YAxis 
              tickFormatter={(value) => `$${value}`}
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), '']}
              contentStyle={{ 
                borderRadius: '0.375rem', 
                border: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                padding: '8px 12px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              }}
            />
            <Area 
              type="monotone" 
              dataKey="income" 
              name="Income"
              stroke="#00C853" 
              fillOpacity={1} 
              fill="url(#colorIncome)" 
            />
            <Area 
              type="monotone" 
              dataKey="expenses" 
              name="Expenses"
              stroke="#F44336" 
              fillOpacity={1} 
              fill="url(#colorExpenses)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Helper functions
function getLastMonths(count: number) {
  const months = [];
  const today = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push({
      month: month.getMonth(),
      year: month.getFullYear(),
      label: month.toLocaleString('default', { month: 'short' }),
    });
  }
  
  return months;
}

function getSumForMonth(
  transactions: Transaction[], 
  month: number, 
  year: number, 
  type: 'income' | 'expense'
) {
  return transactions
    .filter((t) => {
      const date = new Date(t.date);
      return (
        t.type === type &&
        date.getMonth() === month &&
        date.getFullYear() === year
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);
}

export default MonthlyTrend;