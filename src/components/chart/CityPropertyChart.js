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
      if (fullName) {
        const cityMatch = fullName.match(/, (.*?),/);
        if (cityMatch && cityMatch.length >= 2) {
          return cityMatch[1];
        }
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

  const chartData = {
    labels: labels.map((city) => `${city}: ${((cityValues[city] / totalPortfolioValue) * 100).toFixed(2)}%`),
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
        text: 'Breakdown of portfolio value by city',
        fontSize: 16,
      },
    },
  };

  return (
    <div className="component-graph section">
    <h2>Breakdown of portfolio value by city</h2>
      <div class="graph">
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default PropertyPercentage;
