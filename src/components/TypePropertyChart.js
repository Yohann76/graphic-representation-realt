import React from 'react';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function TypePropertyChart({ properties }) {

  const propertyTypes = {
    1: 'Single Family',
    2: 'Multi Family',
    3: 'Duplex',
    4: 'Condominium',
    6: 'Mixed-Use',
    10: 'Holding',
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

  console.log(totalPortfolioValue);

  const labels = Object.keys(typeValues);
  const data = labels.map((type) =>
    ((typeValues[type] / totalPortfolioValue) * 100).toFixed(2)
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  const chartData = {
    labels: labels,
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

  return (
    <div className="component-graph section">
      <h2>Pourcentage de la valeur du portefeuille par Type de Propriété :</h2>
      <div class="component-data">
        <div class="data-container">
          <ul>
            {labels.map((type) => (
              <li key={type}>
                {type}: {((typeValues[type] / totalPortfolioValue) * 100).toFixed(2)}%
              </li>
            ))}
          </ul>
        </div>
        <div class="data-graph" style={{ maxWidth: '400px' }}>
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default TypePropertyChart;
