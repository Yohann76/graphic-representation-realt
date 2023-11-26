import React from 'react';

function PropertyInfo({ propertyInfo }) {

  // Calculate price per door
  propertyInfo.forEach((property) => {
    if (property.totalUnits > 1) {
      property.pricePerDoor = (property.totalInvestment / property.totalUnits).toFixed(2);
    } else {
      property.pricePerDoor = '-';
    }
  });

  // calculate price per sqft (todo later : transform sqft -> m2)

  return (
    <div className="property-info-container section">
      <h2 class="title-property-info">Informations sur les propriétés :</h2>
      <table>
        <thead>
          <tr>
            <th>Nb Propriété</th>
            <th>Adresse du contrat (UUID)</th>
            <th>Nom de la propriété</th>
            <th>prix Token</th>
            <th>Nombre de token</th>
            <th>Prix par porte</th>
            <th>Prix par sqft</th>
            <th>Valeur Totale</th>
          </tr>
        </thead>
        <tbody>
          {propertyInfo.map((property, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{property.uuid}</td>
              <td>{property.fullName}</td>
              <td>{property.tokenPrice}</td>
              <td>{property.amount}</td>
              <td>{property.pricePerDoor}</td>
              <td></td>
              <td>{property.totalValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PropertyInfo;
