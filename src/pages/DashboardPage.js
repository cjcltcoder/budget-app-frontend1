import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [income, setIncome] = useState(null); // New state for income
  const [newCategory, setNewCategory] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [newIncome, setNewIncome] = useState(''); // State for new income
  const [updatedIncome, setUpdatedIncome] = useState('');
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatedCategory, setUpdatedCategory] = useState('');
  const [updatedBudget, setUpdatedBudget] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchIncome();
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = parseJwt(token);
      setUserId(decodedToken.userId);
    }
  }, []);

    // Function to fetch income
    const fetchIncome = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/income/money', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.length > 0) {
          setIncome(response.data[0]); // Set income state with fetched data
        } else {
          setIncome(null); // If no income data found, set income state to null
        }
      } catch (error) {
        console.error('Error fetching income:', error);
        setError('Failed to fetch income');
      }
    };
  
    // Function to add new income
    const handleAddIncome = async () => {
      try {
        const token = localStorage.getItem('token');
        await axios.post(
          'http://localhost:5000/income',
          {
            monthlyIncome: newIncome,
            userId: userId
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        fetchIncome(); // Fetch income again after adding new income
        setNewIncome(''); // Clear the input field after adding income
      } catch (error) {
        console.error('Error adding income:', error);
        setError('Failed to add income');
      }
    };
    
    // Function to update income
    const handleUpdateIncome = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.put(
          `http://localhost:5000/income/${income._id}`, // Include the income ID in the URL
          {
            monthlyIncome: updatedIncome,
            userId: userId
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setIncome(response.data); // Set income state with updated data
        setUpdatedIncome(''); // Clear the input field after updating income
      } catch (error) {
        console.error('Error updating income:', error);
        setError('Failed to update income');
      }
    };
    
    // Function to delete income
    const handleDeleteIncome = async () => {
      try {
        const token = localStorage.getItem('token');
        await axios.delete('http://localhost:5000/income', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setIncome(null); // Set income state to null after deletion
      } catch (error) {
        console.error('Error deleting income:', error);
        setError('Failed to delete income');
      }
    };

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
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/'; // Redirect to HomePage
  };

  return (
    <div>
      <div>
        <button onClick={() => window.location.href = '/profile'}>Go to Profile</button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div>
        <h1>Income</h1>
        <ul>
          {income && (
            <li key={income._id}> 
              Monthly Income: {income.monthlyIncome} {' '}
              <button onClick={handleDeleteIncome}>Delete</button>
            </li>
          )}
        </ul>
        <h2>Add New Income</h2>
        <input type="number" value={newIncome} onChange={e => setNewIncome(e.target.value)} placeholder="Monthly Income" />
        <button onClick={handleAddIncome}>Add Income</button>
      </div>

      <h1>Budget Categories</h1>
      {error && <p>Error: {error}</p>}
      <ul>
        {categories.map(category => (
          <li key={category._id}>
            {category.category}: {category.budget} {' '}
            <button onClick={() => handleModifyCategory(category)}>Modify</button>
            <button onClick={() => handleDeleteCategory(category._id)}>Delete</button>
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
