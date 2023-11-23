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

  // Rent
  let totalNetRentDay = 0;
  let totalNetRentMonth = 0;
  let totalNetRentYear = 0;

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

    if (property.netRentDay) {
      totalNetRentDay += parseFloat(property.netRentDay);
    }

    if (property.netRentMonth) {
      totalNetRentMonth += parseFloat(property.netRentMonth);
    }

    if (property.netRentYear) {
      totalNetRentYear += parseFloat(property.netRentYear);
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
    <div className="header-info-container section">
      <h2>Informations sur les propriétés :</h2>
      <p>Nombre de propriétés : {numberOfProperties}</p>
      <p>Valeur totale des tokens : {totalTokenValue.toFixed(2)}</p>
      <p>Moyenne d'âge de construction du portfeuille : {roundedAverageConstructionYear.toFixed(2)} ans</p>
      <p>Total Frais RealT sur loyer : {feePerMonthTotal.toFixed(2)} ({averagePlatformPercent}%)</p>
      <p>Total Frais RealT au listing : {listingFeeTotal.toFixed(2)} ({averageListingFeePercent}%)</p>

      <p>Total Loyers par jour : {totalNetRentDay.toFixed(2)}</p>
      <p>Total Loyers par mois : {totalNetRentMonth.toFixed(2)}</p>
      <p>Total Loyers par an : {totalNetRentYear.toFixed(2)}</p>

    </div>
  );
}

export default HeaderProperty;
