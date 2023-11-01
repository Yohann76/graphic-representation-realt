import React from 'react';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

/*
This component calculates the % of the city in the portfolio
For the moment, cities must be in the constant for this to work. In the future, I'll need to create a function to automatically search by property address.
this component calculates according to the total value of the city in the portfolio.
*/

// possible solution: search by zip code
// for the moment we extract the city name after the comma :
// "S 10645 Stratman St, Detroit, MI 48224", "8065 Lost Shaker Ln, Kissimmee, FL 34747"

function PropertyPercentage({ properties }) {

  const cityValues = {};

  properties.forEach((property) => {
    const fullName = property.fullName;

    const extractCityFromFullName = (fullName) => {

      const cityMatch = fullName.match(/, (.*?),/);
      if (cityMatch && cityMatch.length >= 2) {
        return cityMatch[1];
      }
      return null;
    };

    const city = extractCityFromFullName(fullName);

    if (city) {
      if (!cityValues[city]) {
        cityValues[city] = 0;
      }
      const propertyValue = parseFloat(property.tokenPrice) * parseFloat(property.amount);
      cityValues[city] += propertyValue;
    }
  });

  const totalPortfolioValue = properties.reduce((total, property) => {
    const propertyValue = parseFloat(property.tokenPrice) * parseFloat(property.amount);
    return total + propertyValue;
  }, 0);


  const labels = Object.keys(cityValues);

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
