import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

import PropertyInfo from './components/PropertyInfo';
import CityPropertyChart from './components/CityPropertyChart';

import { fetchPropertyInfo } from './requests/realt-communitary-api';
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
      // fetch xdai property in search value
      const xdaiData = await fetchGraphQLData(searchValue);
      console.log(xdaiData);

      // fetch eth property in search value
      const ethData = await fetchETHGraphQLData(searchValue);
      console.log(ethData);

      // fetch rmm property in search value
      const rmmData = await fetchRMMGraphQLData(searchValue);
      console.log(rmmData);

      if (xdaiData.data.accounts[0].balances) {

        const xdaiPropertyAddresses = xdaiData.data.accounts[0].balances.map((balance) => balance.token.address) || [];
        if (rmmData.data.users[0].reserves) {
          const rmmPropertyAddresses = rmmData.data.users[0].reserves.map((reserve) => reserve.reserve.underlyingAsset) || [];
          console.log(rmmPropertyAddresses);
          const combinedPropertyAddresses = [...xdaiPropertyAddresses, ...rmmPropertyAddresses];
          const propertyInfoPromises = combinedPropertyAddresses.map(async (address) => {
            const propertyData = await fetchPropertyInfo(address);
            let amount = null;
            // if adress from rmm
            if (rmmPropertyAddresses.includes(address)) {
              const rmmReserve = rmmData.data.users[0].reserves.find(
                (reserve) => reserve.reserve.underlyingAsset === address
              );
              if (rmmReserve) {
                const currentATokenBalance = parseFloat(rmmReserve.currentATokenBalance) / Math.pow(10, 18); // calcul from decimals to thegraph response
                amount = currentATokenBalance.toFixed(2); // for 2 decimal
              }
            } else {
              // if adress from wdai, use balance
              const xdaiBalance = xdaiData.data.accounts[0].balances.find(
                (balance) => balance.token.address === address
              );
              if (xdaiBalance) {
                amount = parseFloat(xdaiBalance.amount);
              }
            }
            propertyData.amount = amount;
            return {
              uuid: propertyData.uuid,
              fullName: propertyData.fullName,
              tokenPrice: propertyData.tokenPrice,
              amount: propertyData.amount,
            };
          });

          const propertyInfoData = await Promise.all(propertyInfoPromises);
          // calculate value for each property
          propertyInfoData.forEach((property) => {
            property.totalValue = (parseFloat(property.tokenPrice) * parseFloat(property.amount)).toFixed(2);
          });
          setPropertyInfo(propertyInfoData);
        } else {
          console.log('Aucune donnée RMM valide trouvée.');
          setPropertyInfo([]);
        }
      } else {
        console.log('Aucune donnée XDai valide trouvée.');
        setPropertyInfo([]);
      }
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

      {propertyInfo && <CityPropertyChart properties={propertyInfo} />}

    </div>
  );
}

export default App;
