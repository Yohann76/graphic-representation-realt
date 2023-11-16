import React from 'react';

function HeaderProperty({ properties }) {


  let numberOfProperties = 0;
  let totalTokenValue = 0;
  let totalConstructionYears = 0;
  let numberOfPropertiesWithConstructionYear = 0;

  properties.forEach((property) => {

    if (property.fullName) {
      numberOfProperties += 1;

      const propertyValue = parseFloat(property.tokenPrice) * parseFloat(property.amount);
      totalTokenValue += propertyValue;
    }

    // verify if constructionYear is available
    if (property.constructionYear) {
      totalConstructionYears += parseInt(property.constructionYear, 10);
      numberOfPropertiesWithConstructionYear += 1;
    }

  });

  // averageConstructionYear
  const averageConstructionYear =
    numberOfPropertiesWithConstructionYear > 0
      ? totalConstructionYears / numberOfPropertiesWithConstructionYear
      : 0;
      // round averageConstructionYear
  const roundedAverageConstructionYear = Math.round(averageConstructionYear);

  return (
    <div className="property-info-container">
      <h2>Informations sur les propriétés :</h2>
      <p>Nombre de propriétés : {numberOfProperties}</p>
      <p>Valeur totale des tokens : {totalTokenValue.toFixed(2)}</p>
       <p>Moyenne d'âge de construction : {roundedAverageConstructionYear.toFixed(2)} ans</p>
    </div>
  );
}

export default HeaderProperty;
