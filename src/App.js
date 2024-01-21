import React, { useEffect, useState } from 'react';

import { useTranslation } from "react-i18next";
import i18n from "../src/utils/i18n.js";


import logo from './logo.svg';
import './App.css';

// router
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

import Dashboard from './components/Dashboard';
import About from './components/About';
import DashboardWallet from './components/DashboardWallet';

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
               // rent per token
               netRentDayPerToken: property.netRentDayPerToken,  // totalNetRentDay
               netRentMonthPerToken: property.netRentMonthPerToken,  // totalNetRentMonth
               netRentYearPerToken: property.netRentYearPerToken,  // totalNetRentYear
               // rent
               netRentDay: property.netRentDay,
               netRentMonth: property.netRentMonth,
               netRentYear: property.netRentYear,
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
  };

  return (
    <Router>
      <div className="App">
        <header>
          <nav>
            <div className="logo">MyRealTStat</div>

            <Link to="/">Dashboard</Link>
            <Link to="/about">À propos</Link>

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

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/about" element={<About />} />

          <Route path="/dashboard-wallet" element={<DashboardWallet />} />
        </Routes>
      </div>
    </Router>
  );

}; // end app function

export default App;
