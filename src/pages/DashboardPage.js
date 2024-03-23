import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [category, setCategory] = useState('');
  const [budget, setBudget] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
      const response = await axios.get('http://localhost:5000/budgets/categories', {
        headers: {
          Authorization: `Bearer ${token}` // Include the token in the Authorization header
        }
      });
      setCategories(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
      await axios.post('http://localhost:5000/budgets', { category, budget }, {
        headers: {
          Authorization: `Bearer ${token}` // Include the token in the Authorization header
        }
      });
      setCategory('');
      setBudget('');
      fetchCategories();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
      await axios.delete(`http://localhost:5000/budgets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}` // Include the token in the Authorization header
        }
      });
      fetchCategories();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Budget Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Category:
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
        </label>
        <label>
          Budget:
          <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} />
        </label>
        <button type="submit">Add Category</button>
      </form>
      {error && <p>Error: {error}</p>}
      <h3>Budget Categories</h3>
      <ul>
        {categories.map((item) => (
          <li key={item._id}>
            {item.category}: {item.budget}
            <button onClick={() => handleDelete(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
