import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import axios from 'axios';


function PropertyByCountry({ properties }) {


  return (
    <div className="component-section">
    <h2>Répartition en pourcentage de maisons par pays :</h2>
    <div class="component-data">
        <div class="data-container">
          <ul>
              <li>
               exemple
              </li>
          </ul>
        </div>

      <div class="data-graph" style={{ maxWidth: '600px' }}>
            <p> chart </p>
      </div>
    </div>
    </div>
  );
}

export default PropertyByCountry;
