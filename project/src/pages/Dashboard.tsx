import React from 'react';
import BalanceCard from '../components/dashboard/BalanceCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import ExpenseSummary from '../components/dashboard/ExpenseSummary';
import BudgetProgress from '../components/dashboard/BudgetProgress';
import MonthlyTrend from '../components/dashboard/MonthlyTrend';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Balance Card */}
        <BalanceCard />
        
        {/* Budget Progress */}
        <div className="md:col-span-2">
          <BudgetProgress />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Monthly Trend */}
        <div className="md:col-span-2">
          <MonthlyTrend />
        </div>
        
        {/* Expense Summary */}
        <ExpenseSummary />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="md:col-span-3">
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;