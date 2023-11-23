import React from 'react';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function StatePropertyChart({ properties }) {

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

  const stateValues = {};

  properties.forEach((property) => {

    const fullName = property.fullName;

    // function for extract full name
    const extractStateFromFullName = (fullName) => {
      if (fullName) {
        // First, look for a match with the full names of the states
        for (const state of usStates) {
          if (fullName.includes(state.fullName)) {
            return state.fullName;
          }
        }

        // If no full name has been found, look for a match with state abbreviations
        for (const state of usStates) {
          if (fullName.includes(state.abbreviation)) {
            return state.fullName; // Return the full name of the corresponding state abbreviation
          }
        }
      }

      return null;
    };

    // Extract fullName state
    const state = extractStateFromFullName(fullName);

    // If a state has been extracted, calculate the value of the property and add it to the corresponding state
    if (state) {
      if (!stateValues[state]) {
        stateValues[state] = 0;
      }
      const propertyValue = parseFloat(property.tokenPrice) * parseFloat(property.amount);
      stateValues[state] += propertyValue;
    }
  });

  const totalPortfolioValue = properties.reduce((total, property) => {
    const propertyValue = parseFloat(property.tokenPrice) * parseFloat(property.amount);
    return total + propertyValue;
  }, 0);

  const labels = Object.keys(stateValues);
  const data = labels.map((state) =>
    ((stateValues[state] / totalPortfolioValue) * 100).toFixed(2)
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
    <h2>Pourcentage de la valeur du portefeuille par État :</h2>
    <div class="component-data">
        <div class="data-container">
          <ul>
            {labels.map((state) => (
              <li key={state}>
                {state}: {((stateValues[state] / totalPortfolioValue) * 100).toFixed(2)}%
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

export default StatePropertyChart;
