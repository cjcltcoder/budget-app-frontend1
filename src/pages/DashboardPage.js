import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut, Bar } from 'react-chartjs-2';

function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [income, setIncome] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [newIncome, setNewIncome] = useState('');
  const [updatedIncome, setUpdatedIncome] = useState('');
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatedCategory, setUpdatedCategory] = useState('');
  const [updatedBudget, setUpdatedBudget] = useState('');
  const [userId, setUserId] = useState('');
  const [doughnutData, setDoughnutData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Budget',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  });

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    width: 300,
    height: 300,
    indexAxis: 'y', // Set the axis to be used as the index to 'y' for horizontal bar chart
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = '';
            const datasetLabel = context.dataset.label || '';
            const value = context.dataset.data[context.dataIndex];
            if (datasetLabel === 'Budget') {
              label += `${value}`; // Display budget value
            } else {
              const monthlyIncome = income ? income.monthlyIncome : 0;
              const percentage = ((value / monthlyIncome) * 100).toFixed(0);
              label += `${percentage}% of Income`; // Display percentage of income
            }
            return label;
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Set tooltip background color
        borderColor: '#fff', // Set tooltip border color
        borderWidth: 1, // Set tooltip border width
        titleFontColor: '#fff', // Set tooltip title font color
        bodyFontColor: '#fff', // Set tooltip body font color
      }
    },
    labels: {
      render: 'label',
      fontColor: '#000',
      position: 'outside',
      textMargin: 10,
    },
  };
  

  useEffect(() => {
    fetchCategories();
    fetchIncome();
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = parseJwt(token);
      setUserId(decodedToken.userId);
    }
  }, []);

  useEffect(() => {
    updateChartData();
  }, [income, categories]);

  const updateChartData = () => {
    const categoryLabels = categories.map((category) => category.category);
    const categoryBudgets = categories.map((category) => category.budget);

    setDoughnutData({
      labels: categoryLabels,
      datasets: [
        {
          data: categoryBudgets,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    });

    const monthlyIncome = income ? income.monthlyIncome : 0;
    const budgetPercentages = categoryBudgets.map(budget => ((budget / monthlyIncome) * 100).toFixed(0));

      // Sort categoryLabels and categoryBudgets based on budget values
      const sortedData = categoryLabels.map((label, index) => ({
        label,
        budget: categoryBudgets[index]
      })).sort((a, b) => b.budget - a.budget);

      const sortedLabels = sortedData.map(item => item.label);
      const sortedBudgets = sortedData.map(item => item.budget);

    // Modify the bar chart data to be horizontal
    setBarChartData({
      labels: sortedLabels,
      datasets: [
        {
          label: 'Budget',
          data: sortedBudgets, // Swap data with labels
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)', // Color for category 1
            'rgba(255, 99, 132, 0.2)',  // Color for category 2
            'rgba(75, 192, 192, 0.2)',  // Color for category 3
            // Add more colors as needed for additional categories
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)', // Border color for category 1
            'rgba(255, 99, 132, 1)',  // Border color for category 2
            'rgba(75, 192, 192, 1)',  // Border color for category 3
            // Add more colors as needed for additional categories
          ],
          borderWidth: 1,
        },
      ],
    });

  };

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

      {/* Doughnut Chart */}
      <div style={{ position: 'relative', height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ marginBottom: '10px' }}>Budget Distribution</h2>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Doughnut data={doughnutData} options={chartOptions} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', whiteSpace: 'pre-line' }}>
              <span style={{ fontSize: '20px', color: (income && income.monthlyIncome - categories.reduce((acc, curr) => acc + curr.budget, 0) < 0) ? 'red' : 'inherit' }}>
                {income ? `Remaining\nIncome: ${income.monthlyIncome - categories.reduce((acc, curr) => acc + curr.budget, 0)}` : 'Remaining\nIncome: 0'}
              </span>
            </div>
          </div>
      </div>

      {/* Horizontal Bar Chart */}
      <div style={{ marginTop: '20px', height: '400px', width: '80%', margin: 'auto', alignItems: 'center' }}>
        <h2>Budget Distribution (Bar Chart)</h2>
        <Bar data={barChartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default Dashboard;
