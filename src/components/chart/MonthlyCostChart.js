import React from 'react';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function MonthlyCostChart({ properties }) {

  // data 1 : property.propertyManagement (from api)
  // data 2 : property.realtPlatform (from api)
  // data 3 : property.propertyMaintenanceMonthly (from api)
  // data 4 : property.propertyTaxes (from api)
  // data 5 : property.insurance (from api)
  // data 6 : property.utilities if not "Tenant-paid" (from api)


  return (
    <div className="component-graph section">
      <h2>Répartition des charges sur le loyer</h2>
      <div className="graph" style={{ maxWidth: '600px' }}>
      </div>
    </div>
  );
}

export default MonthlyCostChart;
