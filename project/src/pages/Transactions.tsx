import React from 'react';
import TransactionsList from '../components/transactions/TransactionsList';

const Transactions: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Transactions</h1>
      
      <TransactionsList />
    </div>
  );
};

export default Transactions;