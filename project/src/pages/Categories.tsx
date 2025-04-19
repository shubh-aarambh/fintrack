import React, { useState } from 'react';
import { Plus, Edit, Trash2, Filter, AlertCircle } from 'lucide-react';
import { useCategories } from '../context/CategoriesContext';
import { useTransactions } from '../context/TransactionsContext';
import { Category, TransactionType } from '../types';

const Categories: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const { getTransactionsByCategory } = useTransactions();
  
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [color, setColor] = useState('#3366FF');
  const [icon, setIcon] = useState('');
  
  // Filter categories
  const filteredCategories = categories.filter((category) => 
    filterType === 'all' || category.type === filterType
  );
  
  // Reset form
  const resetForm = () => {
    setName('');
    setType('expense');
    setColor('#3366FF');
    setIcon('');
    setCategoryToEdit(null);
  };
  
  // Handle form open
  const handleAddCategory = () => {
    resetForm();
    setIsFormOpen(true);
  };
  
  // Handle edit
  const handleEdit = (category: Category) => {
    setCategoryToEdit(category);
    setName(category.name);
    setType(category.type);
    setColor(category.color);
    setIcon(category.icon);
    setIsFormOpen(true);
  };
  
  // Handle delete
  const handleDelete = (categoryId: string) => {
    const transactions = getTransactionsByCategory(categoryId);
    
    if (transactions.length > 0) {
      alert(`This category has ${transactions.length} transactions. Delete them first or reassign them to another category.`);
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(categoryId);
    }
  };
  
  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !icon) {
      return;
    }
    
    if (categoryToEdit) {
      updateCategory(categoryToEdit.id, {
        name,
        type,
        color,
        icon,
      });
    } else {
      addCategory({
        name,
        type,
        color,
        icon,
      });
    }
    
    resetForm();
    setIsFormOpen(false);
  };

  // Sample icons for the dropdown
  const iconOptions = [
    { value: 'home', label: 'Home' },
    { value: 'shopping-cart', label: 'Shopping' },
    { value: 'utensils', label: 'Food' },
    { value: 'car', label: 'Transport' },
    { value: 'briefcase', label: 'Work' },
    { value: 'heart', label: 'Health' },
    { value: 'film', label: 'Entertainment' },
    { value: 'gift', label: 'Gift' },
    { value: 'coffee', label: 'Coffee' },
    { value: 'dollar-sign', label: 'Money' },
    { value: 'credit-card', label: 'Credit Card' },
    { value: 'zap', label: 'Utilities' },
    { value: 'book', label: 'Education' },
    { value: 'globe', label: 'Travel' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Categories</h1>
        
        <div className="flex space-x-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={16} className="text-gray-400" />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as TransactionType | 'all')}
              className="input pl-9 pr-8 py-2"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          
          <button
            onClick={handleAddCategory}
            className="btn btn-primary"
          >
            <Plus size={18} className="mr-1" />
            Add Category
          </button>
        </div>
      </div>
      
      {/* Categories grid */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <div 
              key={category.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
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
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <span className={`capitalize ${
                        category.type === 'income' ? 'text-secondary' : 'text-error'
                      }`}>
                        {category.type}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-1 text-gray-500 hover:text-primary transition-colors"
                    aria-label="Edit category"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-1 text-gray-500 hover:text-error transition-colors"
                    aria-label="Delete category"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {filterType !== 'all'
              ? `No ${filterType} categories found`
              : 'No categories yet'}
          </p>
          <button
            onClick={handleAddCategory}
            className="btn btn-primary"
          >
            <Plus size={18} className="mr-1" />
            Add your first category
          </button>
        </div>
      )}
      
      {/* Category Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md animate-slide-up"
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {categoryToEdit ? 'Edit Category' : 'Add Category'}
              </h2>
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <span className="sr-only">Close</span>
                <Trash2 size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4">
              <div className="space-y-4">
                {/* Category Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category Type
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
                
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input w-full"
                    placeholder="Category name"
                    required
                  />
                </div>
                
                {/* Icon */}
                <div>
                  <label
                    htmlFor="icon"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Icon
                  </label>
                  <select
                    id="icon"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="input w-full"
                    required
                  >
                    <option value="">Select an icon</option>
                    {iconOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Color */}
                <div>
                  <label
                    htmlFor="color"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Color
                  </label>
                  <input
                    type="color"
                    id="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-10 w-full rounded-md border border-gray-300 p-1 dark:border-gray-700"
                  />
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
                >
                  {categoryToEdit ? 'Update' : 'Add'} Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;