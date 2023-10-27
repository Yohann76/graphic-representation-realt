import React from 'react';

function PropertyInfo({ propertyInfo }) {
  return (
    <div className="property-info-container">
      <h2>Informations sur les propriétés :</h2>
      <ul>
        {propertyInfo.map((property, index) => (
          <li key={index}>
            <h3>Propriété {index + 1} :</h3>
            <p>Adresse du contrat (UUID) : {property.uuid}</p>
            <p>Nom de la propriété : {property.fullName}</p>
            <p>Description : {property.tokenPrice}</p>
            {/* Ajoutez d'autres détails de la propriété ici */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PropertyInfo;
