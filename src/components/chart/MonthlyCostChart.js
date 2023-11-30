import React from 'react';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function MonthlyCostChart({ properties }) {

  const data1 = properties.reduce((propertyManagement, property) => {
    return propertyManagement + parseFloat(property.propertyManagement);
  }, 0);

  const data2 = properties.reduce((realtPlatform, property) => {
    return realtPlatform + parseFloat(property.realtPlatform);
  }, 0);

  const data3 = properties.reduce((propertyMaintenanceMonthly, property) => {
    return propertyMaintenanceMonthly + parseFloat(property.propertyMaintenanceMonthly);
  }, 0);

  const data4 = properties.reduce((propertyTaxes, property) => {
    return propertyTaxes + parseFloat(property.propertyTaxes);
  }, 0);

  const data5 = properties.reduce((insurance, property) => {
    return insurance + parseFloat(property.insurance);
  }, 0);

  const data6 = properties.reduce((utilities, property) => {
    // Assumes "tenant-paid" means zero cost for utilities
    return property.utilities === 'Tenant-paid' ? utilities : utilities + parseFloat(property.utilities);
  }, 0);

  // calcul total
  const total = data1 + data2 + data3 + data4 + data5 + data6;

  // calcul percentage
  const percentages = [
    (data1 / total) * 100,
    (data2 / total) * 100,
    (data3 / total) * 100,
    (data4 / total) * 100,
    (data5 / total) * 100,
    (data6 / total) * 100,
  ];

  const labels = [
    'Property Management',
    'Realt Platform',
    'Property MaintenanceMonthly',
    'Property Taxes',
    'Insurance',
    'Utilities',
  ];

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: percentages,
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
                const value = data.datasets[0].data[index];
                const backgroundColor = data.datasets[0].backgroundColor[index];
                return {
                  text: `${label}: ${value.toFixed(2)}%`,
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
        text: 'Répartition des charges sur le loyer',
        fontSize: 16,
      },
    },
  };

  return (
    <div className="component-graph section">
      <h2>Répartition des charges sur le loyer</h2>
      <div className="graph" style={{ maxWidth: '600px' }}>
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default MonthlyCostChart;
