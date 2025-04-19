import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Category, TransactionType, Budget } from '../types';
import { useAuth } from './AuthContext';

interface CategoriesContextType {
  categories: Category[];
  budgets: Budget[];
  isLoading: boolean;
  addCategory: (category: Omit<Category, 'id' | 'userId'>) => void;
  updateCategory: (id: string, category: Partial<Omit<Category, 'id' | 'userId'>>) => void;
  deleteCategory: (id: string) => void;
  getCategoryById: (id: string) => Category | undefined;
  getCategoriesByType: (type: TransactionType) => Category[];
  addBudget: (budget: Omit<Budget, 'id' | 'userId'>) => void;
  updateBudget: (id: string, budget: Partial<Omit<Budget, 'id' | 'userId'>>) => void;
  deleteBudget: (id: string) => void;
  getBudgetByCategoryId: (categoryId: string) => Budget | undefined;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load categories from localStorage on mount and when user changes
  useEffect(() => {
    if (!user) {
      setCategories([]);
      setBudgets([]);
      setIsLoading(false);
      return;
    }

    const loadCategories = () => {
      const storedCategories = localStorage.getItem('categories');
      if (storedCategories) {
        try {
          const parsedCategories: Category[] = JSON.parse(storedCategories);
          // Filter categories for current user
          const userCategories = parsedCategories.filter(
            (category) => category.userId === user.id
          );
          setCategories(userCategories);
        } catch (error) {
          console.error('Failed to parse stored categories:', error);
          setCategories([]);
        }
      }

      const storedBudgets = localStorage.getItem('budgets');
      if (storedBudgets) {
        try {
          const parsedBudgets: Budget[] = JSON.parse(storedBudgets);
          // Filter budgets for current user
          const userBudgets = parsedBudgets.filter(
            (budget) => budget.userId === user.id
          );
          setBudgets(userBudgets);
        } catch (error) {
          console.error('Failed to parse stored budgets:', error);
          setBudgets([]);
        }
      }

      setIsLoading(false);
    };

    loadCategories();

    // Set up default categories if none exist
    setTimeout(() => {
      if (categories.length === 0) {
        const storedCategories = localStorage.getItem('categories');
        const allCategories: Category[] = storedCategories 
          ? JSON.parse(storedCategories) 
          : [];
        
        if (!allCategories.some(c => c.userId === user.id)) {
          addDefaultCategories();
        }
      }
    }, 500);
  }, [user]);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      const storedCategories = localStorage.getItem('categories');
      const allCategories: Category[] = storedCategories 
        ? JSON.parse(storedCategories) 
        : [];
      
      // Remove all categories for current user and add updated ones
      const otherUsersCategories = user
        ? allCategories.filter((category) => category.userId !== user.id)
        : allCategories;
      
      const updatedCategories = [...otherUsersCategories, ...categories];
      localStorage.setItem('categories', JSON.stringify(updatedCategories));
    }
  }, [categories, isLoading, user]);

  // Save budgets to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      const storedBudgets = localStorage.getItem('budgets');
      const allBudgets: Budget[] = storedBudgets 
        ? JSON.parse(storedBudgets) 
        : [];
      
      // Remove all budgets for current user and add updated ones
      const otherUsersBudgets = user
        ? allBudgets.filter((budget) => budget.userId !== user.id)
        : allBudgets;
      
      const updatedBudgets = [...otherUsersBudgets, ...budgets];
      localStorage.setItem('budgets', JSON.stringify(updatedBudgets));
    }
  }, [budgets, isLoading, user]);

  const addDefaultCategories = () => {
    if (!user) return;
    
    const defaultCategories: Omit<Category, 'id' | 'userId'>[] = [
      {
        name: 'Salary',
        color: '#3366FF',
        icon: 'briefcase',
        type: 'income',
      },
      {
        name: 'Investments',
        color: '#00C853',
        icon: 'trending-up',
        type: 'income',
      },
      {
        name: 'Gifts',
        color: '#7C4DFF',
        icon: 'gift',
        type: 'income',
      },
      {
        name: 'Housing',
        color: '#FF6D00',
        icon: 'home',
        type: 'expense',
      },
      {
        name: 'Transportation',
        color: '#2962FF',
        icon: 'car',
        type: 'expense',
      },
      {
        name: 'Groceries',
        color: '#00BFA5',
        icon: 'shopping-cart',
        type: 'expense',
      },
      {
        name: 'Utilities',
        color: '#FFD600',
        icon: 'zap',
        type: 'expense',
      },
      {
        name: 'Entertainment',
        color: '#D500F9',
        icon: 'film',
        type: 'expense',
      },
      {
        name: 'Health',
        color: '#F50057',
        icon: 'heart',
        type: 'expense',
      },
    ];
    
    const newCategories = defaultCategories.map((category) => ({
      ...category,
      id: uuidv4(),
      userId: user.id,
    }));
    
    setCategories(newCategories);
    
    // Also add some default budgets
    const housingCategory = newCategories.find((c) => c.name === 'Housing');
    const groceriesCategory = newCategories.find((c) => c.name === 'Groceries');
    const entertainmentCategory = newCategories.find((c) => c.name === 'Entertainment');
    
    if (housingCategory && groceriesCategory && entertainmentCategory) {
      const defaultBudgets: Budget[] = [
        {
          id: uuidv4(),
          categoryId: housingCategory.id,
          amount: 1500,
          period: 'monthly',
          startDate: new Date().toISOString().split('T')[0],
          userId: user.id,
        },
        {
          id: uuidv4(),
          categoryId: groceriesCategory.id,
          amount: 400,
          period: 'monthly',
          startDate: new Date().toISOString().split('T')[0],
          userId: user.id,
        },
        {
          id: uuidv4(),
          categoryId: entertainmentCategory.id,
          amount: 200,
          period: 'monthly',
          startDate: new Date().toISOString().split('T')[0],
          userId: user.id,
        },
      ];
      
      setBudgets(defaultBudgets);
    }
  };

  const addCategory = (category: Omit<Category, 'id' | 'userId'>) => {
    if (!user) return;
    
    const newCategory: Category = {
      ...category,
      id: uuidv4(),
      userId: user.id,
    };
    
    setCategories((prevCategories) => [...prevCategories, newCategory]);
  };

  const updateCategory = (
    id: string,
    updatedFields: Partial<Omit<Category, 'id' | 'userId'>>
  ) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === id
          ? { ...category, ...updatedFields }
          : category
      )
    );
  };

  const deleteCategory = (id: string) => {
    // First delete any associated budgets
    setBudgets((prevBudgets) =>
      prevBudgets.filter((budget) => budget.categoryId !== id)
    );
    
    // Then delete the category
    setCategories((prevCategories) =>
      prevCategories.filter((category) => category.id !== id)
    );
  };

  const getCategoryById = (id: string): Category | undefined => {
    return categories.find((category) => category.id === id);
  };

  const getCategoriesByType = (type: TransactionType): Category[] => {
    return categories.filter((category) => category.type === type);
  };

  const addBudget = (budget: Omit<Budget, 'id' | 'userId'>) => {
    if (!user) return;
    
    const newBudget: Budget = {
      ...budget,
      id: uuidv4(),
      userId: user.id,
    };
    
    setBudgets((prevBudgets) => [...prevBudgets, newBudget]);
  };

  const updateBudget = (
    id: string,
    updatedFields: Partial<Omit<Budget, 'id' | 'userId'>>
  ) => {
    setBudgets((prevBudgets) =>
      prevBudgets.map((budget) =>
        budget.id === id
          ? { ...budget, ...updatedFields }
          : budget
      )
    );
  };

  const deleteBudget = (id: string) => {
    setBudgets((prevBudgets) =>
      prevBudgets.filter((budget) => budget.id !== id)
    );
  };

  const getBudgetByCategoryId = (categoryId: string): Budget | undefined => {
    return budgets.find((budget) => budget.categoryId === categoryId);
  };

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        budgets,
        isLoading,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryById,
        getCategoriesByType,
        addBudget,
        updateBudget,
        deleteBudget,
        getBudgetByCategoryId,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};