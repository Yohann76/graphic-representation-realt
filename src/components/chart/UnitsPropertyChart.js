import React from 'react';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function UnitsPropertyChart({ properties }) {

  let totalRentedUnits = 0;
  let totalUnits = 0;

  properties.forEach((property) => {
    if (property.totalUnits && property.rentedUnits) {
      totalUnits += parseInt(property.totalUnits, 10);
      totalRentedUnits += parseInt(property.rentedUnits, 10);
    }
  });

  const percentageRentedUnits = totalUnits > 0 ? ((totalRentedUnits / totalUnits) * 100).toFixed(2) : 0;

  const chartData = {
    labels: [
      `Unité louée: ${percentageRentedUnits}%`,
      `Unité non louée: ${(100 - percentageRentedUnits).toFixed(2)}%`,
    ],
    datasets: [
      {
        data: [percentageRentedUnits, 100 - percentageRentedUnits],
        backgroundColor: [
          '#00BFFF',
          '#1E90FF',
          '#32CD32',
          '#FF4500',
          '#800080',
          '#8B4513',
          '#FFD700',
          '#FF69B4',
          '#008080',
          '#4682B4',
          '#00FF7F',
          '#FF6347',
          '#7B68EE',
          '#D2B48C',
          '#FFA07A',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          generateLabels: function (chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              const legendLabels = data.labels.map((label, index) => {
                const backgroundColor = data.datasets[0].backgroundColor[index];
                return {
                  text: label,
                  fillStyle: backgroundColor,
                };
              });
              return legendLabels;
            }
            return [];
          },
          color: 'white',
        },
      },
      title: {
        display: false,
        text: 'Breakdown of portfolio value by location',
        fontSize: 16,
      },
    },
  };

  return (
    <div className="component-graph section">
      <h2>Breakdown of portfolio value by location</h2>
      <div className="graph" style={{ maxWidth: '600px' }}>
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default UnitsPropertyChart;
