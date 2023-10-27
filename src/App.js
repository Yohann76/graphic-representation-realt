import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

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

    // request GraphQL for wallet
    try {
      const searchData = await fetchGraphQLData(searchValue);
      setSearchResults(searchData);

      if (searchData.data && searchData.data.accounts && searchData.data.accounts.length > 0) {
        // console.log('Données de recherche :', searchData.data); // TheGraph result
        const properties = searchData.data.accounts[0].balances.map((balance) => balance.token.address);
        // request realt-communitary api
        const propertyInfoPromises = properties.map((propertyAddress) => fetchPropertyInfo(propertyAddress));
        const propertyInfo = await Promise.all(propertyInfoPromises);
        // console.log('Informations sur les propriétés :', propertyInfo); // realt-communitary api result
        setPropertyInfo(propertyInfo);
      } else {
        console.log('Aucune balance trouvée dans les comptes.');
      }
    } catch (error) {
      console.error('Erreur lors de la recherche sur TheGraph :', error);
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

      {/* Afficher les données de l'API RealT */}
      {propertyInfo && (
        <div className="property-info-container">
          <h2>Informations sur les propriétés :</h2>
          <ul>
            {propertyInfo.map((property, index) => (
              <li key={index}>
                <h3>Propriété {index + 1} :</h3>
                <p>Adresse du contrat (UUID) : {property.uuid}</p>
                <p>Nom de la propriété : {property.fullName}</p>
                <p>Description : {property.tokenPrice}</p>
                {/* Ajoutez d'autres détails de la propriété ici */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
