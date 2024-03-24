import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatedCategory, setUpdatedCategory] = useState('');
  const [updatedBudget, setUpdatedBudget] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    fetchCategories();
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = parseJwt(token);
      setUserId(decodedToken.userId);
    }
  }, []);

  const parseJwt = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/budgets/categories', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to fetch categories');
    }
  };

  const handleAddCategory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/budgets', {
        category: newCategory,
        budget: newBudget,
        userId: userId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCategories([...categories, response.data]);
      setNewCategory('');
      setNewBudget('');
    } catch (error) {
      console.error('Error adding category:', error);
      setError('Failed to add category');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/budgets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCategories(categories.filter(category => category._id !== id));
    } catch (error) {
      setError('Failed to delete category');
    }
  };

  const handleModifyCategory = (category) => {
    setSelectedCategory(category);
    setUpdatedCategory(category.category);
    setUpdatedBudget(category.budget);
  };

  const handleUpdateCategory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/budgets/${selectedCategory._id}`, {
        category: updatedCategory,
        budget: updatedBudget,
        userId: userId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const updatedCategories = categories.map(category => {
        if (category._id === response.data._id) {
          return response.data;
        }
        return category;
      });
      setCategories(updatedCategories);
      setSelectedCategory(null);
      setUpdatedCategory('');
      setUpdatedBudget('');
    } catch (error) {
      console.error('Error updating category:', error);
      setError('Failed to update category');
    }
  };
  
  return (
    <div>
      <h1>Budget Categories</h1>
      {error && <p>Error: {error}</p>}
      <ul>
        {categories.map(category => (
          <li key={category._id}>
            {category.category}: {category.budget}
            <button onClick={() => handleDeleteCategory(category._id)}>Delete</button>
            <button onClick={() => handleModifyCategory(category)}>Modify</button>
          </li>
        ))}
      </ul>
      <h2>Add New Category</h2>
      <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Category Name" />
      <input type="number" value={newBudget} onChange={e => setNewBudget(e.target.value)} placeholder="Budget Amount" />
      <button onClick={handleAddCategory}>Add Category</button>

      {selectedCategory && (
        <div>
          <h2>Update Category</h2>
          <input type="text" value={updatedCategory} onChange={e => setUpdatedCategory(e.target.value)} placeholder="Category Name" />
          <input type="number" value={updatedBudget} onChange={e => setUpdatedBudget(e.target.value)} placeholder="Budget Amount" />
          <button onClick={handleUpdateCategory}>Update Category</button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
