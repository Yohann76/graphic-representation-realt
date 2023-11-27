import React from 'react';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function CountryPropertyChart({ properties }) {

  const extractCountryFromFullName = (fullName) => {
    const countryNames = ['United States', 'France', 'Canada', 'Panama', /* ... */];
    for (const countryName of countryNames) {
      if (fullName.includes(countryName)) {
        return countryName;
      }
    }
    return null;
  };

  const countryValues = {};

  properties.forEach((property) => {
    const fullName = property.fullName;
    const country = extractCountryFromFullName(fullName);

    if (country) {
      if (!countryValues[country]) {
        countryValues[country] = 0;
      }

      const propertyValue = parseFloat(property.tokenPrice) * parseFloat(property.amount);
      countryValues[country] += propertyValue;
    }
  });

  const totalPortfolioValue = properties.reduce((total, property) => {
    const propertyValue = parseFloat(property.tokenPrice) * parseFloat(property.amount);
    return total + propertyValue;
  }, 0);

  const countryLabels = Object.keys(countryValues);
  const countryData = countryLabels.map((country) =>
    ((countryValues[country] / totalPortfolioValue) * 100).toFixed(2)
  );

  const chartDataCountry = {
    labels: countryLabels.map((country) => `${country}: ${((countryValues[country] / totalPortfolioValue) * 100).toFixed(2)}%`),
    datasets: [
      {
        data: countryData,
        backgroundColor: [
          // Vous pouvez définir les couleurs ici pour chaque pays
          '#00BFFF',
          '#1E90FF',
          '#32CD32',
          /* ... */
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
          text: 'Répartition de la valeur du portefeuille par pays',
          fontSize: 16,
        },
      },
    };
  return (
    <div className="component-graph section">
    <h2>Répartition de la valeur du portefeuille par pays </h2>
    <div className="graph" style={{ maxWidth: '600px' }}>
      <Pie data={chartDataCountry} options={chartOptions} />
    </div>
    </div>
  );
}

export default CountryPropertyChart;
