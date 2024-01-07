import React, { useEffect, useState } from 'react';

import { useTranslation } from "react-i18next";
import i18n from "../src/utils/i18n.js";


import logo from './logo.svg';
import './App.css';

import PropertyInfo from './components/PropertyInfo';
import HeaderProperty from './components/HeaderProperty';

// chart
import CityPropertyChart from './components/chart/CityPropertyChart';
import StatePropertyChart from './components/chart/StatePropertyChart';
import CountryPropertyChart from './components/chart/CountryPropertyChart';
import CurrencieExpositionChart from './components/chart/CurrencieExpositionChart';
import TypePropertyChart from './components/chart/TypePropertyChart';
import UnitsPropertyChart from './components/chart/UnitsPropertyChart';
import SubsidyPropertyChart from './components/chart/SubsidyPropertyChart';
import CompositionTokenChart from './components/chart/CompositionTokenChart';
import MonthlyCostChart from './components/chart/MonthlyCostChart';

import { fetchPropertyInfo } from './requests/realt-communitary-api';
import { fetchPropertyList } from './requests/realt-communitary-api';

import { fetchGraphQLData } from './requests/xdaiGraphQLRequest';
import { fetchRMMGraphQLData } from './requests/rmmGraphQLRequest';
import { fetchETHGraphQLData } from './requests/ethGraphQLRequest';

function App() {
  const [data, setData] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [propertyInfo, setPropertyInfo] = useState(null);

  const { i18n, t } = useTranslation();

  // realT wallet
  useEffect(() => {
     const fetchData = async () => {
       try {
         console.log("fetch property list")
         const allPropertyData = await fetchPropertyList();
         console.log(allPropertyData); // for view full data

         if (allPropertyData && Array.isArray(allPropertyData)) {
           const propertyInfoData = allPropertyData

            .filter((realtProperty) => !realtProperty.fullName.includes('OLD-')) // exclude tokens with "OLD-" in fullName
            .filter((realtProperty) => !realtProperty.sellPropertyTo.includes('us_investors_only')) // exclude us_investors_only // manage REG D & S for not double property

           .map((realtProperty) => {

             const uuid = realtProperty.uuid || 'N/A';
             const totalValue = (parseFloat(realtProperty.tokenPrice) * parseFloat(realtProperty.totalTokens)).toFixed(2);

             return {
               uuid: uuid,
               marketplaceLink: realtProperty.marketplaceLink,
               fullName: realtProperty.fullName,
               currency: realtProperty.currency,
               tokenPrice: realtProperty.tokenPrice,
               amount: realtProperty.totalTokens, // amount from blockchain
               totalValue: totalValue, // amount * tokenPrice
               type: realtProperty.propertyType,
               constructionYear: realtProperty.constructionYear,
               totalInvestment: realtProperty.totalInvestment, // total value
               squareFeet : realtProperty.squareFeet, // interior sqft
               // fee
               realtPlatform: realtProperty.realtPlatform, // realt Fee per Month
               realtPlatformPercent: realtProperty.realtPlatformPercent, // % realT fee per Month
               realtListingFee: realtProperty.realtListingFee, // RealT Listing Fee
               realtListingFeePercent: realtProperty.realtListingFeePercent, // RealT Listing %
               // rent
               netRentDayPerToken: realtProperty.netRentDayPerToken,  // netRentDayPerToken
               netRentMonthPerToken: realtProperty.netRentMonthPerToken,  // netRentMonthPerToken
               netRentYearPerToken: realtProperty.netRentYearPerToken,  // netRentYearPerToken
               // unit
               totalUnits: realtProperty.totalUnits,
               rentedUnits: realtProperty.rentedUnits,
               // subsidy
               subsidyBy:realtProperty.subsidyBy,
               // composition token
               underlyingAssetPrice: realtProperty.underlyingAssetPrice,
               miscellaneousCosts: realtProperty.miscellaneousCosts,
               renovationReserve: realtProperty.renovationReserve,
               initialMaintenanceReserve: realtProperty.initialMaintenanceReserve,
               // monthly Costs
               propertyManagement: realtProperty.propertyManagement,
               propertyMaintenanceMonthly: realtProperty.propertyMaintenanceMonthly,
               propertyTaxes: realtProperty.propertyTaxes,
               insurance: realtProperty.insurance,
               utilities: realtProperty.utilities,
               // invest :
               sellPropertyTo : realtProperty.sellPropertyTo,
               // rentStartDate
               rentStartDate : realtProperty.rentStartDate

             };
           });

           const filteredPropertyInfoData = propertyInfoData.filter((property) => property.uuid !== 'N/A');
           setPropertyInfo(filteredPropertyInfoData);
         }
       } catch (error) {
         console.error('Erreur lors de la requête initiale :', error);
         setPropertyInfo([]);
       }
     };

     fetchData();

   }, []);



  // user wallet from input
  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    console.log('searc value :', searchValue);

    if (searchValue === '') {
      window.location.reload(); // fix for moment, TODO : load use effect for get realT data
    }

    // if input have ethereum address
    try {
      // if have address in input
      console.log(searchValue);

      const xdaiData = await fetchGraphQLData(searchValue);
      console.log(xdaiData);
      const ethData = await fetchETHGraphQLData(searchValue);
      console.log(ethData);
      const rmmData = await fetchRMMGraphQLData(searchValue);
      console.log(rmmData);

      let xdaiPropertyAddresses = [];
      let ethPropertyAddresses = [];
      let rmmPropertyAddresses = [];

      if (xdaiData.data && xdaiData.data.accounts && xdaiData.data.accounts[0] && xdaiData.data.accounts[0].balances) {
        xdaiPropertyAddresses = xdaiData.data.accounts[0].balances.map((balance) => balance.token.address);
      }
      if (ethData.data && ethData.data.accounts && ethData.data.accounts[0] && ethData.data.accounts[0].balances) {
        ethPropertyAddresses = ethData.data.accounts[0].balances.map((balance) => balance.token.address);
      }
      if (rmmData.data && rmmData.data.users && rmmData.data.users[0] && rmmData.data.users[0].reserves) {
        rmmPropertyAddresses = rmmData.data.users[0].reserves.map((reserve) => reserve.reserve.underlyingAsset);
      }
      const combinedPropertyAddresses = [...xdaiPropertyAddresses, ...ethPropertyAddresses, ...rmmPropertyAddresses];

      const allProperties = await fetchPropertyList(); // get all property for compare with combinedPropertyAddresses

      let filteredProperties = allProperties.filter(property =>
          combinedPropertyAddresses.includes(property.uuid.toLowerCase())
      );

      const calculatePropertyDetails = (property) => {

        let amount = null;
        const address = property.uuid.toLowerCase();

        if (rmmPropertyAddresses.includes(address)) {
            const rmmReserve = rmmData.data.users[0].reserves.find(reserve => reserve.reserve.underlyingAsset === address);
            if (rmmReserve) {
                amount = parseFloat(rmmReserve.currentATokenBalance) / Math.pow(10, 18);
            }
        } else if (xdaiPropertyAddresses.includes(address) || ethPropertyAddresses.includes(address)) {
            const balanceData = xdaiData.data.accounts[0].balances.find(balance => balance.token.address === address) ||
                                ethData.data.accounts[0].balances.find(balance => balance.token.address === address);
            if (balanceData) {
                amount = parseFloat(balanceData.amount);
            }
        }
        if (amount !== null) {
            const uuid = property.uuid || 'N/A';
            const totalValue = (parseFloat(property.tokenPrice) * amount).toFixed(2);
            return {
               uuid: uuid,
               marketplaceLink: property.marketplaceLink,
               fullName: property.fullName,
               currency: property.currency,
               tokenPrice: property.tokenPrice,
               amount: amount, // amount from blockchain
               totalValue: totalValue, // amount * tokenPrice
               type: property.propertyType,
               constructionYear: property.constructionYear,
               totalInvestment: property.totalInvestment, // total value
               squareFeet : property.squareFeet, // interior sqft
               // fee
               realtPlatform: property.realtPlatform, // realt Fee per Month
               realtPlatformPercent: property.realtPlatformPercent, // % realT fee per Month
               realtListingFee: property.realtListingFee, // RealT Listing Fee
               realtListingFeePercent:property.realtListingFeePercent,  // RealT Listing %
               // rent
               netRentDayPerToken: property.netRentDayPerToken,  // totalNetRentDay
               netRentMonthPerToken: property.netRentMonthPerToken,  // totalNetRentMonth
               netRentYearPerToken: property.netRentYearPerToken,  // totalNetRentYear
               // unit
               totalUnits: property.totalUnits,
               rentedUnits: property.rentedUnits,
               // subsidy
               subsidyBy:property.subsidyBy,
               // composition token
               underlyingAssetPrice: property.underlyingAssetPrice,
               miscellaneousCosts: property.miscellaneousCosts,
               renovationReserve: property.renovationReserve,
               initialMaintenanceReserve: property.initialMaintenanceReserve,
               // monthly Costs
               propertyManagement: property.propertyManagement,
               propertyMaintenanceMonthly: property.propertyMaintenanceMonthly,
               propertyTaxes: property.propertyTaxes,
               insurance: property.insurance,
               utilities: property.utilities,
               // invest :
               sellPropertyTo : property.sellPropertyTo,
               // rentStartDate
               rentStartDate : property.rentStartDate
            };
          }
      };

      filteredProperties = filteredProperties
        .map(property => calculatePropertyDetails(property))
        .filter(property => property && property.uuid !== 'N/A');

      setPropertyInfo(filteredProperties);

    } catch (error) {
      console.error('Erreur lors de la recherche :', error);
      setPropertyInfo([]);

    } // end try/catch
  }; // end app function

  return (
    <div className="App">
    <header>
        <nav>
            <div class="logo">MyRealTStat</div>
            <form id="search-form" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder={t("app.EnterAddress")}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button type="submit">{t("app.search")}</button>
            </form>

            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
        </nav>
    </header>

      {propertyInfo && <HeaderProperty properties={propertyInfo} />}

      <div class="container-graph">
        {propertyInfo && <CityPropertyChart properties={propertyInfo} />}
        {propertyInfo && <StatePropertyChart properties={propertyInfo} />}
        {propertyInfo && <CountryPropertyChart properties={propertyInfo} />}
        {propertyInfo && <TypePropertyChart properties={propertyInfo} />}
        {propertyInfo && <SubsidyPropertyChart properties={propertyInfo} />}
        {propertyInfo && <CompositionTokenChart properties={propertyInfo} />}
        {propertyInfo && <MonthlyCostChart properties={propertyInfo} />}

        {propertyInfo && <CurrencieExpositionChart properties={propertyInfo} />}
        {propertyInfo && <UnitsPropertyChart properties={propertyInfo} />}
      </div>

      {propertyInfo && <PropertyInfo propertyInfo={propertyInfo} />}
    </div>
  );
}

export default App;
