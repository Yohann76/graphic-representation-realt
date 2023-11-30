import React from 'react';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function CompositionTokenChart({ properties }) {

  // data 1 : property.underlyingAssetPrice (from api)
  // data 2 : property.miscellaneousCosts (from api)
  // data 3 : property.realtListingFee (from api)
  // data 4 : property.renovationReserve (from api)
  // data 5 : property.initialMaintenanceReserve (from api)
  // data 6 : "Administrative Fees & Rounding Difference" (calcul)

  // calcul : totalData = data1+data2+data3+data4+data5
  // calcul : property.totalInvestment - totalData = data 6 ("Administrative Fees & Rounding Difference")

  const data1 = properties.reduce((underlyingAssetPrice, property) => {
    return underlyingAssetPrice + parseFloat(property.underlyingAssetPrice);
  }, 0);

  const data2 = properties.reduce((miscellaneousCosts, property) => {
    const cost = parseFloat(property.miscellaneousCosts);
    return isNaN(cost) ? miscellaneousCosts : miscellaneousCosts + cost;
  }, 0);

  const data3 = properties.reduce((realtListingFee, property) => {
    const fee = parseFloat(property.realtListingFee);
    return isNaN(fee) ? realtListingFee : realtListingFee + fee;
  }, 0);

  const data4 = properties.reduce((renovationReserve, property) => {
    const reserve = parseFloat(property.renovationReserve);
    return isNaN(reserve) ? renovationReserve : renovationReserve + reserve;
  }, 0);

  const data5 = properties.reduce((initialMaintenanceReserve, property) => {
    const reserve = parseFloat(property.initialMaintenanceReserve);
    return isNaN(reserve) ? initialMaintenanceReserve : initialMaintenanceReserve + reserve;
  }, 0);

  // Calcul Administrative Fees and rounding difference
  const administrativeFees = properties.reduce((totalFees, property) => {
    const totalInvestment = parseFloat(property.totalInvestment);
    const data1 = parseFloat(property.underlyingAssetPrice) || 0;
    const data2 = parseFloat(property.miscellaneousCosts) || 0;
    const data3 = parseFloat(property.realtListingFee) || 0;
    const data4 = parseFloat(property.renovationReserve) || 0;
    const data5 = parseFloat(property.initialMaintenanceReserve) || 0;

    if (isNaN(totalInvestment)) {
      return totalFees;
    }

    const totalData = data1 + data2 + data3 + data4 + data5;
    const fees = totalInvestment - totalData;

    return totalFees + fees;
  }, 0);


  const total = data1 + data2 + data3 + data4 + data5 + administrativeFees;
  const percentages = [
    (data1 / total) * 100,
    (data2 / total) * 100,
    (data3 / total) * 100,
    (data4 / total) * 100,
    (data5 / total) * 100,
    (administrativeFees / total) * 100,
  ];

  // graphics data in percentage
  const labels = [
    'Underlying Asset Price',
    'Miscellaneous Costs',
    'Realt Listing Fee',
    'Renovation Reserve',
    'Initial Maintenance Reserve',
    'Administrative Fees',
  ];

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: percentages,
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
                const value = data.datasets[0].data[index];
                const backgroundColor = data.datasets[0].backgroundColor[index];
                return {
                  text: `${label}: ${value.toFixed(2)}%`,
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
        text: 'Distributing the value of your tokens',
        fontSize: 16,
      },
    },
  };

  return (
    <div className="component-graph section">
      <h2>Distributing the value of your tokens</h2>
      <div className="graph">
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default CompositionTokenChart;
