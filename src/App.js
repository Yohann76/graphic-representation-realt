import React, { useEffect, useState } from 'react';

import logo from './logo.svg';
import './App.css';

import PropertyInfo from './components/PropertyInfo';
import CityPropertyChart from './components/CityPropertyChart';
import StatePropertyChart from './components/StatePropertyChart';
import CountryPropertyChart from './components/CountryPropertyChart';
import CurrencieExpositionChart from './components/CurrencieExpositionChart';

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

  const handleSearchSubmit = async (event) => {
    event.preventDefault();

    try {
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
                  fullName: propertyData.fullName,
                  currency: propertyData.currency,
                  tokenPrice: propertyData.tokenPrice,
                  amount: propertyData.amount,
                  totalValue: totalValue,
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

      {propertyInfo && <PropertyInfo propertyInfo={propertyInfo} />}
      <div class="container-graph">
        {propertyInfo && <CityPropertyChart properties={propertyInfo} />}
        {propertyInfo && <StatePropertyChart properties={propertyInfo} />}
        {propertyInfo && <CountryPropertyChart properties={propertyInfo} />}
        {propertyInfo && <CurrencieExpositionChart properties={propertyInfo} />}
      </div>

    </div>
  );
}

export default App;
