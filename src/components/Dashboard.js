import React, { useState, useEffect } from 'react';
// Importez les composants que vous utilisiez dans App pour le dashboard

import { useTranslation } from "react-i18next";

import PropertyInfo from '../components/PropertyInfo';
import HeaderProperty from '../components/HeaderProperty';

// chart
import CityPropertyChart from '../components/chart/CityPropertyChart';
import StatePropertyChart from '../components/chart/StatePropertyChart';
import CountryPropertyChart from '../components/chart/CountryPropertyChart';
import CurrencieExpositionChart from '../components/chart/CurrencieExpositionChart';
import TypePropertyChart from '../components/chart/TypePropertyChart';
import UnitsPropertyChart from '../components/chart/UnitsPropertyChart';
import SubsidyPropertyChart from '../components/chart/SubsidyPropertyChart';
import CompositionTokenChart from '../components/chart/CompositionTokenChart';
import MonthlyCostChart from '../components/chart/MonthlyCostChart';

import { fetchPropertyInfo } from '../requests/realt-communitary-api';
import { fetchPropertyList } from '../requests/realt-communitary-api';

import { fetchGraphQLData } from '../requests/xdaiGraphQLRequest';
import { fetchRMMGraphQLData } from '../requests/rmmGraphQLRequest';
import { fetchETHGraphQLData } from '../requests/ethGraphQLRequest';

// router
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

const Dashboard = () => {
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
               // rent per token
               netRentDayPerToken: realtProperty.netRentDayPerToken,  // netRentDayPerToken
               netRentMonthPerToken: realtProperty.netRentMonthPerToken,  // netRentMonthPerToken
               netRentYearPerToken: realtProperty.netRentYearPerToken,  // netRentYearPerToken
               // rent
               netRentDay: realtProperty.netRentDay,
               netRentMonth: realtProperty.netRentMonth,
               netRentYear: realtProperty.netRentYear,
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

     return (
       <div className="App">
       <header class="header-second">
         <nav class="nav-second">
           <Link to="/">RealT Statistique</Link>
           <Link to="/dashboard-wallet">Wallet Statistique</Link>
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
}; // end app function

export default Dashboard;
