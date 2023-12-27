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


  const chartData = {
    labels: labels.map((state) => `${state}: ${((stateValues[state] / totalPortfolioValue) * 100).toFixed(2)}%`),
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
        display: false,
        position: 'right',
        labels: {
          generateLabels: function (chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              const legendLabels = data.labels.map((label, index) => {
                const value = data.datasets[0].data[index];
                const percent = ((value / totalPortfolioValue) * 100).toFixed(2) + '%';
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
        text: 'Breakdown of portfolio value by state',
        fontSize: 16,
      },
    },
  };

  const legendItems = labels.map((city, index) => {
    const backgroundColor = chartData.datasets[0].backgroundColor[index];
    const percentage = data[index];

    const dotStyle = {
      backgroundColor: backgroundColor,
    };

    const textStyle = {
      color: backgroundColor,
    };

    return (
      <div key={city}>
        <span className="legend-color-dot" style={dotStyle}></span>
        <span className="legend-label" style={textStyle}>
          {`${city}: ${percentage}%`}
        </span>
      </div>
    );
  });

  return (
    <div className="component-graph section">
    <h2>Breakdown of portfolio value by state</h2>
    <div className="graph-and-legend">
      <div class="graph">
        <Pie data={chartData} options={chartOptions} />
      </div>
      <div className="legend">{legendItems}</div>
    </div>
    </div>
  );
}

export default StatePropertyChart;
