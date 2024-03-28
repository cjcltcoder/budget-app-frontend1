import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import Chart from 'chart.js/auto'; // Add this import

function MyDoughnutChart() {
  const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
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
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Add this to make the chart size responsive
    width: '90%', // Set the width to 50% of its container
    height: '90%', // Set the height to 50% of its container
  };

  return (
    <div style={{ width: '50%', margin: 'auto' }}> {/* Center the chart */}
      <h2>Doughnut Chart Example</h2>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}> {/* Container for the chart */}
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}

export default MyDoughnutChart;
