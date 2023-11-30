import React from 'react';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function CountryPropertyChart({ properties }) {

  const countryNames = ['France', 'Panama', 'Canada','Espagne', 'Angleterre', 'Argentine', 'Allemagne'];

  // get all state with abbreviation
  const usStates = [
    { fullName: 'Alabama', abbreviation: 'AL' },
    { fullName: 'Alaska', abbreviation: 'AK' },
    { fullName: 'Arizona', abbreviation: 'AZ' },
    { fullName: 'Arkansas', abbreviation: 'AR' },
    { fullName: 'California', abbreviation: 'CA' },
    { fullName: 'Colorado', abbreviation: 'CO' },
    { fullName: 'Connecticut', abbreviation: 'CT' },
    { fullName: 'Delaware', abbreviation: 'DE' },
    { fullName: 'Florida', abbreviation: 'FL' },
    { fullName: 'Georgia', abbreviation: 'GA' },
    { fullName: 'Hawaii', abbreviation: 'HI' },
    { fullName: 'Idaho', abbreviation: 'ID' },
    { fullName: 'Illinois', abbreviation: 'IL' },
    { fullName: 'Indiana', abbreviation: 'IN' },
    { fullName: 'Iowa', abbreviation: 'IA' },
    { fullName: 'Kansas', abbreviation: 'KS' },
    { fullName: 'Kentucky', abbreviation: 'KY' },
    { fullName: 'Louisiana', abbreviation: 'LA' },
    { fullName: 'Maine', abbreviation: 'ME' },
    { fullName: 'Maryland', abbreviation: 'MD' },
    { fullName: 'Massachusetts', abbreviation: 'MA' },
    { fullName: 'Michigan', abbreviation: 'MI' },
    { fullName: 'Minnesota', abbreviation: 'MN' },
    { fullName: 'Mississippi', abbreviation: 'MS' },
    { fullName: 'Missouri', abbreviation: 'MO' },
    { fullName: 'Montana', abbreviation: 'MT' },
    { fullName: 'Nebraska', abbreviation: 'NE' },
    { fullName: 'Nevada', abbreviation: 'NV' },
    { fullName: 'New Hampshire', abbreviation: 'NH' },
    { fullName: 'New Jersey', abbreviation: 'NJ' },
    { fullName: 'New Mexico', abbreviation: 'NM' },
    { fullName: 'New York', abbreviation: 'NY' },
    { fullName: 'North Carolina', abbreviation: 'NC' },
    { fullName: 'North Dakota', abbreviation: 'ND' },
    { fullName: 'Ohio', abbreviation: 'OH' },
    { fullName: 'Oklahoma', abbreviation: 'OK' },
    { fullName: 'Oregon', abbreviation: 'OR' },
    { fullName: 'Pennsylvania', abbreviation: 'PA' },
    { fullName: 'Rhode Island', abbreviation: 'RI' },
    { fullName: 'South Carolina', abbreviation: 'SC' },
    { fullName: 'South Dakota', abbreviation: 'SD' },
    { fullName: 'Tennessee', abbreviation: 'TN' },
    { fullName: 'Texas', abbreviation: 'TX' },
    { fullName: 'Utah', abbreviation: 'UT' },
    { fullName: 'Vermont', abbreviation: 'VT' },
    { fullName: 'Virginia', abbreviation: 'VA' },
    { fullName: 'Washington', abbreviation: 'WA' },
    { fullName: 'West Virginia', abbreviation: 'WV' },
    { fullName: 'Wisconsin', abbreviation: 'WI' },
    { fullName: 'Wyoming', abbreviation: 'WY' }
  ];

  const countryValues = {};

  // Browse properties and assign them to the corresponding country
  properties.forEach((property) => {
    const fullName = property.fullName;
    let country = null;

    // Check if the country name is in the countryNames list
    for (const countryName of countryNames) {
      if (fullName.includes(countryName)) {
        country = countryName;
        break;
      }
    }

    // If the country name was not found, search in the list of U.S. states
    if (!country) {
      for (const state of usStates) {
        if (fullName.includes(state.fullName) || fullName.includes(state.abbreviation)) {
          country = 'United States';
          break;
        }
      }
    }

    // If no country or state has been found, ignore this property
    // TODO : // If no country or state is found, do an API get
    // http://api.geonames.org/countryCodeJSON?lat=48.8588443&lng=2.2943506&username=VOTRE_NOM_UTILISATEUR
    if (!country) {
      return;
    }

    // Add the property value to the corresponding country
    if (!countryValues[country]) {
      countryValues[country] = 0;
    }

    const propertyValue = parseFloat(property.tokenPrice) * parseFloat(property.amount);
    countryValues[country] += propertyValue;
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
          text: 'Breakdown of portfolio value by country',
          fontSize: 16,
        },
      },
    };

  return (
    <div className="component-graph section">
    <h2>Breakdown of portfolio value by country</h2>
    <div className="graph">
      <Pie data={chartDataCountry} options={chartOptions} />
    </div>
    </div>
  );
}

export default CountryPropertyChart;
