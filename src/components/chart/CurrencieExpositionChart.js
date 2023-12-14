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

  const chartData = {
    labels: labels.map((item) => `${item}: ${((currencyExposure[item] / totalPortfolioValue) * 100).toFixed(2)}%`),
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
        text: 'Breakdown of portfolio value by currency',
        fontSize: 16,
      },
    },
  };

  return (
    <div className="component-graph section">
    <h2>Breakdown of portfolio value by currency</h2>
      <div class="graph">
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default CurrencieExposition;
