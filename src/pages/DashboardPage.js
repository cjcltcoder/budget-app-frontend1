import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut, Bar } from 'react-chartjs-2';
import '../Dashboard.css';
import '../Chart.css';

function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [newTag, setNewTag] = useState('');
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
    indexAxis: 'y',
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = '';
            const datasetLabel = context.dataset.label || '';
            const value = context.dataset.data[context.dataIndex];
            if (datasetLabel === 'Budget') {
              label += `${value}`;
            } else {
              const monthlyIncome = income ? income.monthlyIncome : 0;
              const percentage = ((value / monthlyIncome) * 100).toFixed(0);
              label += `${percentage}% of Income`;
            }
            return label;
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderColor: '#fff',
        borderWidth: 1,
        titleFontColor: '#fff',
        bodyFontColor: '#fff',
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

    const sortedData = categoryLabels.map((label, index) => ({
      label,
      budget: categoryBudgets[index]
    })).sort((a, b) => b.budget - a.budget);

    const sortedLabels = sortedData.map(item => item.label);
    const sortedBudgets = sortedData.map(item => item.budget);

    setBarChartData({
      labels: sortedLabels,
      datasets: [
        {
          label: 'Budget',
          data: sortedBudgets,
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(75, 192, 192, 0.2)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderWidth: 1,
        },
      ],
    });

  };

  const [stackedBarChartData, setStackedBarChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    updateStackedBarChartData();
  }, [categories]);

const updateStackedBarChartData = () => {
  if (categories.length === 0) {
    // Skip chart data if categories is not available yet
    return;
  }

  const categoryLabels = categories.map((category) => category.category);
  const categoryBudgets = categories.map((category) => category.budget);
  const categoryTags = categories.map((category) => category.tags);

  // Extract unique tags
  const uniqueTags = Array.from(new Set(categoryTags.flat()));

  // Initialize data structure for each category
  const categoryData = categoryLabels.map(() => ({
    label: '',
    data: Array(uniqueTags.length).fill(0),
    backgroundColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`,
    borderColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`,
    borderWidth: 1,
  }));

  // Populate data for each category
  categories.forEach((category, categoryIndex) => {
    categoryData[categoryIndex].label = category.category;
    category.tags.forEach((tag) => {
      const tagIndex = uniqueTags.indexOf(tag);
      // Accumulate budget amounts for each tag
      categoryData[categoryIndex].data[tagIndex] += categoryBudgets[categoryIndex];
    });
  });

  // Sum up budget amounts for the same tags
  const aggregatedData = Array(uniqueTags.length).fill(0);
  categoryData.forEach((category) => {
    category.data.forEach((budget, index) => {
      aggregatedData[index] += budget;
    });
  });

  setStackedBarChartData({
    labels: uniqueTags,
    datasets: [{
      label: 'Total Budget',
      data: aggregatedData,
      backgroundColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`,
      borderColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`,
      borderWidth: 1,
    }],
  });
};

  const fetchIncome = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/income/money`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.length > 0) {
        setIncome(response.data[0]);
      } else {
        setIncome(null);
      }
    } catch (error) {
      console.error('Error fetching income:', error);
      setError('Failed to fetch income');
    }
  };

  const handleAddIncome = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/income`,
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
      fetchIncome();
      setNewIncome('');
    } catch (error) {
      console.error('Error adding income:', error);
      setError('Failed to add income');
    }
  };

  const handleUpdateIncome = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/${income._id}`,
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
      setIncome(response.data);
      setUpdatedIncome('');
    } catch (error) {
      console.error('Error updating income:', error);
      setError('Failed to update income');
    }
  };

  const handleDeleteIncome = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/income`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIncome(null);
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
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/budgets/categories`, {
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
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/budgets`, {
        category: newCategory,
        budget: newBudget,
        userId: userId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const updatedCategories = [...categories, { ...response.data, tags: [] }];
      setCategories(updatedCategories);
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
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/budgets/${id}`, {
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
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/budgets/${selectedCategory._id}`, {
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

  const handleAddTag = async (category) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/budgets/${category._id}`,
        {
          category: category.category,
          budget: category.budget,
          userId: userId,
          newTag: newTag
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      // This updates categories state with updated budget items
      const updatedCategories = categories.map(cat => {
        if (cat._id === category._id) {
          return response.data;
        }
        return cat;
      });
      setCategories(updatedCategories);
      setNewTag('');
    } catch (error) {
      console.error('Error adding tag:', error);
      setError('Failed to add tag');
    }
  };
  
  const handleDeleteTag = async (category, tagToDelete) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/budgets/${category._id}`,
        {
          category: category.category,
          budget: category.budget,
          userId: userId,
          tagToDelete: tagToDelete
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      // Same update categories state with updated budget items
      const updatedCategories = categories.map(cat => {
        if (cat._id === category._id) {
          return response.data;
        }
        return cat;
      });
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error deleting tag:', error);
      setError('Failed to delete tag');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div>
      <div>
        <button onClick={() => window.location.href = '/profile'}>Go to Profile</button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <h1 className="title">Budget Management</h1>
      <div className="container">
        <div className="section">
          <h2>Income</h2>
          <ul>
            {income && (
              <li key={income._id}>
                Monthly Income: {income.monthlyIncome}
                <button onClick={handleDeleteIncome}>Delete</button>
              </li>
            )}
          </ul>
          <h2>Add New Income</h2>
          <input type="number" value={newIncome} onChange={e => setNewIncome(e.target.value)} placeholder="Monthly Income" />
          <button onClick={handleAddIncome}>Add Income</button>
        </div>

        <div className="section">
          <h2>Budget Categories</h2>
          <ul>
            {categories.map(category => (
              <div className="category-item" key={category._id}>
                <li>
                  {category.category}: {category.budget}
                  <button onClick={() => handleModifyCategory(category)}>Modify</button>
                  <button onClick={() => handleDeleteCategory(category._id)}>Delete</button>
                  <div>
                    Tag:{' '}
                    {category.tags.map(tag => (
                      <span key={tag}>
                        {tag} <button onClick={() => handleDeleteTag(category, tag)}>Delete Tag</button>
                      </span>
                    ))}
                    {category.tags.length === 0 && (
                      <div>
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="New Tag"
                        />
                        <button onClick={() => handleAddTag(category)}>Add Tag</button>
                      </div>
                    )}
                  </div>
                </li>
              </div>
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
      </div>

      <div className="chart-container">
        <h2 className="chart-title">Budget Categories Percentage from Income</h2>
        <div className="chart-wrapper">
          <Doughnut data={doughnutData} options={chartOptions} />
          <div className="chart-center-text">
            <span style={{ fontSize: '20px', color: income && income.monthlyIncome - categories.reduce((acc, curr) => acc + curr.budget, 0) < 0 ? 'red' : 'inherit' }}>
              {income ? `Remaining\nIncome: ${income.monthlyIncome - categories.reduce((acc, curr) => acc + curr.budget, 0)}` : 'Remaining\nIncome: 0'}
            </span>
          </div>
        </div>
      </div>

      <div className="chart-container">
  <h2 className="chart-title">Budget Categories by the Dollar</h2>
  <div className="chart-wrapper">
    <Bar data={barChartData} options={{ ...chartOptions, indexAxis: 'x' }} />
    <div className="chart-center-text">
      <span className="chart-remaining-income">
      </span>
    </div>
  </div>
</div>

         
      <div className="chart-container">
        <h2 className="chart-title">Budget Categories by Tags</h2>
        <div className="chart-wrapper">
          <Bar data={stackedBarChartData} options={chartOptions} />
          <div className="chart-center-text">
            <span className="chart-remaining-income">
          
            </span>
          </div>
        </div>
      </div>
    </div>
    
  );
}

export default Dashboard;
