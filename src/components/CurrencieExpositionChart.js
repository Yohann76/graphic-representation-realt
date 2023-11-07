import React from 'react';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

/*
this component calculates the % of exposure to a currency in relation to the total value of the portfolio. The data comes from realt's community api.
*/

function CurrencieExposition({ properties }) {
  const currencyExposure = {};

  // Iterate through each property in the list of properties
  properties.forEach((property) => {
    const currency = property.currency;

    // Check if the currency already exists in the currencyExposure object, if not, initialize it to zero
    if (!currencyExposure[currency]) {
      currencyExposure[currency] = 0;
    }

    // Calculate the value of the property by multiplying the token price by the amount
    const propertyValue = parseFloat(property.tokenPrice) * parseFloat(property.amount);

    // Add the property value to the exposure of the corresponding currency
    currencyExposure[currency] += propertyValue;
  });

  // Calculate the total portfolio value
  const totalPortfolioValue = properties.reduce((total, property) => {
    const propertyValue = parseFloat(property.tokenPrice) * parseFloat(property.amount);
    return total + propertyValue;
  }, 0);

  const labels = Object.keys(currencyExposure);
  const data = labels.map((currency) =>
    ((currencyExposure[currency] / totalPortfolioValue) * 100).toFixed(2)
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
        backgroundColor: ['#FF5733', '#FFC300', '#C70039', '#900C3F', '#581845'],
      },
    ],
  };

  return (
    <div className="component-section">
    <h2>Exposition de la monnaie sur la totalité du portefeuille :</h2>
    <div class="component-data">
        <div class="data-container">
          <ul>
            {Object.keys(currencyExposure).map((currency) => (
              <li key={currency}>
                {currency}: {((currencyExposure[currency] / totalPortfolioValue) * 100).toFixed(2)}%
              </li>
            ))}
          </ul>
        </div>
      <div class="data-graph" style={{ maxWidth: '600px' }}>
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
    </div>
  );
}

export default CurrencieExposition;
