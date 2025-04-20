import React, { useState } from 'react';
import { Plus, Edit, Trash2, Filter } from 'lucide-react';
import { useCategories } from '../context/CategoriesContext';
import { useTransactions } from '../context/TransactionsContext';
import { Category, TransactionType } from '../types';

const Categories: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const { getTransactionsByCategory } = useTransactions();

  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [color, setColor] = useState('#3366FF');
  const [icon, setIcon] = useState('');

  const filteredCategories = categories.filter((category) =>
    filterType === 'all' || category.type === filterType
  );

  const resetForm = () => {
    setName('');
    setType('expense');
    setColor('#3366FF');
    setIcon('');
    setCategoryToEdit(null);
  };

  const handleAddCategory = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setCategoryToEdit(category);
    setName(category.name);
    setType(category.type);
    setColor(category.color);
    setIcon(category.icon);
    setIsFormOpen(true);
  };

  const handleDelete = (categoryId: string) => {
    const transactions = getTransactionsByCategory(categoryId);
    if (transactions.length > 0) {
      alert(`This category has ${transactions.length} transactions. Delete them first or reassign.`);
      return;
    }

    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(categoryId);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !icon) return;

    const payload = { name, type, color, icon };
    categoryToEdit ? updateCategory(categoryToEdit.id, payload) : addCategory(payload);

    resetForm();
    setIsFormOpen(false);
  };

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

  const INRbtn = {
    padding: '10px 16px',
    backgroundColor: '#2563EB',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    fontWeight: 500,
  };

  const INRcontainer = {
    padding: '1.5rem',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    backgroundColor: '#fff',
    marginBottom: '2rem',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
  };

  const INRinput = {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    width: '100%',
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600 }}>Categories</h1>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Filter size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as TransactionType | 'all')}
              style={{
                ...INRinput,
                paddingLeft: '32px',
              }}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <button style={INRbtn} onClick={handleAddCategory}>
            <Plus size={18} style={{ marginRight: '6px' }} />
            Add Category
          </button>
        </div>
      </div>

      {filteredCategories.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {filteredCategories.map((category) => (
            <div key={category.id} style={INRcontainer}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: '12px',
                      backgroundColor: `${category.color}20`,
                      color: category.color,
                      fontSize: '18px',
                    }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 500 }}>{category.name}</h3>
                    <span
                      style={{
                        fontSize: '12px',
                        color: category.type === 'income' ? '#059669' : '#dc2626',
                        textTransform: 'capitalize',
                      }}
                    >
                      {category.type}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEdit(category)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4B5563' }}>
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(category.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', ...INRcontainer }}>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            {filterType !== 'all' ? `No ${filterType} categories found` : 'No categories yet'}
          </p>
          <button style={INRbtn} onClick={handleAddCategory}>
            <Plus size={18} style={{ marginRight: '6px' }} />
            Add your first category
          </button>
        </div>
      )}

      {/* Modal */}
      {isFormOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '1.5rem',
            width: '100%',
            maxWidth: '500px',
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '1rem' }}>
              {categoryToEdit ? 'Edit Category' : 'Add Category'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label>Category Type</label><br />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button type="button"
                      onClick={() => setType('income')}
                      style={{
                        ...INRbtn,
                        backgroundColor: type === 'income' ? '#059669' : '#f3f4f6',
                        color: type === 'income' ? '#fff' : '#374151'
                      }}
                    >Income</button>
                    <button type="button"
                      onClick={() => setType('expense')}
                      style={{
                        ...INRbtn,
                        backgroundColor: type === 'expense' ? '#dc2626' : '#f3f4f6',
                        color: type === 'expense' ? '#fff' : '#374151'
                      }}
                    >Expense</button>
                  </div>
                </div>

                <div>
                  <label>Name</label>
                  <input
                    style={INRinput}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Category name"
                    required
                  />
                </div>

                <div>
                  <label>Icon</label>
                  <select
                    style={INRinput}
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    required
                  >
                    <option value="">Select an icon</option>
                    {iconOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Color</label><br />
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    style={{
                      width: '100%',
                      height: '40px',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => { setIsFormOpen(false); resetForm(); }} style={{ ...INRbtn, backgroundColor: '#f3f4f6', color: '#374151' }}>Cancel</button>
                  <button type="submit" style={INRbtn}>
                    {categoryToEdit ? 'Update' : 'Add'} Category
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
