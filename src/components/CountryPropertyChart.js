import React from 'react';

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
