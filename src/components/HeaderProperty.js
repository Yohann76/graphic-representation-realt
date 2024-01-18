import React, { useEffect, useState } from 'react';

import { useTranslation } from "react-i18next";

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
  let totalNetRentWeek = 0;
  let totalNetRentMonth = 0;
  let totalNetRentYear = 0;

  let totalNetRentDayWithRentStartDate = 0;
  let totalNetRentWeekWithRentStartDate = 0;
  let totalNetRentMonthWithRentStartDate = 0;
  let totalNetRentYearWithRentStartDate = 0;

  // define current date for calculate rent start date (UTC)
  const currentDateUTC = new Date().toISOString();

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

    // unit
    if (property.rentedUnits) {
      totalRentedUnits += parseInt(property.rentedUnits, 10);
    }

    if (property.totalUnits) {
      totalUnits += parseInt(property.totalUnits, 10);
    }

    // rent
    if (property.netRentDayPerToken) {
      totalNetRentDay += (parseFloat(property.netRentDayPerToken) * parseFloat(property.amount));
    }

    if (property.netRentMonthPerToken) {
      totalNetRentMonth += parseFloat(property.netRentMonthPerToken) * parseFloat(property.amount);
    }

    if (property.netRentYearPerToken) {
      totalNetRentYear += parseFloat(property.netRentYearPerToken) * parseFloat(property.amount);
    }

    // Rent witt rent start date
    if (property.rentStartDate) {
      const startDateObj = new Date(property.rentStartDate.date);
      const propertyRentStartDate = startDateObj.toISOString();

      if (propertyRentStartDate < currentDateUTC) {
        totalNetRentDayWithRentStartDate += parseFloat(property.netRentDayPerToken) * parseFloat(property.amount);
        totalNetRentMonthWithRentStartDate += parseFloat(property.netRentMonthPerToken) * parseFloat(property.amount);
        totalNetRentYearWithRentStartDate += parseFloat(property.netRentYearPerToken) * parseFloat(property.amount);
      }
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

  totalNetRentWeek = totalNetRentDay * 7;
  totalNetRentWeekWithRentStartDate = totalNetRentDayWithRentStartDate * 7;

  // calcul APY
  const apy = (totalNetRentYear / totalTokenValue) * 100;

  const { t } = useTranslation();

  return (
    <div className="header-info-container section">

      <h2>{t("header.PropertyInformation")} :</h2>
      <hr/>
      <br/>
      <br/>

      <div class="flex">
        <div class="content-flex">
          <p class="title">
          {t("header.Various")} :
          </p>
          <p>{t("header.Numberofproperties")} : {formatNumberWithSpacesAndWithoutvirgul(numberOfProperties)}/{formatNumberWithSpacesAndWithoutvirgul(totalNumberOfProperty)}</p>
          <p>{t("header.AverageAgeOfPortfolioConstruction")} : {formatNumberWithSpacesAndWithoutvirgul(roundedAverageConstructionYear)} ans</p>
          <p>{t("header.TotalValueOfTokens")} : {formatNumberWithSpacesAndWithoutvirgul(totalTokenValue)} $</p>
          <p>{t("header.RentedUnits")} {totalRentedUnits} / {totalUnits} ({percentageRentedUnits} %)</p>
          <p>Global APY : {formatNumberWithSpaces(apy)} % </p>
        </div>

        {/*
        this section must be replace to futur realt statistic page

        <div class="content-flex">
          <p class="title">{t("header.Fees")} :</p>
          <p>{t("header.TotalRealTRentCharges")} : {formatNumberWithSpacesAndWithoutvirgul(feePerMonthTotal)} $ ({averagePlatformPercent}%)</p>
          <p>{t("header.TotalRealTListingCosts")} : {formatNumberWithSpacesAndWithoutvirgul(listingFeeTotal)} $ ({averageListingFeePercent}%)</p>
        </div>
        */}

        <div class="content-flex">
          <p class="title">{t("header.Rents")}</p>
          <p>{t("header.DailyRents")} : {formatNumberWithSpaces(totalNetRentDay)} $</p>
          <p>{t("header.WeeklyRents")} : {formatNumberWithSpaces(totalNetRentWeek)} $</p>
          <p>{t("header.MonthlyRents")} : {formatNumberWithSpaces(totalNetRentMonth)} $</p>
          <p>{t("header.AnnualRents")} : {formatNumberWithSpaces(totalNetRentYear)} $</p>

          <p>-</p>
          <p>{t("header.DailyRents")} ({t("header.WithRentStartDate")}) : {formatNumberWithSpaces(totalNetRentDayWithRentStartDate)} $ </p>
          <p>{t("header.WeeklyRents")} ({t("header.WithRentStartDate")}) : {formatNumberWithSpaces(totalNetRentWeekWithRentStartDate)} $ </p>
          <p>{t("header.MonthlyRents")} ({t("header.WithRentStartDate")}) : {formatNumberWithSpaces(totalNetRentMonthWithRentStartDate)} $ </p>
          <p>{t("header.AnnualRents")} ({t("header.WithRentStartDate")}) : {formatNumberWithSpaces(totalNetRentYearWithRentStartDate)} $ </p>

        </div>
      </div>
    </div>
  );
}

export default HeaderProperty;
