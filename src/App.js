import React, { useEffect, useState } from 'react';

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

  // realT wallet
  useEffect(() => {
     const fetchData = async () => {
       try {
         const allPropertyData = await fetchPropertyList();

         if (allPropertyData && Array.isArray(allPropertyData)) {
           const propertyInfoData = allPropertyData.map((property) => {
             const uuid = property.uuid || 'N/A';
             const totalValue = (parseFloat(property.tokenPrice) * parseFloat(property.totalTokens)).toFixed(2);

             return {
               uuid: uuid,
               marketplaceLink: property.marketplaceLink,
               fullName: property.fullName,
               currency: property.currency,
               tokenPrice: property.tokenPrice,
               amount: property.totalTokens, // amount from blockchain
               totalValue: totalValue, // amount * tokenPrice
               type: property.propertyType,
               constructionYear: property.constructionYear,
               totalInvestment: property.totalInvestment, // total value
               squareFeet : property.squareFeet, // interior sqft
               // fee
               realtPlatform: property.realtPlatform, // realt Fee per Month
               realtPlatformPercent: property.realtPlatformPercent, // % realT fee per Month
               realtListingFee: property.realtListingFee, // RealT Listing Fee
               realtListingFeePercent: property.realtListingFeePercent, // RealT Listing %
               // rent
               netRentDayPerToken: property.netRentDayPerToken,  // netRentDayPerToken
               netRentMonthPerToken: property.netRentMonthPerToken,  // netRentMonthPerToken
               netRentYearPerToken: property.netRentYearPerToken,  // netRentYearPerToken
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

    // if input have ethereum address
    try {
      // if have address in input
      console.log(searchValue);
      const xdaiData = await fetchGraphQLData(searchValue);
      console.log(xdaiData);

      console.log(searchValue);
      const ethData = await fetchETHGraphQLData(searchValue);
      console.log(ethData);

      console.log(searchValue);
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
      const propertyInfoPromises = [];

      // TODO : fix MAX_CONCURRENT_REQUESTS with all https://dashboard.realt.community/api/properties data
      const MAX_CONCURRENT_REQUESTS = 3; // limit 3 concurent request for CORS bug from localhost

      for (let i = 0; i < combinedPropertyAddresses.length; i += MAX_CONCURRENT_REQUESTS) {
        const batch = combinedPropertyAddresses.slice(i, i + MAX_CONCURRENT_REQUESTS);

        const batchPromises = batch.map(async (address) => {
          const propertyData = await fetchPropertyInfo(address);
          let amount = null;

            if (propertyData) { // Check if propertyData is defined
              if (rmmPropertyAddresses.includes(address)) {
                const rmmReserve = rmmData.data.users[0].reserves.find((reserve) => reserve.reserve.underlyingAsset === address);
                if (rmmReserve) {
                  amount = parseFloat(rmmReserve.currentATokenBalance) / Math.pow(10, 18);
                  amount = amount.toFixed(2);
                }
              } else if (xdaiPropertyAddresses.includes(address) || ethPropertyAddresses.includes(address)) {
                const balanceData = xdaiData.data.accounts[0].balances.find((balance) => balance.token.address === address) ||
                                    ethData.data.accounts[0].balances.find((balance) => balance.token.address === address);

                if (balanceData) {
                  amount = parseFloat(balanceData.amount);
                }
              }

              if (amount !== null) { // Check if amount is not null
                propertyData.amount = amount;

                // If uuid is not available, use a placeholder value (e.g., 'N/A')
                const uuid = propertyData.uuid || 'N/A';
                const totalValue = (parseFloat(propertyData.tokenPrice) * parseFloat(propertyData.amount)).toFixed(2);

                return {
                  uuid: uuid,
                  marketplaceLink: propertyData.marketplaceLink,
                  fullName: propertyData.fullName,
                  currency: propertyData.currency,
                  tokenPrice: propertyData.tokenPrice,
                  amount: propertyData.amount, // amount from blockchain
                  totalValue: totalValue, // amount * tokenPrice
                  type: propertyData.propertyType,
                  constructionYear: propertyData.constructionYear,
                  totalInvestment: propertyData.totalInvestment, // total value
                  squareFeet : propertyData.squareFeet, // interior sqft
                  // fee
                  realtPlatform: propertyData.realtPlatform, // realt Fee per Month
                  realtPlatformPercent: propertyData.realtPlatformPercent, // % realT fee per Month
                  realtListingFee: propertyData.realtListingFee, // RealT Listing Fee
                  realtListingFeePercent:propertyData.realtListingFeePercent,  // RealT Listing %
                  // rent
                  netRentDayPerToken: propertyData.netRentDayPerToken,  // totalNetRentDay
                  netRentMonthPerToken: propertyData.netRentMonthPerToken,  // totalNetRentMonth
                  netRentYearPerToken: propertyData.netRentYearPerToken,  // totalNetRentYear
                  // unit
                  totalUnits: propertyData.totalUnits,
                  rentedUnits: propertyData.rentedUnits,
                  // subsidy
                  subsidyBy:propertyData.subsidyBy,
                  // composition token
                  underlyingAssetPrice: propertyData.underlyingAssetPrice,
                  miscellaneousCosts: propertyData.miscellaneousCosts,
                  renovationReserve: propertyData.renovationReserve,
                  initialMaintenanceReserve: propertyData.initialMaintenanceReserve,
                  // monthly Costs
                  propertyManagement: propertyData.propertyManagement,
                  propertyMaintenanceMonthly: propertyData.propertyMaintenanceMonthly,
                  propertyTaxes: propertyData.propertyTaxes,
                  insurance: propertyData.insurance,
                  utilities: propertyData.utilities,
                };
              }
            }
            return null; // Exclude this property if any condition above is not met
          });

          const batchResults = await Promise.all(batchPromises);
          propertyInfoPromises.push(...batchResults);
        }

        // Filter out properties with uuid set to 'N/A'
        const propertyInfoData = propertyInfoPromises.filter((property) => property && property.uuid !== 'N/A');

        setPropertyInfo(propertyInfoData);
      } catch (error) {
        console.error('Erreur lors de la recherche :', error);
        setPropertyInfo([]);
      }
    };

  return (
    <div className="App">

      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Entrez une adresse"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button type="submit">Rechercher</button>
      </form>

      {propertyInfo && <HeaderProperty properties={propertyInfo} />}

      <div class="container-graph">
        {propertyInfo && <CityPropertyChart properties={propertyInfo} />}
        {propertyInfo && <StatePropertyChart properties={propertyInfo} />}
        {propertyInfo && <CountryPropertyChart properties={propertyInfo} />}
        {propertyInfo && <TypePropertyChart properties={propertyInfo} />}
        {propertyInfo && <CurrencieExpositionChart properties={propertyInfo} />}
        {propertyInfo && <UnitsPropertyChart properties={propertyInfo} />}
        {propertyInfo && <SubsidyPropertyChart properties={propertyInfo} />}
        {propertyInfo && <CompositionTokenChart properties={propertyInfo} />}
        {propertyInfo && <MonthlyCostChart properties={propertyInfo} />}
      </div>

      {propertyInfo && <PropertyInfo propertyInfo={propertyInfo} />}

    </div>
  );
}

export default App;
