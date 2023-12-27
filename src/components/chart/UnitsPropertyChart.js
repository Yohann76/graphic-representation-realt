import React from 'react';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function UnitsPropertyChart({ properties }) {

  let totalRentedUnits = 0;
  let totalUnits = 0;

  properties.forEach((property) => {
    if (property.totalUnits && property.rentedUnits) {
      totalUnits += parseInt(property.totalUnits, 10);
      totalRentedUnits += parseInt(property.rentedUnits, 10);
    }
  });

  const percentageRentedUnits = totalUnits > 0 ? ((totalRentedUnits / totalUnits) * 100).toFixed(2) : 0;
  const percentageNotRentedUnits = (100 - percentageRentedUnits).toFixed(2);

  const chartData = {
    labels: [
      `Rented units: ${percentageRentedUnits}%`,
      `Not rented units: ${percentageNotRentedUnits}%`,
    ],
    datasets: [
      {
        data: [percentageRentedUnits, percentageNotRentedUnits],
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
                 const backgroundColor = data.datasets[0].backgroundColor[index];
                 const percentage = data.datasets[0].data[index];

                 const dotStyle = {
                   backgroundColor: backgroundColor,
                 };

                 const textStyle = {
                   color: backgroundColor,
                 };

                 const formattedPercentage = label === 'Rented units' ? `${percentage}%` : `${percentage}%`;

                 return {
                   text: `${label}: ${formattedPercentage}`,
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
         text: 'Breakdown of portfolio value by location',
         fontSize: 16,
       },
     },
   };

   const legendItems = chartData.labels.map((label, index) => {
     const backgroundColor = chartData.datasets[0].backgroundColor[index];
     const percentage = chartData.datasets[0].data[index];

     const dotStyle = {
       backgroundColor: backgroundColor,
     };

     const textStyle = {
       color: backgroundColor,
     };

     return (
       <div key={label}>
         <span className="legend-color-dot" style={dotStyle}></span>
         <span className="legend-label" style={textStyle}>
           {label}
         </span>
       </div>
     );
   });

   return (
     <div className="component-graph section">
       <h2>Breakdown of portfolio value by location</h2>
       <div className="graph-and-legend">
         <div className="graph">
           <Pie data={chartData} options={chartOptions} />
         </div>
         <div className="legend">
           {legendItems}
         </div>
       </div>
     </div>
   );

}

export default UnitsPropertyChart;
