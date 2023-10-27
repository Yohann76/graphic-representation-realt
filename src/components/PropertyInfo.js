import React from 'react';

function PropertyInfo({ propertyInfo }) {
  return (
    <div className="property-info-container">
      <h2>Informations sur les propriétés :</h2>
      <table>
        <thead>
          <tr>
            <th>Nb Propriété</th>
            <th>Adresse du contrat (UUID)</th>
            <th>Nom de la propriété</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {propertyInfo.map((property, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{property.uuid}</td>
              <td>{property.fullName}</td>
              <td>{property.tokenPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PropertyInfo;
