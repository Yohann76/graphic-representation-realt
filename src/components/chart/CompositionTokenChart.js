import React from 'react';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function CompositionTokenChart({ properties }) {

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

  // graphics data
  const labels = ['underlyingAssetPrice', 'miscellaneousCosts', 'realtListingFee', 'renovationReserve', 'initialMaintenanceReserve', 'Administrative Fees'];
  const data = [data1, data2, data3, data4, data5, administrativeFees];

  const chartData = {
    labels: labels,
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
                  text: `${label}: ${value.toFixed(2)}`,
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
        text: 'Répartition de la valeur de votre wallet',
        fontSize: 16,
      },
    },
  };

  return (
    <div className="component-graph section">
      <h2>Répartition de la valeur de votre wallet</h2>
      <div className="graph" style={{ maxWidth: '600px' }}>
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default CompositionTokenChart;
