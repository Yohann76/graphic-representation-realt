import React from 'react';

function HeaderProperty({ properties }) {

  let numberOfProperties = 0;
  let totalTokenValue = 0;
  let totalConstructionYears = 0;
  let numberOfPropertiesWithConstructionYear = 0

  // fee
  let feePerMonthTotal = 0;
  let listingFeeTotal = 0;
  let platformPercentTotal = 0;
  let listingFeePercentTotal = 0;

  properties.forEach((property) => {

    if (property.fullName) {
      numberOfProperties += 1;

      const propertyValue = parseFloat(property.tokenPrice) * parseFloat(property.amount);
      totalTokenValue += propertyValue;
    }

    // verify if data is available
    if (property.constructionYear) {
      totalConstructionYears += parseInt(property.constructionYear, 10);
      numberOfPropertiesWithConstructionYear += 1;
    }

    if (property.realtPlatform) {
      feePerMonthTotal += parseFloat(property.realtPlatform);
    }

    if (property.realtListingFee) {
      listingFeeTotal += parseFloat(property.realtListingFee);
    }

    if (property.realtPlatformPercent) {
      platformPercentTotal += parseFloat(property.realtPlatformPercent);
    }

    if (property.realtListingFeePercent) {
      listingFeePercentTotal += parseFloat(property.realtListingFeePercent);
    }

  });


  const averagePlatformPercent =
    numberOfProperties > 0 ? (platformPercentTotal / numberOfProperties).toFixed(2) : 0;

  const averageListingFeePercent =
    numberOfProperties > 0 ? (listingFeePercentTotal / numberOfProperties).toFixed(2) : 0;

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
      <p>Moyenne d'âge de construction du portfeuille : {roundedAverageConstructionYear.toFixed(2)} ans</p>
      <p>Total Frais RealT sur loyer : {feePerMonthTotal.toFixed(2)} ({averagePlatformPercent}%)</p>
      <p>Total Frais RealT au listing : {listingFeeTotal.toFixed(2)} ({averageListingFeePercent}%)</p>
    </div>
  );
}

export default HeaderProperty;
