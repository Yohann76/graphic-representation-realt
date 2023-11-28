import React from 'react';
import { formatNumberWithSpaces } from '../utils/numberUtils';

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

  // Unit counts
  let totalRentedUnits = 0;
  let totalUnits = 0;

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

    // fee
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
    // rent
    if (property.netRentDayPerToken) {
      totalNetRentDay += parseFloat(property.netRentDayPerToken) * parseFloat(property.amount);
    }

    if (property.netRentMonthPerToken) {
      totalNetRentMonth += parseFloat(property.netRentMonthPerToken) * parseFloat(property.amount);
    }

    if (property.netRentYearPerToken) {
      totalNetRentYear += parseFloat(property.netRentYearPerToken) * parseFloat(property.amount);
    }
    // unit
    if (property.rentedUnits) {
      totalRentedUnits += parseInt(property.rentedUnits, 10);
    }

    if (property.totalUnits) {
      totalUnits += parseInt(property.totalUnits, 10);
    }

  });

  const averagePlatformPercent =
    numberOfProperties > 0 ? (platformPercentTotal / numberOfProperties).toFixed(2) : 0;

  const averageListingFeePercent =
    numberOfProperties > 0 ? (listingFeePercentTotal / numberOfProperties).toFixed(2) : 0;

  // unit percentage
  const percentageRentedUnits = totalUnits > 0 ? ((totalRentedUnits / totalUnits) * 100).toFixed(2) : 0;

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
      <p>Nombre de propriétés : {formatNumberWithSpaces(numberOfProperties)}</p>
      <p>Valeur totale des tokens : {formatNumberWithSpaces(totalTokenValue)}</p>
      <p>Moyenne d'âge de construction du portfeuille : {formatNumberWithSpaces(roundedAverageConstructionYear)} ans</p>
      <p>Total Frais RealT sur loyer : {formatNumberWithSpaces(feePerMonthTotal)} ({averagePlatformPercent}%)</p>
      <p>Total Frais RealT au listing : {formatNumberWithSpaces(listingFeeTotal)} ({averageListingFeePercent}%)</p>

      <p>Total Loyers par jour : {formatNumberWithSpaces(totalNetRentDay)}</p>
      <p>Total Loyers par mois : {formatNumberWithSpaces(totalNetRentMonth)}</p>
      <p>Total Loyers par an : {formatNumberWithSpaces(totalNetRentYear)}</p>

      <p>Logements loués {totalRentedUnits} / {totalUnits} ({percentageRentedUnits} %)</p>

    </div>
  );
}

export default HeaderProperty;
