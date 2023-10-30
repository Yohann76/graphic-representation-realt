import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

import PropertyInfo from './components/PropertyInfo';
import CityPropertyChart from './components/CityPropertyChart';

// import { PropertyService } from '@realtoken/realt-commons'; // not use // maybe is not function

import { fetchPropertyInfo } from './requests/realt-communitary-api';
import { fetchGraphQLData } from './requests/xdaiGraphQLRequest';
import { fetchRMMGraphQLData } from './requests/rmmGraphQLRequest';

function App() {
  const [data, setData] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [propertyInfo, setPropertyInfo] = useState(null);

  const handleSearchSubmit = async (event) => {
    event.preventDefault();

    try {
      const xdaiData = await fetchGraphQLData(searchValue);
      console.log(xdaiData);

      const rmmData = await fetchRMMGraphQLData(searchValue);
      console.log(rmmData);

      if (
        xdaiData &&
        xdaiData.data &&
        xdaiData.data.accounts &&
        xdaiData.data.accounts[0] &&
        xdaiData.data.accounts[0].balances
      ) {
        const xdaiPropertyAddresses = xdaiData.data.accounts[0].balances.map((balance) => balance.token.address) || [];

        ///////////
        // Amount for xdai // amount = balance.amount if define
        ///////////

        if (
          rmmData &&
          rmmData.data &&
          rmmData.data.users &&
          rmmData.data.users[0] &&
          rmmData.data.users[0].reserves
        ) {
          const rmmPropertyAddresses = rmmData.data.users[0].reserves.map((reserve) => reserve.reserve.underlyingAsset) || [];
          console.log(rmmPropertyAddresses);

          ///////////
          // Amount for RMM // amount = use request graphrmm currentATokenBalance and decimals 5000000000000000000 / 10^18 = 5
          ///////////

          const combinedPropertyAddresses = [...xdaiPropertyAddresses, ...rmmPropertyAddresses];

          const propertyInfoPromises = combinedPropertyAddresses.map(async (address) => {
            const propertyData = await fetchPropertyInfo(address);
            return {
              uuid: propertyData.uuid,
              fullName: propertyData.fullName,
              tokenPrice: propertyData.tokenPrice,
              // amount = amount from rmm or from xdai

            };
          });

          const propertyInfoData = await Promise.all(propertyInfoPromises);

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
