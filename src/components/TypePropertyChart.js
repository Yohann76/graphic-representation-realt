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
          '#C1C2C5',
          '#A6A7AA',
          '#8B8C8F',
          '#707173',
          '#555659',
          '#3A3B3E',
          '#1F2023',
          '#D3D4D7',
          '#B8B9BC',
          '#9DA0A3',
          '#838588',
          '#686B6E',
          '#4E5053',
          '#333537',
          '#18191C',
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
