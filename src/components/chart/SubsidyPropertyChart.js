import React from 'react';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function SubsidyPropertyChart({ properties }) {

  const subsidyTotals = {};

  properties.forEach((property) => {
    const subsidyBy = property.subsidyBy || 'Non Subventionné';

    if (!subsidyTotals[subsidyBy]) {
      subsidyTotals[subsidyBy] = 0;
    }
    subsidyTotals[subsidyBy] += 1;
  });

  const labels = Object.keys(subsidyTotals);
  const data = labels.map((label) => subsidyTotals[label]);

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
          text: 'Répartition de la valeur du portefeuille par loyer subventionné',
          fontSize: 16,
        },
      },
    };

  return (
    <div className="component-graph section">
      <h2>Répartition de la valeur du portefeuille par loyer subventionné</h2>
      <div class="graph" style={{ maxWidth: '600px' }}>
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default SubsidyPropertyChart;