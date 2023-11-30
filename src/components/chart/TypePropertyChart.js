import React from 'react';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function TypePropertyChart({ properties }) {

  // for detect number type
  // const filteredProperties = properties.filter((property) => [5, 7].includes(property.type));
  // console.log("property type 5, 7 et 9 :", filteredProperties); // 5/7/9 have no property

  const propertyTypes = {
    1: 'Single Family',
    2: 'Multi Family',
    3: 'Duplex',
    4: 'Condominium',
    6: 'Mixed-Use',
    8: 'Quadplex',
    9: 'Commercial',
    10: 'Holding SFR',
    11: 'Holding MFR',
  };

  const typeValues = {};

  properties.forEach((property) => {
    const propertyType = property.type;

    // If a property type has been extracted, calculate the value of the property and add it to the corresponding type
    if (propertyTypes[propertyType]) {
      if (!typeValues[propertyTypes[propertyType]]) {
        typeValues[propertyTypes[propertyType]] = 0;
      }
      const propertyValue = parseFloat(property.tokenPrice) * parseFloat(property.amount);
      typeValues[propertyTypes[propertyType]] += propertyValue;
    }
  });

  const totalPortfolioValue = properties.reduce((total, property) => {
    const propertyValue = parseFloat(property.tokenPrice) * parseFloat(property.amount);
    return total + propertyValue;
  }, 0);

  const labels = Object.keys(typeValues);
  const data = labels.map((type) =>
    ((typeValues[type] / totalPortfolioValue) * 100).toFixed(2)
  );

  const chartData = {
    labels: labels.map((type) => `${type}: ${((typeValues[type] / totalPortfolioValue) * 100).toFixed(2)}%`),
    datasets: [
      {
        data: data,
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
                const percent = `${((value / totalPortfolioValue) * 100).toFixed(2)}%`;
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
        text: 'Répartition de la valeur du portefeuille par type',
        fontSize: 16,
      },
    },
  };

  return (
    <div className="component-graph section">
      <h2>Répartition de la valeur du portefeuille par type</h2>
        <div class="graph" style={{ maxWidth: '600px' }}>
          <Pie data={chartData} options={chartOptions} />
        </div>
    </div>
  );
}

export default TypePropertyChart;
