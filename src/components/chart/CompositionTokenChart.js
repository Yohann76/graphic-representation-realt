import React from 'react';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function CompositionTokenChart({ properties }) {

  // use this data property.xxxx


// property.underlyingAssetPrice (from api)
// property.miscellaneousCosts (from api)
// property.realtListingFee (from api)
// property.renovationReserve (from api)
// property.initialMaintenanceReserve (from api)
// property.totalInvestment (from api)

// soustract totalInvestment for determine "Administrative Fees & Rounding Difference" (calcul)

  return (
    <div className="component-graph section">
      <h2>Répartition de la valeur de votre wallet</h2>
        <div class="graph" style={{ maxWidth: '600px' }}>

        </div>
    </div>
  );
}

export default CompositionTokenChart;
