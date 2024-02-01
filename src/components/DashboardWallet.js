import React, { useEffect, useState } from 'react';

import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

import { fetchPropertyInfo } from '../requests/realt-communitary-api';
import { fetchPropertyList } from '../requests/realt-communitary-api';

import { fetchGraphQLData } from '../requests/xdaiGraphQLRequest';
import { fetchRMMGraphQLData } from '../requests/rmmGraphQLRequest';
import { fetchETHGraphQLData } from '../requests/ethGraphQLRequest';

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

import PropertyInfo from '../components/PropertyInfo';
import HeaderProperty from '../components/HeaderProperty';

import { fetchInfoForOneWallet, mergeDifferentWallet } from '../utils/walletData';

// props must be is walletAddresses (array wallet)
const DashboardWallet = ({ walletAddresses }) => {

  const [propertyInfo, setPropertyInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!walletAddresses || walletAddresses.length === 0) {
        setPropertyInfo([]);
        return;
      }

      try {
        const walletDataPromises = walletAddresses.map(fetchInfoForOneWallet);
        console.log('walletDataPromises', walletDataPromises);

        const walletsDataResults = await Promise.allSettled(walletDataPromises);
        console.log('walletsDataResults', walletsDataResults);

        const successfulWalletsData = walletsDataResults
          .filter(result => result.status === 'fulfilled')
          .map(result => result.value);
        console.log('successfulWalletsData', successfulWalletsData);

        const mergedData = await mergeDifferentWallet(successfulWalletsData);
        setPropertyInfo(mergedData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données des wallets:', error);
        setPropertyInfo([]);
      }
    };
    fetchData();
  }, [walletAddresses]);

  return (
    <div className="App">
      <header class="header-second">
        <nav class="nav-second">
          <Link to="/">RealT Statistique</Link>
          <Link to="/dashboard-wallet">Wallet Statistique</Link>
       </nav>
     </header>

     <h1> search for {walletAddresses ? walletAddresses.join(', ') : ''} </h1>


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
};

export default DashboardWallet;
