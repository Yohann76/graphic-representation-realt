import React from 'react';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function CompositionTokenChart({ properties }) {

  // use this data for create graphic

  // data 1 : property.underlyingAssetPrice (from api)
  // data 2 : property.miscellaneousCosts (from api)
  // data 3 : property.realtListingFee (from api)
  // data 4 : property.renovationReserve (from api)
  // data 5 : property.initialMaintenanceReserve (from api)

  // data 6 : "Administrative Fees & Rounding Difference" (calcul)

  // calcul : totalData = data1+data2+data3+data4+data5
  // calcul : property.totalInvestment - totalData = data 6 ("Administrative Fees & Rounding Difference")

  return (
    <div className="component-graph section">
      <h2>Répartition de la valeur de votre wallet</h2>
        <div class="graph" style={{ maxWidth: '600px' }}>

        </div>
    </div>
  );
}

export default CompositionTokenChart;
