import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Transaction, TransactionType } from '../types';
import { useAuth } from './AuthContext';

interface TransactionsContextType {
  transactions: Transaction[];
  isLoading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => void;
  updateTransaction: (id: string, transaction: Partial<Omit<Transaction, 'id' | 'userId'>>) => void;
  deleteTransaction: (id: string) => void;
  getTransactionsByCategory: (categoryId: string) => Transaction[];
  getTransactionsByType: (type: TransactionType) => Transaction[];
  getRecentTransactions: (limit: number) => Transaction[];
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getBalance: () => number;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
};

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load transactions from localStorage on mount and when user changes
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    const loadTransactions = () => {
      const storedTransactions = localStorage.getItem('transactions');
      if (storedTransactions) {
        try {
          const parsedTransactions: Transaction[] = JSON.parse(storedTransactions);
          // Filter transactions for current user
          const userTransactions = parsedTransactions.filter(
            (transaction) => transaction.userId === user.id
          );
          setTransactions(userTransactions);
        } catch (error) {
          console.error('Failed to parse stored transactions:', error);
          setTransactions([]);
        }
      }
      setIsLoading(false);
    };

    loadTransactions();

    // Set up demo data if no transactions exist
    setTimeout(() => {
      if (transactions.length === 0) {
        const storedTransactions = localStorage.getItem('transactions');
        const allTransactions: Transaction[] = storedTransactions 
          ? JSON.parse(storedTransactions) 
          : [];
        
        if (!allTransactions.some(t => t.userId === user.id)) {
          addDemoTransactions();
        }
      }
    }, 500);
  }, [user]);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      const storedTransactions = localStorage.getItem('transactions');
      const allTransactions: Transaction[] = storedTransactions 
        ? JSON.parse(storedTransactions) 
        : [];
      
      // Remove all transactions for current user and add updated ones
      const otherUsersTransactions = user
        ? allTransactions.filter((transaction) => transaction.userId !== user.id)
        : allTransactions;
      
      const updatedTransactions = [...otherUsersTransactions, ...transactions];
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    }
  }, [transactions, isLoading, user]);

  const addDemoTransactions = () => {
    if (!user) return;
    
    // Some demo categories are needed first
    const storedCategories = localStorage.getItem('categories');
    
    if (!storedCategories) {
      // We need to wait for the categories to be created
      return;
    }
    
    const categories = JSON.parse(storedCategories);
    const userCategories = categories.filter((c: any) => c.userId === user.id);
    
    if (userCategories.length === 0) {
      // We need to wait for the categories to be created
      return;
    }
    
    // Get a salary category and an expense category
    const salaryCategory = userCategories.find((c: any) => c.type === 'income');
    const rentCategory = userCategories.find((c: any) => c.name === 'Housing' || c.name === 'Rent');
    const groceryCategory = userCategories.find((c: any) => c.name === 'Groceries' || c.name === 'Food');
    const entertainmentCategory = userCategories.find((c: any) => c.name === 'Entertainment');
    
    if (!salaryCategory || !rentCategory || !groceryCategory || !entertainmentCategory) {
      return;
    }
    
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);
    
    const demoTransactions = [
      {
        amount: 3500,
        type: 'income' as TransactionType,
        categoryId: salaryCategory.id,
        date: formatDate(today),
        description: 'Monthly Salary',
        isRecurring: true,
        recurringInterval: 'monthly' as const,
        userId: user.id,
        createdAt: today.toISOString(),
        id: uuidv4(),
      },
      {
        amount: 3500,
        type: 'income' as TransactionType,
        categoryId: salaryCategory.id,
        date: formatDate(lastMonth),
        description: 'Monthly Salary',
        isRecurring: true,
        recurringInterval: 'monthly' as const,
        userId: user.id,
        createdAt: lastMonth.toISOString(),
        id: uuidv4(),
      },
      {
        amount: 1200,
        type: 'expense' as TransactionType,
        categoryId: rentCategory.id,
        date: formatDate(today),
        description: 'Monthly Rent',
        isRecurring: true,
        recurringInterval: 'monthly' as const,
        userId: user.id,
        createdAt: today.toISOString(),
        id: uuidv4(),
      },
      {
        amount: 1200,
        type: 'expense' as TransactionType,
        categoryId: rentCategory.id,
        date: formatDate(lastMonth),
        description: 'Monthly Rent',
        isRecurring: true,
        recurringInterval: 'monthly' as const,
        userId: user.id,
        createdAt: lastMonth.toISOString(),
        id: uuidv4(),
      },
      {
        amount: 250,
        type: 'expense' as TransactionType,
        categoryId: groceryCategory.id,
        date: formatDate(today),
        description: 'Weekly Groceries',
        userId: user.id,
        createdAt: today.toISOString(),
        id: uuidv4(),
      },
      {
        amount: 180,
        type: 'expense' as TransactionType,
        categoryId: groceryCategory.id,
        date: formatDate(lastMonth),
        description: 'Weekly Groceries',
        userId: user.id,
        createdAt: lastMonth.toISOString(),
        id: uuidv4(),
      },
      {
        amount: 85,
        type: 'expense' as TransactionType,
        categoryId: entertainmentCategory.id,
        date: formatDate(today),
        description: 'Movie Night',
        userId: user.id,
        createdAt: today.toISOString(),
        id: uuidv4(),
      },
    ];
    
    setTransactions(demoTransactions);
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    
    const newTransaction: Transaction = {
      ...transaction,
      id: uuidv4(),
      userId: user.id,
      createdAt: new Date().toISOString(),
    };
    
    setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
  };

  const updateTransaction = (
    id: string,
    updatedFields: Partial<Omit<Transaction, 'id' | 'userId'>>
  ) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === id
          ? { ...transaction, ...updatedFields }
          : transaction
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prevTransactions) =>
      prevTransactions.filter((transaction) => transaction.id !== id)
    );
  };

  const getTransactionsByCategory = (categoryId: string): Transaction[] => {
    return transactions.filter((transaction) => transaction.categoryId === categoryId);
  };

  const getTransactionsByType = (type: TransactionType): Transaction[] => {
    return transactions.filter((transaction) => transaction.type === type);
  };

  const getRecentTransactions = (limit: number): Transaction[] => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  const getTotalIncome = (): number => {
    return transactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const getTotalExpenses = (): number => {
    return transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const getBalance = (): number => {
    return getTotalIncome() - getTotalExpenses();
  };

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        isLoading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getTransactionsByCategory,
        getTransactionsByType,
        getRecentTransactions,
        getTotalIncome,
        getTotalExpenses,
        getBalance,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};