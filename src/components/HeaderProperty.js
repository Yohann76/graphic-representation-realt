import React, { useEffect, useState } from 'react';
import { formatNumberWithSpaces, formatNumberWithSpacesAndWithoutvirgul } from '../utils/numberUtils';
import { fetchPropertyList } from '../requests/realt-communitary-api';

function HeaderProperty({ properties }) {
  const [totalNumberOfProperty, setTotalNumberOfProperty] = useState(0);

  async function loadPropertyDataRealT() {
    const allPropertyData = await fetchPropertyList();

    const filteredPropertyData = allPropertyData
      .filter(realtProperty => !realtProperty.fullName.includes('OLD-'))
      .filter(realtProperty => !realtProperty.sellPropertyTo.includes('us_investors_only'));

    setTotalNumberOfProperty(filteredPropertyData.length);
  }

  useEffect(() => {
    loadPropertyDataRealT();
  }, []);

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
    if (property.fullName && !property.fullName.includes('OLD-')) {
      numberOfProperties += 1;
    }

    if (property.fullName ) {
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
        platformPercentTotal += parseFloat(property.realtPlatformPercent) * 100;
    }

    if (property.realtListingFeePercent) {
        listingFeePercentTotal += parseFloat(property.realtListingFeePercent) * 100;
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
      <div class="flex">
        <div class="content-flex">
          <p class="title">Various :</p>
          <p>Number of properties : {formatNumberWithSpacesAndWithoutvirgul(numberOfProperties)}/{formatNumberWithSpacesAndWithoutvirgul(totalNumberOfProperty)}</p>
          <p>Average age of portfolio construction : {formatNumberWithSpacesAndWithoutvirgul(roundedAverageConstructionYear)} ans</p>
          <p>Total value of tokens : {formatNumberWithSpacesAndWithoutvirgul(totalTokenValue)} $</p>
          <p>Rented Units {totalRentedUnits} / {totalUnits} ({percentageRentedUnits} %)</p>
        </div>

        <div class="content-flex">
          <p class="title">Fees :</p>
          <p>Total RealT rent charges : {formatNumberWithSpacesAndWithoutvirgul(feePerMonthTotal)} $ ({averagePlatformPercent}%)</p>
          <p>Total RealT listing costs : {formatNumberWithSpacesAndWithoutvirgul(listingFeeTotal)} $ ({averageListingFeePercent}%)</p>
        </div>

        <div class="content-flex">
          <p class="title">Rents</p>
          <p>Daily rents : {formatNumberWithSpaces(totalNetRentDay)} $</p>
          <p>Monthly rents : {formatNumberWithSpaces(totalNetRentMonth)} $</p>
          <p>Annual rent {formatNumberWithSpaces(totalNetRentYear)} $</p>
          <p>-</p>
          <p>Daily rents (with rent start date) : </p>
          <p>Monthly rents (with rent start date) : </p>
          <p>Annual rent (with rent start date) </p>
        </div>
      </div>
    </div>
  );
}

export default HeaderProperty;
