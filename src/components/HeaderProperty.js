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
      <h2>Property information :</h2>
      <p>Number of properties : {formatNumberWithSpaces(numberOfProperties)}</p>
      <p>Total value of tokens : {formatNumberWithSpaces(totalTokenValue)}</p>
      <p>Average age of portfolio construction : {formatNumberWithSpaces(roundedAverageConstructionYear)} ans</p>
      <p>Total RealT rent charges : {formatNumberWithSpaces(feePerMonthTotal)} ({averagePlatformPercent}%)</p>
      <p>Total RealT listing costs : {formatNumberWithSpaces(listingFeeTotal)} ({averageListingFeePercent}%)</p>

      <p>Total Rents per day : {formatNumberWithSpaces(totalNetRentDay)}</p>
      <p>Total Rents per month : {formatNumberWithSpaces(totalNetRentMonth)}</p>
      <p>Total Rents per year : {formatNumberWithSpaces(totalNetRentYear)}</p>

      <p>Rented Units {totalRentedUnits} / {totalUnits} ({percentageRentedUnits} %)</p>

    </div>
  );
}

export default HeaderProperty;
