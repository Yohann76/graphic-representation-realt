import React from 'react';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

/*
This component calculates the % of the city in the portfolio
For the moment, cities must be in the constant for this to work. In the future, I'll need to create a function to automatically search by property address.
this component calculates according to the total value of the city in the portfolio.
*/

function PropertyPercentage({ properties }) {
  const cities = ['Detroit', 'Montgomery', 'Chicago', 'Cleveland', 'Los Santos', 'Covington', 'Toledo', 'Rochester', 'Highland Park'];

  const cityValues = cities.reduce((values, city) => {
    values[city] = 0;
    return values;
  }, {});

  properties.forEach((property) => {
    const fullName = property.fullName.toLowerCase();
    cities.forEach((city) => {
      if (fullName.includes(city.toLowerCase())) {
        const propertyValue = parseFloat(property.tokenPrice) * parseFloat(property.amount);
        cityValues[city] += propertyValue;
      }
    });
  });

  const totalPortfolioValue = properties.reduce((total, property) => {
    const propertyValue = parseFloat(property.tokenPrice) * parseFloat(property.amount);
    return total + propertyValue;
  }, 0);

  const labels = cities;
  const data = labels.map((city) =>
    ((cityValues[city] / totalPortfolioValue) * 100).toFixed(2)
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
        backgroundColor: ['#FF5733', '#FFC300', '#C70039', '#900C3F', '#581845', '#FF5733', '#FFC300', '#C70039', '#900C3F'],
      },
    ],
  };

  return (
    <div className="property-percentage">
      <h2>Pourcentage de la valeur du portefeuille par ville :</h2>
      <ul>
        {labels.map((city) => (
          <li key={city}>
            {city}: {((cityValues[city] / totalPortfolioValue) * 100).toFixed(2)}%
          </li>
        ))}
      </ul>
      <div style={{ maxWidth: '400px' }}>
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default PropertyPercentage;
