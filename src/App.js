import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

import PropertyInfo from './components/PropertyInfo';
import { PropertyService } from '@realtoken/realt-commons'; // maybe is not function

import { fetchPropertyInfo } from './requests/realt-communitary-api';
import { fetchGraphQLData } from './requests/xdaiGraphQLRequest';

function App() {
  const [data, setData] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [propertyInfo, setPropertyInfo] = useState(null);

  const handleSearchSubmit = async (event) => {
    event.preventDefault();

    try {
      // get data from TheGraph
      const searchData = await fetchGraphQLData(searchValue);

      if (searchData.data && searchData.data.accounts && searchData.data.accounts.length > 0) {
        const properties = searchData.data.accounts[0].balances;

        // get data from realt api
        const propertyInfoPromises = properties.map(async (balance) => {
          const propertyAddress = balance.token.address;
          const propertyData = await fetchPropertyInfo(propertyAddress);
          return {
            uuid: propertyData.uuid,
            fullName: propertyData.fullName,
            tokenPrice: propertyData.tokenPrice,
            amount: balance.amount,
          };
        });

        const propertyInfo = await Promise.all(propertyInfoPromises);

        // calculate value for each property
        propertyInfo.forEach((property) => {
          property.totalValue = (parseFloat(property.tokenPrice) * parseFloat(property.amount)).toFixed(2);
        });

        setPropertyInfo(propertyInfo);
      } else {
        console.log('Aucune balance trouvée dans les comptes.');
        setPropertyInfo([]);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche sur TheGraph ou l\'API RealT :', error);
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

    </div>
  );
}

export default App;
