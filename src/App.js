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
      // Effectuez la requête XDai
      const xdaiData = await fetchGraphQLData(searchValue);
      // Effectuez la requête RMM
      const rmmData = await fetchRMMGraphQLData([searchValue]); // Utilisez [searchValue] comme liste d'adresses

      // Obtenez les adresses des propriétés depuis les résultats XDai et RMM
      const xdaiPropertyAddresses = xdaiData.data.accounts[0]?.balances.map((balance) => balance.token.address) || [];
      const rmmPropertyAddresses = rmmData.data.users[0]?.reserves.map((reserve) => reserve.reserve.underlyingAsset) || [];

      // Combinez les adresses de propriété de XDai et RMM
      const combinedPropertyAddresses = [...xdaiPropertyAddresses, ...rmmPropertyAddresses];

      // Obtenez les données de propriété pour chaque adresse à partir de l'API communautaire
      const propertyInfoPromises = combinedPropertyAddresses.map(async (address) => {
        // Utilisez une fonction pour récupérer les données de propriété depuis l'API communautaire (à ajuster selon votre structure de données)
        const propertyData = await fetchPropertyInfo(address);
        return {
          uuid: propertyData.uuid,
          fullName: propertyData.fullName,
          tokenPrice: propertyData.tokenPrice,
          // Autres données de propriété...
        };
      });

      // Attendez que toutes les promesses de données de propriété soient résolues
      const propertyInfoData = await Promise.all(propertyInfoPromises);

      // Mise à jour de l'état avec les données de propriété combinées
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


      {propertyInfo && <CityPropertyChart properties={propertyInfo} />}

    </div>
  );
}

export default App;
